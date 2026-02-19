/**
 * Logic Engine for Harvest Congestion and AI Recommendations
 */

// --- Constants / Mock Data for AI Models ---
const CROP_GROWTH_STAGES = {
    'Paddy': { duration: 120, stages: ['Seedling', 'Tillering', 'Flowering', 'Maturity'] },
    'Sugarcane': { duration: 365, stages: ['Germination', 'Tillering', 'Grand Growth', 'Maturity'] },
    'Wheat': { duration: 140, stages: ['Crown Root', 'Tillering', 'Jointing', 'Flowering', 'Maturity'] },
    // Default fallback
    'default': { duration: 90, stages: ['Vegetative', 'Flowering', 'Maturity'] }
};

const YIELD_FACTORS = {
    soil: { 'Clay': 1.1, 'Loam': 1.2, 'Sandy': 0.9 },
    irrigation: { 'Drip': 1.15, 'Flood': 1.0, 'Rainfed': 0.8 }
};

// --- CORE FUNCTIONS ---

export const calculateCongestion = (demand, supply) => {
    // Avoid division by zero
    const capacity = supply * 9; // Assuming 1 machine can handle 9 units/acres in 3 days

    // If supply is 0 but demand exists, it's critical
    if (supply === 0 && demand > 0) return { status: 'High', ratio: Infinity };
    if (demand === 0) return { status: 'Low', ratio: 0 };

    const ratio = demand / capacity;

    if (ratio > 1) {
        return { status: 'High', ratio };
    } else if (ratio >= 0.7 && ratio <= 1) {
        return { status: 'Moderate', ratio };
    } else {
        return { status: 'Low', ratio };
    }
};

export const getRecommendation = (status) => {
    switch (status) {
        case 'High':
            return "Critical congestion detected. We suggest delaying harvest by 2 days or booking available machinery immediately.";
        case 'Moderate':
            return "Moderate demand. Consider staggered harvesting to avoid delays.";
        case 'Low':
            return "Capacity is optimal. Proceed with scheduled harvest.";
        default:
            return "Unable to determine status. Check data connection.";
    }
};

/**
 * AI Model 1: Crop Growth Prediction
 * Predicts harvest date and yield based on inputs.
 */
export const predictCropGrowth = (cropType, sowingDate, landSize, soilType, irrigationType) => {
    const cropInfo = CROP_GROWTH_STAGES[cropType] || CROP_GROWTH_STAGES['default'];
    const sowing = new Date(sowingDate);

    // Predict Harvest Date
    const harvestDate = new Date(sowing);
    harvestDate.setDate(sowing.getDate() + cropInfo.duration);

    // Determine Current Stage
    const now = new Date();
    const daysElapsed = Math.floor((now - sowing) / (1000 * 60 * 60 * 24));
    let currentStage = 'Harvested';

    if (daysElapsed < cropInfo.duration) {
        const stageIndex = Math.floor((daysElapsed / cropInfo.duration) * cropInfo.stages.length);
        currentStage = cropInfo.stages[Math.min(stageIndex, cropInfo.stages.length - 1)];
    } else if (daysElapsed > cropInfo.duration + 15) {
        currentStage = 'Post-Harvest';
    } else {
        currentStage = 'Ready to Harvest';
    }

    // Yield Prediction (Mock impl)
    const baseYieldPerAcre = 2000; // in kg (mock)
    const soilFactor = YIELD_FACTORS.soil[soilType] || 1.0;
    const irrigationFactor = YIELD_FACTORS.irrigation[irrigationType] || 1.0;
    const estimatedYield = Math.round(landSize * baseYieldPerAcre * soilFactor * irrigationFactor);

    return {
        harvestDate: harvestDate.toISOString().split('T')[0],
        currentStage,
        estimatedYield, // in kg
        daysToHarvest: Math.max(0, cropInfo.duration - daysElapsed)
    };
};

/**
 * AI Model 2: Demand Forecasting
 * Predicts peak demand periods based on all farmers' crop data.
 * Returns an array of daily demand for the next 14 days.
 */
export const forecastDemand = (allCrops) => {
    const forecast = {};
    const today = new Date();

    // Initialize next 14 days
    for (let i = 0; i < 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        forecast[d.toISOString().split('T')[0]] = 0;
    }

    allCrops.forEach(crop => {
        const hDate = crop.harvestDate; // YYYY-MM-DD
        if (forecast[hDate] !== undefined) {
            forecast[hDate] += parseFloat(crop.landSize || 0);
        }
    });

    return forecast;
};

/**
 * AI Model 3: Intelligent Scheduling / Recommendations
 * Analyzes user status to give contextual "Smart Actions".
 */
export const getSmartRecommendations = (userRole, userContextData) => {
    const actions = [];

    if (userRole === 'farmer') {
        const { myCrops, clusterStatus } = userContextData;

        // Check 1: Harvest Readiness
        const readyCrops = myCrops.filter(c => c.currentStage === 'Ready to Harvest');
        if (readyCrops.length > 0) {
            actions.push({
                type: 'urgent',
                message: `Your ${readyCrops[0].type} is ready for harvest. Book machinery now!`,
                link: '/farmer/booking'
            });
        }

        // Check 2: Congestion Alert
        if (clusterStatus === 'High') {
            actions.push({
                type: 'warning',
                message: "High cluster congestion detected. Consider delaying harvest by 3 days.",
                link: '/farmer/cluster'
            });
        }

        // Check 3: Missing Data
        if (myCrops.length === 0) {
            actions.push({
                type: 'info',
                message: "Add your crop details to get AI yield predictions.",
                link: '/farmer/add-crop'
            });
        }
    }

    return actions;
};

/**
 * Helper to filter crops and machinery for the next 3 days
 */
export const getMetricsForNext72Hours = (crops, machinery) => {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    const activeCrops = crops.filter(crop => {
        const cropDate = new Date(crop.harvestDate);
        return cropDate >= now && cropDate <= threeDaysLater;
    });

    const activeMachinery = machinery.filter(machine => {
        const availFrom = new Date(machine.availableFrom);
        const availTo = new Date(machine.availableTo);
        // Available if the range overlaps with next 3 days
        return availFrom <= threeDaysLater && availTo >= now;
    });

    return {
        demand: activeCrops.length,
        supply: activeMachinery.length
    };
};
