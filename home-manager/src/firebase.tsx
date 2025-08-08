import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import type { Vehicle } from "./types/Vehicle";
import type { Maintenance } from "./types/maintenance";

const firebaseConfig = {
    apiKey: "AIzaSyBiniIS4WNM0CJJatMoWZ1Vb1Y-A6a-J4Y",
    authDomain: "home-manager-db.firebaseapp.com",
    projectId: "home-manager-db",
    storageBucket: "home-manager-db.firebasestorage.app",
    messagingSenderId: "394139811023",
    appId: "1:394139811023:web:ea30343d756ebf4068cbba",
    measurementId: "G-LMD7VQXNPR",
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

// Helper function to get current date in YYYY-MM-DD format using local timezone
export function getCurrentDateString(): string {
    return new Date().toLocaleDateString('en-CA'); // Returns YYYY-MM-DD in local timezone
}


// Add a new vehicle
export async function addVehicle(vehicle: Omit<Vehicle, "id">) {
    console.log("Adding vehicle:", vehicle);
    const docRef = await addDoc(collection(db, "vehicles"), vehicle);
    return {id: docRef.id, ...vehicle };
}

// Add a new maintenance
export async function addMaintenance(maintenance: Omit<Maintenance, "id">) {
    const docRef = await addDoc(collection(db, "maintenance"), maintenance);
    return {id: docRef.id, ...maintenance };
}

// Update an existing vehicle
export async function updateVehicle(id: string, data: Partial<Vehicle>) {
    const docRef = doc(db, "vehicles", id);
    await updateDoc(docRef, data);
}

// Delete a vehicle
export async function deleteVehicle(id: string) {
    const docRef = doc(db, "vehicles", id);
    await deleteDoc(docRef);
}

export async function getVehicles(): Promise<Vehicle[]> {
    const vehiclesCol = collection(db, "vehicles");
    const vehicleSnapshot = await getDocs(vehiclesCol);
    return vehicleSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as unknown as Vehicle));
}

// Test Firebase connection
export async function testFirebaseConnection(): Promise<boolean> {
    try {
        console.log("Testing Firebase connection...");
        const testCol = collection(db, "vehicles");
        await getDocs(testCol);
        console.log("Firebase connection successful");
        return true;
    } catch (error) {
        console.error("Firebase connection failed:", error);
        return false;
    }
}

// Get all maintenance records (for debugging)
export async function getAllMaintenanceRecords(): Promise<Maintenance[]> {
    try {
        console.log("Fetching ALL maintenance records...");
        const maintenanceCol = collection(db, "maintenance");
        const snapshot = await getDocs(maintenanceCol);
        const records = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as unknown as Maintenance));
        console.log("All maintenance records:", records);
        return records;
    } catch (error) {
        console.error("Error fetching all maintenance records:", error);
        return [];
    }
}

// Get maintenance records for a specific vehicle
// Note: Using simple query without orderBy to avoid Firebase index requirements
// If you want to use orderBy in the future, create a composite index in Firebase:
// Collection: maintenance, Fields: vehicleId (Ascending), date (Descending)
export async function getMaintenanceForVehicle(vehicleId: string): Promise<Maintenance[]> {
    try {
        console.log("Firebase: Starting maintenance query for vehicleId:", vehicleId);
        
        const maintenanceCol = collection(db, "maintenance");
        console.log("Firebase: Collection reference created");
        
        // Use simple query without orderBy to avoid index requirements
        const q = query(
            maintenanceCol,
            where("vehicleId", "==", vehicleId)
        );
        console.log("Firebase: Simple query created (no orderBy)");
        
        const maintenanceSnapshot = await getDocs(q);
        console.log("Firebase: Query executed, got", maintenanceSnapshot.docs.length, "documents");
        
        let records = maintenanceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as unknown as Maintenance));
        
        // Always sort by date descending since we're not using orderBy in the query
        if (records.length > 0) {
            records = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            console.log("Firebase: Records sorted by date (newest first)");
        }
        
        console.log("Firebase: Processed records:", records);
        console.log("Firebase: Query completed successfully without index requirements");
        return records;
    } catch (error) {
        console.error("Firebase: Error in getMaintenanceForVehicle:", error);
        console.error("Firebase: Error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            vehicleId: vehicleId,
            errorType: error instanceof Error ? error.constructor.name : 'Unknown'
        });
        throw error; // Re-throw to let the calling function handle it
    }
}
