import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { AIService } from '../../utils/aiService';
import { ArrowLeft, AlertTriangle, Tractor, Users } from 'lucide-react';
import { calculateCongestion, getMetricsForNext72Hours } from '../../utils/logicEngine';

const ClusterOverview = () => {
    const navigate = useNavigate();
    // Logic Engine Integration
    const { demand, supply } = getMetricsForNext72Hours(crops, machinery);
    const { status } = calculateCongestion(demand, supply);

    const [congestionData, setCongestionData] = React.useState([]);

    React.useEffect(() => {
        if (harvestCongestion && harvestCongestion.length > 0) {
            setCongestionData(harvestCongestion);
        } else {
            console.log("Cluster: Generating fallback data");
            const fallback = AIService.getHarvestCongestionForecast();
            setCongestionData(fallback);
        }
    }, [harvestCongestion]);

    // Calculate Real Machinery Pool Stats
    const machineryStats = {
        Tractor: { total: 0, available: 0 },
        Harvester: { total: 0, available: 0 },
        Truck: { total: 0, available: 0 }
    };

    machinery.forEach(m => {
        const type = m.type || 'Other';
        if (!machineryStats[type]) machineryStats[type] = { total: 0, available: 0 };
        machineryStats[type].total++;
        if (m.status === 'Available') machineryStats[type].available++;
    });

    // Generate Shared Calendar from Crops
    const upcomingHarvests = crops
        .filter(c => new Date(c.harvestDate) > new Date())
        .sort((a, b) => new Date(a.harvestDate) - new Date(b.harvestDate))
        .slice(0, 5); // Next 5 harvests

    if (!clusterRisk) return <div className="p-10 text-center text-gray-500">Loading Cluster Intelligence...</div>;

    return (
        <div className="p-4 bg-gray-50 min-h-screen max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/farmer/dashboard')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Cluster Intelligence</h1>
                        <p className="text-sm text-gray-500">Real-time optimization & sharing</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-xs text-gray-500 uppercase font-semibold">Cluster ID</span>
                    <span className="font-mono text-lg font-bold text-indigo-600">TN-CL-04</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Cluster Risk Index (Hero Card) */}
                <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${clusterRisk?.score > 70 ? 'border-red-500 text-red-600 bg-red-50' :
                            (clusterRisk?.score > 40 ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-green-500 text-green-600 bg-green-50')
                            }`}>
                            {clusterRisk?.score || 45}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Cluster Congestion Risk</h2>
                            <p className="text-sm text-gray-500">Current optimizing urgency</p>
                            <div className="flex gap-2 mt-1">
                                {clusterRisk?.factors?.map((f, i) => (
                                    <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 border border-gray-200">{f}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:max-w-md">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Optimization Score</span>
                            <span className="font-bold text-indigo-600">Good</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            AI suggests <strong>staggering harvests by 2 days</strong> to reduce current bottleneck.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <AlertTriangle size={18} className="text-orange-500" /> 14-Day Load Heatmap
                        </h3>
                        <div className="flex gap-2 text-xs">
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-200 rounded-sm"></div> Low</span>
                            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> High</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {congestionData && congestionData.slice(0, 14).map((day, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                                <div
                                    className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer ${day.congestion > 80 ? 'bg-red-500 shadow-red-200 shadow-lg' :
                                        (day.congestion > 50 ? 'bg-orange-400' : 'bg-green-400')
                                        }`}
                                >
                                    {day.congestion}%
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                    {new Date(day.date).getDate()} {new Date(day.date).toLocaleDateString('en-US', { month: 'short' })}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">AI Recommendation</h4>
                        {harvestCongestion && harvestCongestion.length > 0 && (
                            <p className="text-sm text-gray-600">
                                High congestion predicted between <strong>{harvestCongestion[5]?.date}</strong> and <strong>{harvestCongestion[8]?.date}</strong>.
                                Farmers with flexible harvest windows should aim for dates after the 15th to secure machinery at lower rates.
                            </p>
                        )}
                    </div>
                </div>

                {/* 3. Resource Availability */}
                <div className="md:col-span-1 space-y-6">
                    {/* Machinery Status */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Tractor size={18} className="text-blue-500" /> Machinery Pool
                        </h3>
                        <div className="space-y-4">
                            {['Tractor', 'Harvester'].map(type => {
                                const stats = machineryStats[type] || { total: 0, available: 0 };
                                const percentage = stats.total > 0 ? (stats.available / stats.total) * 100 : 0;
                                return (
                                    <div key={type} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{type}s</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 bg-gray-100 rounded-full h-2">
                                                <div className={`h-2 rounded-full ${percentage > 50 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${percentage}%` }}></div>
                                            </div>
                                            <span className="text-xs font-bold">{stats.available}/{stats.total}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Others</span>
                                <span className="text-xs font-bold text-gray-400">Data Unavailable</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 border border-blue-100 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50">
                            View All Machinery
                        </button>
                    </div>

                    {/* Shared Harvest Calendar Preview */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Users size={18} className="text-purple-500" /> Shared Calendar
                        </h3>
                        <div className="space-y-3">
                            {upcomingHarvests.length > 0 ? upcomingHarvests.map((crop, idx) => (
                                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="bg-purple-100 text-purple-700 rounded-lg p-2 text-center min-w-[3.5rem]">
                                        <span className="block text-xs font-bold uppercase">{new Date(crop.harvestDate).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="block text-xl font-bold">{new Date(crop.harvestDate).getDate()}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{crop.farmerName || 'Neighbor'}</p>
                                        <p className="text-xs text-gray-500">{crop.type} ({crop.landSize} Ac)</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400 text-center py-4">No upcoming harvests in cluster.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClusterOverview;
