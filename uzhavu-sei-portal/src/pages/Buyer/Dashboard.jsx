import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, MapPin, Calendar, Sprout, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard = () => {
    const { user } = useAuth();
    const { crops } = useData();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const filteredCrops = crops.filter(crop => {
        const matchesType = crop.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = dateFilter ? crop.harvestDate === dateFilter : true;
        return matchesType && matchesDate;
    });

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
                    <p className="text-gray-500">Welcome, {user?.name}</p>
                </div>
                <div onClick={() => navigate('/buyer/profile')} className="bg-primary/10 p-2 rounded-full cursor-pointer hover:bg-primary/20">
                    <User size={20} className="text-primary" />
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 sticky top-0 z-10 border border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-3">Find Crops</h2>
                <div className="grid gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by crop type..."
                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-gray-50"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="font-bold text-gray-800">Available Harvests</h2>

                {filteredCrops.length > 0 ? (
                    filteredCrops.map(crop => (
                        <div key={crop.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-gray-900">{crop.type}</h3>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                                    {crop.landSize} Acres
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span>{crop.farmerVillage}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>{new Date(crop.harvestDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center border-t pt-3 mt-2">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                        {crop.farmerName.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium">{crop.farmerName}</span>
                                </div>
                                <Button variant="outline" className="px-3 py-1 text-xs h-auto">
                                    Contact
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Sprout className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>No crops found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;
