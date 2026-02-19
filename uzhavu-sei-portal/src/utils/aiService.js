export const AIService = {
    // 1. Harvest Congestion Forecast (Simulated)
    getHarvestCongestionForecast: (clusterId) => {
        // Generate a 30-day forecast
        const forecast = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            // Simulate random congestion levels with some pattern/seasonality
            // Higher congestion on weekends or random peaks
            const baseLoad = 30 + Math.random() * 40; // 30-70% base
            const randomSpike = Math.random() > 0.8 ? 20 : 0; // Occasional spikes
            const congestion = Math.min(100, Math.round(baseLoad + randomSpike));

            let riskLevel = 'Low';
            if (congestion > 50) riskLevel = 'Medium';
            if (congestion > 80) riskLevel = 'High';

            forecast.push({
                date: date.toISOString().split('T')[0],
                congestion,
                riskLevel
            });
        }
        return forecast;
    },

    // 2. Predict Yield & Risk
    predictYield: (cropName, acres, plantingDate) => {
        // Mock data for average yields per acre
        const yieldStandards = {
            'Paddy': 2500, // kg per acre
            'Wheat': 2000,
            'Corn': 3000,
            'Cotton': 800,
            'Sugarcane': 40000
        };

        const baseYield = (yieldStandards[cropName] || 1500) * acres;
        // Adjust for "AI" factors (weather, undefined growth)
        const weatherFactor = 0.9 + Math.random() * 0.2; // +/- 10%
        const estimatedYield = Math.round(baseYield * weatherFactor);

        // Calculate Harvest Window (approx 3-4 months after planting)
        const plantDateObj = new Date(plantingDate);
        const daysToMaturity = 120; // Avg
        const harvestStartDate = new Date(plantDateObj);
        harvestStartDate.setDate(plantDateObj.getDate() + daysToMaturity);

        const harvestEndDate = new Date(harvestStartDate);
        harvestEndDate.setDate(harvestStartDate.getDate() + 14); // 2 week window

        return {
            estimatedYield,
            unit: 'kg',
            confidence: Math.round(85 + Math.random() * 10), // 85-95%
            recommendedHarvestWindow: {
                start: harvestStartDate.toISOString().split('T')[0],
                end: harvestEndDate.toISOString().split('T')[0]
            },
            riskAnalysis: {
                weatherRisk: Math.random() > 0.7 ? "High Chance of Rain" : "Favorable",
                pestRisk: Math.random() > 0.8 ? "Moderate" : "Low",
                marketVolatility: Math.random() > 0.5 ? "Stable" : "Volatile"
            }
        };
    },

    // 3. Machinery Demand Forecast
    getMachineryDemandForecast: () => {
        const demandData = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const demandScore = Math.floor(Math.random() * 100);

            demandData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                demandScore, // 0-100
                pricingMultiplier: demandScore > 80 ? 1.5 : (demandScore > 50 ? 1.2 : 1.0)
            });
        }
        return demandData;
    },

    // 4. Cluster Risk Score
    generateClusterRiskScore: (clusterId) => {
        // 0-100 score, where 100 is critical risk
        const score = Math.floor(Math.random() * 100);
        let factors = [];
        if (score > 70) factors = ["High Harvest Overlap", "Machinery Shortage"];
        else if (score > 40) factors = ["Moderate Weather Alert"];
        else factors = ["Optimal Operations"];

        return {
            score,
            level: score > 70 ? 'Critical' : (score > 40 ? 'Moderate' : 'Stable'),
            factors
        };
    },

    // 5. Smart Scheduling / Conflict Detection
    checkBookingConflict: (machineId, date, timeSlot) => {
        // Randomly simulate a conflict
        const isConflict = Math.random() > 0.7;
        return {
            hasConflict: isConflict,
            alternativeSlots: isConflict ? ['14:00', '16:00'] : []
        };
    },

    // 6. Cooperative Insights (New)
    getCooperativeInsights: (clusterId) => {
        return [
            {
                type: 'opportunity',
                message: "3 Farmers in your cluster need a Harvester next week. List yours to earn extra.",
                action: '/farmer/add-machinery'
            },
            {
                type: 'alert',
                message: "High pest risk reported by neighbor (2km away). Check your crops.",
                action: '/farmer/my-crops'
            }
        ];
    }
};

