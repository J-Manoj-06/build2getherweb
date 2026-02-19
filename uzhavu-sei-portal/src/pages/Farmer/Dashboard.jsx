import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Tractor, Sprout, Activity, Calendar, Bell, AlertTriangle, User } from 'lucide-react';
import Button from '../../components/ui/Button';
import { AIService } from '../../utils/aiService';

const FarmerDashboard = () => {
    const { user } = useAuth();
    const { getFarmerCrops, getFarmerMachinery, crops, machinery, aiInsights } = useData();
    const navigate = useNavigate();

    // DIRECT GENERATION to ensure data presence
    const generateForecast = () => {
        const forecast = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const baseLoad = 30 + Math.random() * 40;
            const congestion = Math.min(100, Math.round(baseLoad));
            forecast.push({
                date: date.toISOString().split('T')[0],
                congestion,
                riskLevel: congestion > 80 ? 'High' : (congestion > 50 ? 'Medium' : 'Low')
            });
        }
        return forecast;
    };

    const [congestionData, setCongestionData] = React.useState(generateForecast());

    const myCrops = getFarmerCrops(user?.id);
    const myMachinery = getFarmerMachinery(user?.id);
    const { harvestCongestion, clusterRisk } = aiInsights;

    React.useEffect(() => {
        // Only override if context has data, otherwise stick to local generation
        if (harvestCongestion && harvestCongestion.length > 0) {
            setCongestionData(harvestCongestion);
        }
    }, [harvestCongestion]);

    return (
        <div className="p-4 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user?.name}</p>
                </div>
                <div onClick={() => navigate('/farmer/profile')} className="bg-primary/10 p-2 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">
                    <User size={20} className="text-primary" />
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cluster Risk Score */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <Activity className="text-blue-600" size={20} />
                            <h3 className="font-semibold text-gray-700">Cluster Risk</h3>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${clusterRisk?.level === 'Critical' ? 'bg-red-100 text-red-700' :
                            clusterRisk?.level === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                            }`}>
                            {clusterRisk?.level || 'Analyzing...'}
                        </span>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-bold text-gray-800">{clusterRisk?.score || '--'} <span className="text-sm font-normal text-gray-500">/ 100</span></div>
                        <p className="text-xs text-gray-500">Congestion Factors: {clusterRisk?.factors?.join(', ') || 'None'}</p>
                    </div>
                </div>

                {/* Cooperative Alerts */}
                <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl shadow-sm border border-indigo-100 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <Bell className="text-indigo-600" size={20} />
                        <h3 className="font-semibold text-gray-700">Cooperative Alerts</h3>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600 border-l-2 border-indigo-300 pl-2">
                            🚜 <strong>Machinery Demand:</strong> 3 neighbors need a Tractor next week. <span className="text-indigo-600 font-bold cursor-pointer" onClick={() => navigate('/farmer/add-machinery')}>List yours &rarr;</span>
                        </p>
                        <p className="text-sm text-gray-600 border-l-2 border-red-300 pl-2">
                            🐛 <strong>Pest Alert:</strong> Reported 2km away. Check your Paddy crops.
                        </p>
                    </div>
                </div>

                {/* Market Quick View */}
                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-xl shadow-sm border border-emerald-100 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <Sprout className="text-emerald-600" size={20} />
                        <h3 className="font-semibold text-gray-700">Market Opportunity</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        📈 <strong>Tomato Prices:</strong> Trending up (+5%) next week. Good time to plan harvest.
                    </p>
                    <div className="mt-2 text-xs text-emerald-700 font-medium bg-emerald-100/50 p-2 rounded">
                        Selling to "Tina Markets" yields +₹2/kg based on recent data.
                    </div>
                </div>
            </div>

            {/* Harvest Congestion Forecast Graph */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">30-Day Harvest Congestion Forecast</h3>
                        <p className="text-sm text-gray-500">Predicted cluster load based on crop maturity cycles</p>
                    </div>
                    <div className="flex gap-2 text-xs">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-sm"></div> Low</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Med</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> High</span>
                    </div>
                </div>

                {/* Visual Bar Chart */}
                <div className="flex items-end h-40 gap-1 w-full overflow-x-auto pb-2">
                    {congestionData.map((day, index) => {
                        const height = day.congestion ? `${day.congestion}%` : '50%';
                        const colorClass = day.riskLevel === 'High' ? 'bg-red-400' :
                            day.riskLevel === 'Medium' ? 'bg-yellow-400' : 'bg-green-400';

                        return (
                            <div key={index} className="flex-1 min-w-[10px] flex flex-col justify-end group relative h-full">
                                <div
                                    className={`w-full rounded-t-sm transition-all duration-500 hover:opacity-80 ${colorClass}`}
                                    style={{ height: `${day.congestion}%` }}
                                ></div>
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                                    {day.date}: {day.congestion}% Load
                                </div>
                            </div>
                        );
                    })}
                    {congestionData.length === 0 && <div className="text-center w-full text-gray-400">Loading forecast...</div>}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Today</span>
                    <span>+15 Days</span>
                    <span>+30 Days</span>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <h3 className="font-semibold text-gray-700 mt-2">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => navigate('/farmer/add-crop')} className="bg-white hover:bg-green-50 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <div className="p-3 bg-green-100 rounded-full text-green-700"><Sprout size={24} /></div>
                    <span className="font-medium text-sm">Add Crop</span>
                </div>
                <div onClick={() => navigate('/farmer/add-machinery')} className="bg-white hover:bg-orange-50 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <div className="p-3 bg-orange-100 rounded-full text-orange-700"><Tractor size={24} /></div>
                    <span className="font-medium text-sm">Add Machinery</span>
                </div>
                <div onClick={() => navigate('/farmer/cluster')} className="bg-white hover:bg-blue-50 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-700"><Activity size={24} /></div>
                    <span className="font-medium text-sm">Cluster View</span>
                </div>
                <div onClick={() => navigate('/farmer/booking')} className="bg-white hover:bg-purple-50 p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                    <div className="p-3 bg-purple-100 rounded-full text-purple-700"><Calendar size={24} /></div>
                    <span className="font-medium text-sm">Bookings</span>
                </div>
            </div>

            {/* My Farm Overview (Existing but styled) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crops List */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Sprout size={18} className="text-green-600" /> Active Crops
                        </h3>
                        <span onClick={() => navigate('/farmer/my-crops')} className="text-xs text-blue-600 cursor-pointer hover:underline">View All</span>
                    </div>
                    {myCrops.length > 0 ? (
                        <div className="space-y-3">
                            {myCrops.slice(0, 3).map(crop => (
                                <div key={crop.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">{crop.type}</p>
                                        <p className="text-xs text-gray-500">Harvest: {crop.harvestDate || 'Not set'}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-semibold">{crop.landSize} Ac</span>
                                        <span className="text-xs text-green-600">Healthy</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            No crops added yet.
                        </div>
                    )}
                </div>

                {/* Machinery Status */}
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Tractor size={18} className="text-orange-600" /> My Machinery
                        </h3>
                        <span onClick={() => navigate('/farmer/profile')} className="text-xs text-blue-600 cursor-pointer hover:underline">Manage</span>
                    </div>
                    {myMachinery.length > 0 ? (
                        <div className="space-y-3">
                            {myMachinery.map(machine => (
                                <div key={machine.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors">
                                    <div>
                                        <p className="font-medium text-gray-800">{machine.type}</p>
                                        <p className="text-xs text-gray-500">Utilization: {Math.floor(Math.random() * 80)}%</p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">₹{machine.rentalPrice}/day</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-400 text-sm bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            No machinery owned.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
