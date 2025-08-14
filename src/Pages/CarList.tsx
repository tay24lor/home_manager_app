import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/CarList.css";
import type { Vehicle } from '../types/Vehicle';
import VehicleCard from '../assets/VehicleCard';
import AddVehicleForm from './AddVehicleForm';

interface CarlistProps {
    vehicles: Vehicle[];
    onAddVehicle: (vehicle: Vehicle) => void;
}

const Carlist: React.FC<CarlistProps> = ({ vehicles, onAddVehicle }) => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [visible, setVisible] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    function goHome() {
        navigate(`/`)
    }

    function animateButton() {
        if (buttonRef.current) {
            buttonRef.current.style.transform = "scale(0.95)";
            setTimeout(() => {
                if (buttonRef.current) {
                    buttonRef.current.style.transform = "scale(1)";
                }
            }, 150);
        }
    }

    function handleAddClick() {
        if (!showForm) {
            setVisible(true);
            setTimeout(() => setShowForm(true), 10); // allow a tick for fade-in
            if (buttonRef.current) {
                buttonRef.current.innerText = "-";
                animateButton();
            }
        } else {
            handleFormClose();
        }
    }

    function handleFormClose() {
        setShowForm(false);
        setTimeout(() => setVisible(false), 300);
        if(buttonRef.current) {
            buttonRef.current.innerText = "+";
            animateButton();
        }
    }

    function handleAdd(vehicle: Vehicle) {
        onAddVehicle(vehicle);
        setShowForm(false);
    }

    return (
        <>
            <header id='list-header'>
                <button id='home-button' onClick={goHome}>
                    Home
                </button>
                <h1>Vehicles</h1>
            </header>
            
            
            <div className="vehicle-list">
                {vehicles.map(vehicle => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
            </div>
            <button type="button" id='addCarButton' ref={buttonRef} onClick={handleAddClick}>+</button>
            {visible && (
                <>
                    <div className={`overlay${showForm ? '' : ' hidden'}`} onClick={handleFormClose} />
                    <div className={`form-modal${showForm ? '' : ' hidden'}`}>
                        <AddVehicleForm onAdd={handleAdd} onClose={handleFormClose} />
                    </div>
                </>
            )}
        </>
    )
}

export default Carlist;
