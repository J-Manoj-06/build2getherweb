import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ArrowLeft, Sprout, Droplets, Calendar, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import Button from '../../components/ui/Button';

const CropCycleBar = ({ start, end, currentStage }) => {
    const stages = ['Seedling', 'Tillering', 'Flowering', 'Maturity', 'Harvest'];
    const currentIdx = stages.indexOf(currentStage) !== -1 ? stages.indexOf(currentStage) : 2; // Default to mid if unknown

    return (
        <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Sowed: {new Date(start).toLocaleDateString()}</span>
                <span>Harvest: {new Date(end).toLocaleDateString()}</span>
            </div>
            <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    {stages.map((stage, idx) => (
                        <div
                            key={stage}
                            className={clsx(
                                "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500",
                                idx <= currentIdx ? "bg-green-500" : "bg-transparent"
                            )}
                            style={{ width: `${100 / stages.length}%` }}
                        ></div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                    {stages.map((stage) => (
                        <span key={stage} className={clsx(stage === currentStage ? "text-green-600 font-bold" : "")}>
                            {stage}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MyCrops = () => {
    const { user } = useAuth();
    const { getFarmerCrops } = useData();
    const navigate = useNavigate();
    const myCrops = getFarmerCrops(user?.id);

    // Mock Market Price (In a real app, fetch from API)
    const marketPrices = {
        'Paddy': 22, // ₹22/kg
        'Wheat': 28,
        'Sugarcane': 3.5 // ₹3.5/kg (often per ton, but using kg for simplicity)
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/farmer/dashboard')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">My Crops & Economics</h1>
            </div>

            <div className="space-y-6">
                {myCrops.length > 0 ? (
                    myCrops.map(crop => {
                        const estimatedRevenue = crop.estimatedYield * (marketPrices[crop.type] || 20);
                        const progress = crop.currentStage === 'Seedling' ? 10 :
                            crop.currentStage === 'Tillering' ? 30 :
                                crop.currentStage === 'Flowering' ? 60 :
                                    crop.currentStage === 'Maturity' ? 90 : 100;

                        return (
                            <div key={crop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Header */}
                                <div className="p-5 border-b border-gray-50 flex justify-between items-start bg-gradient-to-r from-white to-green-50/30">
                                    <div>
                                        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                            {crop.type}
                                            <span className="text-xs font-normal text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                                                {crop.variety || 'Standard'}
                                            </span>
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">Sowed on {new Date(crop.sowingDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block">
                                            {crop.currentStage}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left: Progress & Tasks */}
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Growth Progress</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-2">
                                                <Calendar size={16} /> Tasks for Today
                                            </h4>
                                            <ul className="text-xs text-blue-900/80 space-y-1.5 list-disc pl-4">
                                                <li>Check soil moisture levels (Target: 60%)</li>
                                                <li>Inspect for early signs of stem borer</li>
                                                {progress > 80 && <li className="font-semibold">Schedule machinery for harvest!</li>}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Right: Economics */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-100 rounded-bl-full -mr-8 -mt-8"></div>
                                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                                            <span className="text-xl">₹</span> Projected Economics
                                        </h4>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="block text-gray-500 text-xs">Est. Yield</span>
                                                <span className="block font-bold text-gray-800 text-lg">{crop.estimatedYield} kg</span>
                                            </div>
                                            <div>
                                                <span className="block text-gray-500 text-xs">Est. Revenue</span>
                                                <span className="block font-bold text-green-600 text-lg">₹{estimatedRevenue.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-3 text-center">
                                            *Based on current market price of ₹{marketPrices[crop.type]}/kg
                                        </p>
                                    </div>
                                </div>

                                {/* Warnings */}
                                {progress > 85 && (
                                    <div className="bg-orange-50 p-3 flex justify-between items-center text-sm px-5 border-t border-orange-100">
                                        <span className="text-orange-800 flex items-center gap-2 font-medium">
                                            <AlertTriangle size={16} /> Harvest approaching in 5-10 days.
                                        </span>
                                        <button
                                            onClick={() => navigate('/farmer/booking')}
                                            className="text-orange-700 underline hover:text-orange-900 font-semibold text-xs"
                                        >
                                            Book Machine Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sprout size={32} className="text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No Active Crops</h3>
                        <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">Add your crops to unlock AI yield predictions, financial analytics, and daily tasks.</p>
                        <Button onClick={() => navigate('/farmer/add-crop')}>
                            Add New Crop
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCrops;
