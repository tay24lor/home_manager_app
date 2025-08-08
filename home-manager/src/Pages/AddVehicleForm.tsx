// Example usage in a React component
import React, { useState } from "react";
import { addVehicle } from "../firebase";
import type { Vehicle } from "../types/Vehicle";

interface AddVehicleFormProps {
    onAdd: (vehicle: Vehicle) => void;
    onClose: () => void;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({ onAdd }) => {
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [mileage, setMileage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newVehicleData = {
            make,
            model,
            year: Number(year),
            mileage: Number(mileage),
        };
        const newVehicle = await addVehicle(newVehicleData);
        onAdd(newVehicle); // Update parent state/UI
        setMake("");
        setModel("");
        setYear("");
        setMileage("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={make} onChange={e => setMake(e.target.value)} placeholder="Make" required />
            <input value={model} onChange={e => setModel(e.target.value)} placeholder="Model" required />
            <input value={year} onChange={e => setYear(e.target.value)} placeholder="Year" required type="number" />
            <input value={mileage} onChange={e => setMileage(e.target.value)} placeholder="Mileage" required type="number" />
            <button type="submit">Add Vehicle</button>
        </form>
    );
};

export default AddVehicleForm;