import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home";
import Carlist from './Pages/CarList';
import VehicleDetails from "./assets/VehicleDetails";
import type { Vehicle } from './types/Vehicle';
import { getVehicles } from "./firebase";

/* const initialVehicles: Vehicle[] = [
    { id: 1, make: 'Toyota', model: 'Corolla LE', year: 2015, mileage: 40000 },
    { id: 2, make: 'Lexus', model: 'GX 470', year: 2004, mileage: 60000 },
]; */

const App: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        async function fetchVehicles() {
            const dbVehicles = await getVehicles();
            setVehicles(dbVehicles);
        }
        fetchVehicles();
    }, []);

    const handleAddVehicle = (vehicle: Vehicle) => {
        setVehicles(prevVehicles => [...prevVehicles, vehicle]);
    };

    // Example: update vehicle mileage
    const handleUpdateVehicle = (id: string, newMileage: number) => {
        setVehicles(vehicles =>
            vehicles.map(v =>
                v.id.toString() === id ? { ...v, mileage: newMileage } : v
            )
        );
    };

    const handleDeleteVehicle = (id: string) => {
        setVehicles(vehicles => vehicles.filter(v => v.id.toString() !== id));
    };

    // Pass setVehicles or handleUpdateVehicle to children as needed
    return ( 
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                    path="/carlist" 
                    element={
                    <Carlist vehicles={vehicles} onAddVehicle={handleAddVehicle} />
                }
                />
                <Route
                    path="/vehicles/:id"
                    element={
                        <VehicleDetails
                            vehicles={vehicles}
                            onUpdateVehicle={handleUpdateVehicle}
                            onDeleteVehicle={handleDeleteVehicle}
                        />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
