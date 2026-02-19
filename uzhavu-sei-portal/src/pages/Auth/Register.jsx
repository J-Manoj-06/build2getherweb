import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        village: '',
        role: 'farmer', // Default to farmer
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const result = register(formData);
            if (result.success) {
                navigate(result.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
            } else {
                setError(result.message || 'Registration failed');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                        <UserPlus className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-500">Join the UzhavuSei community</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        error={error}
                    />

                    <Input
                        label="Village"
                        name="village"
                        type="text"
                        placeholder="Enter your village"
                        value={formData.village}
                        onChange={handleChange}
                        required
                    />

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            I am a...
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-3 px-4 border bg-white"
                        >
                            <option value="farmer">Farmer</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>

                    <Button type="submit" isLoading={loading} className="w-full mt-4">
                        Register
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-green-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
