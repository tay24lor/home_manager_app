import React from "react";
import type { Vehicle } from '../types/Vehicle';
import { useNavigate } from "react-router-dom";

interface VehicleCardProps {
    vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
    const navigate = useNavigate();

    function showDetails() {
        navigate(`/vehicles/${vehicle.id}`);
    }

    const vehicleModel = vehicle.model.toLowerCase();
    const isCorolla = vehicleModel === "corolla";
    const isGX = vehicleModel.includes("gx");

    const getVehicleImage = () => {
        if (isCorolla) {
            return "/corolla.jpg";
        } else if (isGX) {
            return "/gx.jpg";
        }
        return null;
    };

    const vehicleImage = getVehicleImage();

    return (
        <div className="vehicle-card">
            <button onClick={showDetails}>
                {vehicleImage && (
                    <img 
                        src={vehicleImage} 
                        alt={vehicle.model} 
                        className="vehicle-image"
                    />
                )}
                <span className="vehicle-text">{vehicle.model}</span>
            </button>
        </div>
    );
};

export default VehicleCard;