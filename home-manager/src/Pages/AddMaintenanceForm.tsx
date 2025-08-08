// Example usage in a React component
import React, { useState } from "react";
import { addMaintenance, getCurrentDateString } from "../firebase";
import type { Maintenance } from "../types/maintenance";

interface AddMaintenanceFormProps {
    vehicleId: string;
    onAdd: (maintenance: Maintenance) => void;
    onClose: () => void;
}

const AddMaintenanceForm: React.FC<AddMaintenanceFormProps> = ({ vehicleId, onAdd, onClose }) => {
    const [date, setDate] = useState(getCurrentDateString());
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!description.trim() || !cost.trim()) {
            alert("Please fill in all fields");
            return;
        }

        const newMaintenanceData = {
            vehicleId,
            date,
            description: description.trim(),
            cost: Number(cost),
        };

        try {
            const newMaintenance = await addMaintenance(newMaintenanceData);
            onAdd(newMaintenance);
            onClose();
        } catch (error) {
            console.error("Error adding maintenance:", error);
            alert("Failed to add maintenance. Please try again.");
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="overlay">
            <div className="maintenance-form-modal">
                <h3>Add Maintenance Record</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Describe the maintenance performed..."
                            required
                            rows={3}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="cost">Cost ($):</label>
                        <input
                            id="cost"
                            type="number"
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>
                    
                    <div className="form-buttons">
                        <button type="button" onClick={handleCancel} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Add Maintenance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaintenanceForm;