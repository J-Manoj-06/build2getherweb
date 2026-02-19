import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Sprout, ArrowLeft, BrainCircuit } from 'lucide-react';
import { AIService } from '../../utils/aiService';

const AddCrop = () => {
    const { user } = useAuth();
    const { addCrop } = useData();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [aiPrediction, setAiPrediction] = useState(null);
    const [impactAnalysis, setImpactAnalysis] = useState(null);

    const [formData, setFormData] = useState({
        type: 'Paddy',
        variety: '',
        landSize: '',
        sowingDate: new Date().toISOString().split('T')[0],
        soilType: 'Clay',
        irrigationType: 'Flood',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Real-time AI Prediction Effect
    useEffect(() => {
        if (formData.sowingDate && formData.landSize && formData.type) {
            // 1. Get Yield & Harvest Window Prediction
            const prediction = AIService.predictYield(
                formData.type,
                parseFloat(formData.landSize),
                formData.sowingDate
            );
            setAiPrediction(prediction);

            // 2. Simulate Decision Impact (Congestion)
            // In a real app, this would query the backend check congestion for the predicted date
            const congestionChance = Math.floor(Math.random() * 40) + 30; // 30-70% base
            setImpactAnalysis({
                congestion: congestionChance,
                message: congestionChance > 60 ? 'High cluster congestion expected. Consider shifting +2 days.' : 'Optimal window selected.'
            });
        }
    }, [formData.sowingDate, formData.landSize, formData.type]);

    const handleSimulateShift = (days) => {
        // Simulate changing the date
        const current = new Date(formData.sowingDate);
        current.setDate(current.getDate() + days);
        setFormData({ ...formData, sowingDate: current.toISOString().split('T')[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const finalData = {
            ...formData,
            farmerId: user.id,
            farmerName: user.name,
            farmerVillage: user.village,
            ...aiPrediction, // Save predicted data
            status: 'Active'
        };

        addCrop(finalData);

        setTimeout(() => {
            setLoading(false);
            navigate('/farmer/my-crops');
        }, 800);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Add Crop Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-3 rounded-full text-green-700">
                            <Sprout size={28} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">New Harvest Plan</h2>
                            <p className="text-sm text-gray-500">AI will predict harvest dates & yield</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm border p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                                    <option value="Paddy">Paddy</option>
                                    <option value="Sugarcane">Sugarcane</option>
                                    <option value="Wheat">Wheat</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Corn">Corn</option>
                                </select>
                            </div>
                            <Input label="Variety" name="variety" placeholder="e.g. Ponni" value={formData.variety} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                                <select name="soilType" value={formData.soilType} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm border p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                                    <option value="Clay">Clay</option>
                                    <option value="Loam">Loam</option>
                                    <option value="Sandy">Sandy</option>
                                    <option value="Silt">Silt</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation</label>
                                <select name="irrigationType" value={formData.irrigationType} onChange={handleChange} className="block w-full rounded-lg border-gray-300 shadow-sm border p-3 bg-white focus:ring-2 focus:ring-green-500 outline-none">
                                    <option value="Flood">Flood</option>
                                    <option value="Drip">Drip</option>
                                    <option value="Rainfed">Rainfed</option>
                                    <option value="Sprinkler">Sprinkler</option>
                                </select>
                            </div>
                        </div>

                        <Input
                            label="Land Size (Acres)"
                            name="landSize"
                            type="number"
                            placeholder="e.g. 2.5"
                            value={formData.landSize}
                            onChange={handleChange}
                            required
                            min="0.1"
                            step="0.1"
                        />

                        <Input
                            label="Sowing Date"
                            name="sowingDate"
                            type="date"
                            value={formData.sowingDate}
                            onChange={handleChange}
                            required
                        />

                        <Button type="submit" isLoading={loading} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                            Save Harvest Plan
                        </Button>
                    </form>
                </div>

                {/* AI Insights Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    {/* 1. Yield & Harvest Prediction */}
                    {aiPrediction ? (
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-fadeIn">
                            <div className="flex items-center gap-2 mb-3 text-indigo-700">
                                <BrainCircuit size={18} />
                                <span className="font-bold text-sm">AI Forecast</span>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Est. Yield</span>
                                    <div className="text-xl font-bold text-gray-800">
                                        {aiPrediction.estimatedYield.toLocaleString()} <span className="text-sm font-normal text-gray-500">{aiPrediction.unit}</span>
                                    </div>
                                    <div className="text-xs text-green-600 font-medium">
                                        {aiPrediction.confidence}% Confidence
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-indigo-100">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Harvest Window</span>
                                    <div className="text-sm font-medium text-gray-800">
                                        {aiPrediction.recommendedHarvestWindow.start} - <br />
                                        {aiPrediction.recommendedHarvestWindow.end}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-xl p-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
                            Enter details to generate AI forecast
                        </div>
                    )}

                    {/* 2. Decision Impact Simulator */}
                    {aiPrediction && impactAnalysis && (
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-fadeIn">
                            <h3 className="font-semibold text-gray-700 text-sm mb-3">Decision Impact Simulator</h3>

                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-500">Cluster Congestion</span>
                                    <span className={`font-bold ${impactAnalysis.congestion > 60 ? 'text-red-600' : 'text-green-600'}`}>
                                        {impactAnalysis.congestion}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${impactAnalysis.congestion > 60 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${impactAnalysis.congestion}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs mt-2 text-gray-600 italic">
                                    "{impactAnalysis.message}"
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button type="button" onClick={() => handleSimulateShift(-5)} className="flex-1 py-1 px-2 border border-gray-300 rounded text-xs hover:bg-gray-50">-5 Days</button>
                                <button type="button" onClick={() => handleSimulateShift(5)} className="flex-1 py-1 px-2 border border-gray-300 rounded text-xs hover:bg-gray-50">+5 Days</button>
                            </div>
                        </div>
                    )}

                    {/* 3. Risk Analysis */}
                    {aiPrediction && (
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 animate-fadeIn">
                            <h3 className="font-semibold text-orange-800 text-sm mb-2">Risk Factors</h3>
                            <ul className="space-y-1 text-xs text-orange-700">
                                <li className="flex justify-between">
                                    <span>Weather:</span> <span className="font-medium">{aiPrediction.riskAnalysis.weatherRisk}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Pest:</span> <span className="font-medium">{aiPrediction.riskAnalysis.pestRisk}</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCrop;
