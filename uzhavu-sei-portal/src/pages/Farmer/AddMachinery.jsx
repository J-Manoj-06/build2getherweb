import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { AIService } from '../../utils/aiService';
import { TrendingUp, Calendar, AlertCircle, ArrowLeft, DollarSign, Tractor } from 'lucide-react';

const AddMachinery = () => {
    const { user } = useAuth();
    const { addMachinery } = useData();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [ownsMachinery, setOwnsMachinery] = useState(false);
    const [demandForecast, setDemandForecast] = useState([]);
    const [suggestedPrice, setSuggestedPrice] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        type: 'Tractor',
        availableFrom: new Date().toISOString().split('T')[0],
        availableTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rentalPrice: '',
        capacityPerDay: '5', // Acres per day default
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // AI Demand & Pricing Effect
    useEffect(() => {
        if (ownsMachinery) {
            try {
                // Get Demand Forecast
                const forecast = AIService.getMachineryDemandForecast();
                if (Array.isArray(forecast)) {
                    setDemandForecast(forecast);
                }

                // Calculate Dynamic Price Suggestion
                if (forecast && forecast.length > 0) {
                    const basePrice = formData.type === 'Harvester' ? 3000 : 1500;
                    const avgDemand = forecast.reduce((a, b) => a + (b?.demandScore || 0), 0) / forecast.length;
                    const demandMultiplier = avgDemand > 70 ? 1.2 : (avgDemand > 40 ? 1.0 : 0.9);
                    setSuggestedPrice(Math.round(basePrice * demandMultiplier));
                }
            } catch (err) {
                console.error("AI Service Error:", err);
                // Fallback if AI fails
                setDemandForecast([]);
            }
        }
    }, [ownsMachinery, formData.type]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!addMachinery) {
            setError("Internal Error: Data Service unavailable.");
            return;
        }

        setLoading(true);
        try {
            addMachinery({
                ...formData,
                ownerId: user?.id || 'unknown',
                ownerName: user?.name || 'Farmer',
                ownerPhone: user?.phone || '',
                status: 'Available',
                clusterId: user?.clusterId || 'Cluster-A',
                aiRecommendedPrice: suggestedPrice
            });

            setTimeout(() => {
                setLoading(false);
                navigate('/farmer/dashboard');
            }, 800);
        } catch (err) {
            console.error("Submission Error:", err);
            setError("Failed to register machinery. Please try again.");
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="p-10 text-center text-red-600">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="text-blue-600 underline mt-2">Reload Page</button>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-50 min-h-screen max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-800">Add Machinery</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-700">
                            <Tractor size={28} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Register Equipment</h2>
                            <p className="text-sm text-gray-500">Share your machinery with the cluster</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={ownsMachinery}
                                onChange={(e) => setOwnsMachinery(e.target.checked)}
                                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                            />
                            <span className="font-medium text-gray-700">I own machinery to rent out</span>
                        </label>
                    </div>

                    {ownsMachinery && (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Machinery Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm border p-3 bg-white focus:ring-2 focus:ring-orange-500 outline-none"
                                >
                                    <option value="Tractor">Tractor</option>
                                    <option value="Harvester">Harvester (Combine)</option>
                                    <option value="Thresher">Thresher</option>
                                    <option value="Rotavator">Rotavator</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Capacity (Acres/Day)"
                                    name="capacityPerDay"
                                    type="number"
                                    placeholder="e.g. 5"
                                    value={formData.capacityPerDay}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="relative">
                                    <Input
                                        label="Rental Price (₹/Day)"
                                        name="rentalPrice"
                                        type="number"
                                        placeholder={`Suggested: ₹${suggestedPrice || 1500}`}
                                        value={formData.rentalPrice}
                                        onChange={handleChange}
                                        required
                                    />
                                    {suggestedPrice && (
                                        <div className="absolute top-0 right-0 text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                                            AI Suggest: ₹{suggestedPrice}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Available From"
                                    name="availableFrom"
                                    type="date"
                                    value={formData.availableFrom}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Available To"
                                    name="availableTo"
                                    type="date"
                                    value={formData.availableTo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Button type="submit" variant="secondary" isLoading={loading} className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white">
                                Register Machinery
                            </Button>
                        </form>
                    )}

                    {!ownsMachinery && (
                        <p className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-100 rounded-lg">
                            Ensure you have valid registration documents before listing.
                        </p>
                    )}
                </div>

                {/* AI Demand Forecast Panel */}
                {ownsMachinery && (
                    <div className="md:col-span-1 space-y-4 animate-fadeIn">
                        {/* 1. Demand Forecast */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3 text-gray-800">
                                <TrendingUp size={18} className="text-blue-600" />
                                <span className="font-bold text-sm">Demand Forecast</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Predicted demand for {formData.type}s in next 7 days.</p>

                            <div className="space-y-2">
                                {demandForecast && demandForecast.length > 0 ? demandForecast.slice(0, 5).map((day, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <span className="text-gray-600">{day?.date || 'Day'}</span>
                                        <div className="flex items-center gap-2 w-2/3">
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${day?.demandScore > 70 ? 'bg-green-500' : (day?.demandScore > 40 ? 'bg-yellow-400' : 'bg-gray-300')}`}
                                                    style={{ width: `${day?.demandScore || 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-mono w-6 text-right">{day?.demandScore || 0}%</span>
                                        </div>
                                    </div>
                                )) : <p className="text-xs text-gray-400">Loading forecast...</p>}
                            </div>
                        </div>

                        {/* 2. Earnings Projection */}
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2 text-green-800">
                                <DollarSign size={18} />
                                <span className="font-bold text-sm">Potential Earnings</span>
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                                ₹{formData.rentalPrice ? (Number(formData.rentalPrice) * 7 * 0.8).toLocaleString() : '0'}
                            </div>
                            <p className="text-xs text-green-700 mt-1">
                                Est. weekly revenue based on 80% utilization rate.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddMachinery;
