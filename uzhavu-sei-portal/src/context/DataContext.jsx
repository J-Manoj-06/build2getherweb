import React, { createContext, useContext, useState, useEffect } from 'react';
import { AIService } from '../utils/aiService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [crops, setCrops] = useState([]);
    const [machinery, setMachinery] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // AI Integration
    const [aiInsights, setAiInsights] = useState({
        harvestCongestion: [],
        clusterRisk: null,
        machineryDemand: [],
        cooperative: []
    });

    useEffect(() => {
        // Load data from localStorage
        const storedCrops = JSON.parse(localStorage.getItem('crops') || '[]');
        const storedMachinery = JSON.parse(localStorage.getItem('machinery') || '[]');
        const storedBookings = JSON.parse(localStorage.getItem('bookings') || '[]');

        setCrops(storedCrops);
        setMachinery(storedMachinery);
        setBookings(storedBookings);

        // Load AI Insights
        const storedInsights = localStorage.getItem('ai_insights_v2');
        const parsedInsights = storedInsights ? JSON.parse(storedInsights) : null;

        if (parsedInsights && parsedInsights.harvestCongestion && parsedInsights.harvestCongestion.length > 0) {
            setAiInsights(parsedInsights);
        } else {
            console.log("Generating fresh AI insights...");
            // Generate fresh data if missing or empty
            const congestion = AIService.getHarvestCongestionForecast('cluster-1');
            const risk = AIService.generateClusterRiskScore('cluster-1');
            const demand = AIService.getMachineryDemandForecast();
            const coop = AIService.getCooperativeInsights('cluster-1');

            const newInsights = {
                harvestCongestion: congestion,
                clusterRisk: risk,
                machineryDemand: demand,
                cooperative: coop
            };

            setAiInsights(newInsights);
            localStorage.setItem('ai_insights_v2', JSON.stringify(newInsights));
        }

        setLoading(false);
    }, []);

    const addCrop = (cropData) => {
        const newCrops = [...crops, { ...cropData, id: Date.now().toString() }];
        setCrops(newCrops);
        localStorage.setItem('crops', JSON.stringify(newCrops));
    };

    const addMachinery = (machineryData) => {
        const newMachinery = [...machinery, { ...machineryData, id: Date.now().toString() }];
        setMachinery(newMachinery);
        localStorage.setItem('machinery', JSON.stringify(newMachinery));
    };

    const addBooking = (bookingData) => {
        const newBookings = [...bookings, { ...bookingData, id: Date.now().toString() }];
        setBookings(newBookings);
        localStorage.setItem('bookings', JSON.stringify(newBookings));
    };

    const getFarmerCrops = (farmerId) => {
        return crops.filter(crop => crop.farmerId === farmerId);
    };

    const getFarmerMachinery = (farmerId) => {
        return machinery.filter(machine => machine.ownerId === farmerId);
    };


    return (
        <DataContext.Provider value={{
            crops,
            machinery,
            bookings,
            loading,
            addCrop,
            addMachinery,
            addBooking,
            getFarmerCrops,
            getFarmerMachinery,
            aiInsights // AI Data Exposure
        }}>
            {children}
        </DataContext.Provider>
    );
};
