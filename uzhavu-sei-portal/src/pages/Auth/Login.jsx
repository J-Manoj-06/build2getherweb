import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Tractor } from 'lucide-react';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const result = login(phone);
            if (result.success) {
                navigate(result.role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
            } else {
                setError(result.message || 'Login failed');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                        <Tractor className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to UzhavuSei</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        error={error}
                    />

                    <Button type="submit" isLoading={loading} className="w-full">
                        Sign In
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    New user?{' '}
                    <Link to="/register" className="font-medium text-primary hover:text-green-700">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
