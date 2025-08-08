import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Vehicle } from '../types/Vehicle';
import type { Maintenance } from '../types/Maintenance';
import "../styles/VehicleDetails.css"
import { updateVehicle, deleteVehicle, getMaintenanceForVehicle, testFirebaseConnection, getAllMaintenanceRecords, addMaintenance, getCurrentDateString } from "../firebase";
import AddMaintenanceForm from "../Pages/AddMaintenanceForm";

interface VehicleDetailsProps {
    vehicles: Vehicle[];
    onUpdateVehicle: (id: string, newMileage: number) => void;
    onDeleteVehicle: (id: string) => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicles, onUpdateVehicle, onDeleteVehicle }) => {
    const navigate = useNavigate();
    const navNumber = -1;

    const { id } = useParams<{ id: string }>();
    const vehicle = vehicles.find(v => v.id.toString() === id);

    // Use state for mileage input
    const [mileageInput, setMileageInput] = useState("");
    // State for confirmation popup
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    // State for maintenance form
    const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
    // State for maintenance records
    const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);
    const [loadingMaintenance, setLoadingMaintenance] = useState(true);

    // Fetch maintenance records when vehicle changes
    useEffect(() => {
        if (vehicle) {
            const fetchMaintenance = async () => {
                try {
                    setLoadingMaintenance(true);
                    console.log("=== INITIAL MAINTENANCE FETCH ===");
                    console.log("Vehicle object:", vehicle);
                    console.log("Vehicle ID type:", typeof vehicle.id);
                    console.log("Vehicle ID value:", vehicle.id);
                    console.log("Vehicle ID as string:", vehicle.id.toString());
                    
                    const records = await getMaintenanceForVehicle(vehicle.id.toString());
                    console.log("Loaded maintenance records:", records.length, "records");
                    console.log("Records:", records);
                    setMaintenanceRecords(records);
                } catch (error) {
                    console.error("Error fetching maintenance records:", error);
                    console.error("Error details:", {
                        message: error instanceof Error ? error.message : 'Unknown error',
                        vehicleId: vehicle.id.toString()
                    });
                } finally {
                    setLoadingMaintenance(false);
                }
            };
            fetchMaintenance();
        }
    }, [vehicle]);

    if (!vehicle) {
        return <div>Vehicle not found.</div>;
    }

    function goBack() { navigate(navNumber); }

    async function handleUpdateVehicle(vehicleId: string, newMileage: number) {
        await updateVehicle(vehicleId, {mileage: newMileage});
        onUpdateVehicle(vehicleId, newMileage);
    }

    async function handleDeleteVehicle(vehicleId: string) {
        await deleteVehicle(vehicleId);
        onDeleteVehicle(vehicleId);
        navigate("/carlist");
    }

    function openDeleteConfirmation() {
        setShowDeleteConfirmation(true);
    }

    function closeDeleteConfirmation() {
        setShowDeleteConfirmation(false);
    }

    function confirmDelete() {
        if (vehicle) {
            handleDeleteVehicle(vehicle.id.toString());
        }
        closeDeleteConfirmation();
    }

    function openMaintenanceForm() {
        setShowMaintenanceForm(true);
    }

    function closeMaintenanceForm() {
        setShowMaintenanceForm(false);
    }

    async function handleAddMaintenance(maintenance: Maintenance) {
        if (!vehicle) return;
        
        try {
            // Refetch maintenance records from Firebase to ensure consistency
            const updatedRecords = await getMaintenanceForVehicle(vehicle.id.toString());
            setMaintenanceRecords(updatedRecords);
            console.log("Maintenance added:", maintenance);
            closeMaintenanceForm();
        } catch (error) {
            console.error("Error refreshing maintenance records:", error);
            // Fallback: add to local state if refetch fails
            setMaintenanceRecords(prev => [maintenance, ...prev]);
            closeMaintenanceForm();
        }
    }

    async function refreshMaintenanceRecords() {
        if (!vehicle) return;
        
        try {
            setLoadingMaintenance(true);
            console.log("Manually refreshing maintenance records for vehicle:", vehicle.id);
            console.log("Vehicle ID being used:", vehicle.id.toString());
            
            // Test Firebase connection first
            const isConnected = await testFirebaseConnection();
            if (!isConnected) {
                throw new Error("Firebase connection failed");
            }
            
            const records = await getMaintenanceForVehicle(vehicle.id.toString());
            console.log("Maintenance records refreshed successfully:", records.length, "records");
            console.log("Records:", records);
            setMaintenanceRecords(records);
        } catch (error) {
            console.error("Error refreshing maintenance records:", error);
            console.error("Error details:", {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                vehicleId: vehicle.id.toString()
            });
            
            // Show more specific error message
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to refresh maintenance records: ${errorMessage}\n\nPlease check your internet connection and try again.`);
        } finally {
            setLoadingMaintenance(false);
        }
    }

    async function debugMaintenanceRecords() {
        try {
            console.log("=== DEBUGGING MAINTENANCE RECORDS ===");
            console.log("Current vehicle ID:", vehicle?.id);
            
            // Test connection
            const isConnected = await testFirebaseConnection();
            console.log("Firebase connected:", isConnected);
            
            // Get all maintenance records
            const allRecords = await getAllMaintenanceRecords();
            console.log("Total maintenance records in database:", allRecords.length);
            console.log("All records:", allRecords);
            
            // Get records for this specific vehicle
            const vehicleRecords = await getMaintenanceForVehicle(vehicle?.id.toString() || "");
            console.log("Records for this vehicle:", vehicleRecords);
            
            // Test adding a maintenance record
            if (vehicle) {
                console.log("Testing maintenance record addition...");
                const testMaintenance = {
                    vehicleId: vehicle.id.toString(),
                    date: getCurrentDateString(),
                    description: "Test maintenance record",
                    cost: 0
                };
                console.log("Test maintenance data:", testMaintenance);
                
                try {
                    const addedRecord = await addMaintenance(testMaintenance);
                    console.log("Successfully added test record:", addedRecord);
                    alert(`Debug complete!\n\nTotal records: ${allRecords.length}\nVehicle records: ${vehicleRecords.length}\nTest record added successfully!\n\nCheck console for details.`);
                } catch (addError) {
                    console.error("Failed to add test record:", addError);
                    alert(`Debug complete!\n\nTotal records: ${allRecords.length}\nVehicle records: ${vehicleRecords.length}\nFailed to add test record: ${addError instanceof Error ? addError.message : 'Unknown error'}\n\nCheck console for details.`);
                }
            } else {
                alert(`Debug complete!\n\nTotal records: ${allRecords.length}\nVehicle records: ${vehicleRecords.length}\n\nCheck console for details.`);
            }
        } catch (error) {
            console.error("Debug error:", error);
            alert(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    return (
        <div>
            <div className="menubar">
                <button onClick={goBack}>Back</button>
                <button
                    onClick={openDeleteConfirmation}
                    type="button"
                    id="delete"
                >
                    Delete
                </button>
            </div>
            
            <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
            
            <p>
                Mileage: {vehicle.mileage} {" "}
                <input
                    title="miles"
                    name="miles"
                    id="mileageUpdateAmount"
                    value={mileageInput}
                    onChange={e => setMileageInput(e.target.value)}
                />
                <button
                    onClick={() => handleUpdateVehicle(vehicle.id.toString(), parseInt(mileageInput))}
                    type="button"
                    id="edit"
                >
                    Update
                </button>
            </p>

            <details>
                <summary>
                    Maintenance Records
                    {maintenanceRecords.length > 0 && (
                        <span className="maintenance-summary">
                            {" "}({maintenanceRecords.length} records, Total: ${maintenanceRecords.reduce((sum, record) => sum + record.cost, 0).toFixed(2)})
                        </span>
                    )}
                </summary>
                <div className="maintenance-controls">
                    <button 
                        onClick={refreshMaintenanceRecords}
                        className="refresh-button"
                        disabled={loadingMaintenance}
                    >
                        {loadingMaintenance ? "Refreshing..." : "Refresh"}
                    </button>
                    <button 
                        onClick={debugMaintenanceRecords}
                        className="debug-button"
                    >
                        Debug
                    </button>
                </div>
                {loadingMaintenance ? (
                    <p>Loading maintenance records...</p>
                ) : maintenanceRecords.length === 0 ? (
                    <p>No maintenance records found.</p>
                ) : (
                    <div className="maintenance-list">
                        {maintenanceRecords.map((record) => (
                            <div key={record.id} className="maintenance-record">
                                <div className="maintenance-header">
                                    <span className="maintenance-date">
                                        {new Date(record.date).toLocaleDateString()}
                                    </span>
                                    <span className="maintenance-cost">
                                        ${record.cost.toFixed(2)}
                                    </span>
                                </div>
                                <div className="maintenance-description">
                                    {record.description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </details>

            <button id="add-maintenance" onClick={openMaintenanceForm}>Add Maintenance</button>
            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && (
                <div className="overlay">
                    <div className="delete-confirmation-modal">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete the {vehicle.year} {vehicle.make} {vehicle.model}?</p>
                        <p>This action cannot be undone.</p>
                        <div className="confirmation-buttons">
                            <button 
                                onClick={closeDeleteConfirmation}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="confirm-delete-button"
                            >
                                Delete Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Maintenance Form Modal */}
            {showMaintenanceForm && (
                <AddMaintenanceForm
                    vehicleId={vehicle.id.toString()}
                    onAdd={handleAddMaintenance}
                    onClose={closeMaintenanceForm}
                />
            )}
        </div>
    );
};

export default VehicleDetails;