import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        village: user?.village || '',
        landSize: user?.landSize || '',
        clusterId: user?.clusterId || 'Cluster-A', // Default mock
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        updateUserProfile(formData);

        setTimeout(() => {
            setLoading(false);
            alert("Profile updated successfully!");
        }, 500);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate(user?.role === 'buyer' ? '/buyer/dashboard' : '/farmer/dashboard')} className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">My Profile</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm max-w-lg mx-auto">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                        <User size={40} />
                    </div>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-gray-500 capitalize">{user?.role}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled // Phone usually immutable key
                        className="bg-gray-100 cursor-not-allowed"
                    />
                    <Input
                        label="Village"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        required
                    />

                    {user?.role === 'farmer' && (
                        <>
                            <Input
                                label="Total Land Size (Acres)"
                                name="landSize"
                                type="number"
                                value={formData.landSize}
                                onChange={handleChange}
                                placeholder="e.g. 5.0"
                            />
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cluster Association
                                </label>
                                <select
                                    name="clusterId"
                                    value={formData.clusterId}
                                    onChange={handleChange}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 border bg-white"
                                >
                                    <option value="Cluster-A">Cluster A (North)</option>
                                    <option value="Cluster-B">Cluster B (South)</option>
                                    <option value="Cluster-C">Cluster C (East)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {user?.role === 'buyer' && (
                        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                            <p className="font-semibold mb-1">Buyer Account</p>
                            <p>You are registered as a crop buyer. You can search and filter available crops in the dashboard.</p>
                        </div>
                    )}

                    <Button type="submit" isLoading={loading} className="w-full mt-6 flex items-center justify-center gap-2">
                        <Save size={18} /> Save Changes
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
