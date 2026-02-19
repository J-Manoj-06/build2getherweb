import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { AIService } from '../../utils/aiService';
import { ArrowLeft, Tractor, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Booking = () => {
    const { user } = useAuth();
    const { machinery, bookings, addBooking } = useData();
    const navigate = useNavigate();

    // Filter out machines owned by current user
    const availableMachinery = machinery.filter(m => m.ownerId !== user.id);

    const [selectedMachine, setSelectedMachine] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [duration, setDuration] = useState('1');
    const [conflict, setConflict] = useState(null);
    const [loading, setLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState(null);

    const handleSelectMachine = (machine) => {
        setSelectedMachine(machine);
        setConflict(null);
        setBookingDate('');
        setAiAnalysis(null);
    };

    const checkAvailability = (date, machineId) => {
        // AI Conflict Check
        const { hasConflict, alternativeSlots } = AIService.checkBookingConflict(machineId, date, '09:00');

        if (hasConflict) {
            setConflict({
                message: "High congestion detected. This slot is reserved for critical harvests.",
                suggestion: alternativeSlots[0] ? date : new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
            });
            setAiAnalysis(null);
        } else {
            setConflict(null);
            // Simulate Fairness/Priority Score
            setAiAnalysis({
                priorityScore: 85,
                fairnessReason: "Your harvest urgency is high (Crop Stage: Maturity)",
                congestionLevel: "Low",
                isRecommended: true
            });
        }
    };

    const handleDateChange = (e) => {
        setBookingDate(e.target.value);
        if (selectedMachine && e.target.value) {
            checkAvailability(e.target.value, selectedMachine.id);
        }
    };

    const handleBook = () => {
        if (!selectedMachine || !bookingDate || conflict) return;

        setLoading(true);
        addBooking({
            machineId: selectedMachine.id,
            machineName: selectedMachine.type,
            machineOwner: selectedMachine.ownerName,
            bookedBy: user.id,
            bookedByName: user.name,
            date: bookingDate,
            duration: duration,
            status: 'Confirmed'
        });

        setTimeout(() => {
            setLoading(false);
            // alert("Booking Confirmed! Owner has been notified.");
            navigate('/farmer/dashboard');
        }, 800);
    };

    return (
        <div className="p-4 bg-gray-50 min-h-screen">
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/farmer/dashboard')} className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold">Book Machinery</h1>
            </div>

            {!selectedMachine ? (
                // List View
                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">Select a machine to check availability.</p>
                    {availableMachinery.length > 0 ? (
                        availableMachinery.map(machine => (
                            <div
                                key={machine.id}
                                onClick={() => handleSelectMachine(machine)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-primary active:scale-95 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-100 p-3 rounded-full text-orange-700">
                                        <Tractor size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{machine.type}</h3>
                                        <p className="text-xs text-gray-500">Owner: {machine.ownerName || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">Rate: ₹{machine.rentalPrice || '-'}/day</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block text-green-600 font-bold text-sm">Available</span>
                                    <span className="text-xs text-gray-400">until {new Date(machine.availableTo).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            No machinery available from other farmers in your cluster.
                        </div>
                    )}
                </div>
            ) : (
                // Booking Form View
                <div className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-700">
                            <Tractor size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{selectedMachine.type}</h2>
                            <p className="text-gray-500">Owner: {selectedMachine.ownerName}</p>
                        </div>
                        <button onClick={() => setSelectedMachine(null)} className="ml-auto text-sm text-primary font-medium">Change</button>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Booking Date"
                            type="date"
                            value={bookingDate}
                            onChange={handleDateChange}
                            required
                            min={selectedMachine.availableFrom}
                            max={selectedMachine.availableTo}
                        />

                        {/* Analysis / Conflict Feedback */}
                        {conflict && (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-sm text-red-700 animate-slideIn">
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    <AlertTriangle size={16} /> Conflict Detected
                                </div>
                                <p>{conflict.message}</p>
                                <p className="mt-2 text-primary font-medium cursor-pointer underline" onClick={() => {
                                    setBookingDate(conflict.suggestion); // Mock fix
                                    setConflict(null);
                                    setAiAnalysis({
                                        priorityScore: 80,
                                        fairnessReason: "Alternative slot accepted.",
                                        congestionLevel: "Moderate",
                                        isRecommended: true
                                    });
                                }}>
                                    Switch to recommended date?
                                </p>
                            </div>
                        )}

                        {!conflict && bookingDate && aiAnalysis && (
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm animate-slideIn">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2 font-bold text-indigo-700">
                                        <CheckCircle size={16} /> Smart Schedule
                                    </div>
                                    <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded font-bold">
                                        Score: {aiAnalysis.priorityScore}
                                    </span>
                                </div>

                                <div className="space-y-2 text-indigo-900/80">
                                    <p className="text-xs">
                                        <strong>Why this slot?</strong> {aiAnalysis.fairnessReason}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span>Cluster Congestion:</span>
                                        <span className="font-bold text-green-600">{aiAnalysis.congestionLevel}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Total Price</span>
                                <span className="text-xl font-bold">₹{selectedMachine.rentalPrice * duration}</span>
                            </div>
                            <Button
                                onClick={handleBook}
                                isLoading={loading}
                                disabled={!bookingDate || conflict}
                                className="w-full"
                            >
                                Confirm Booking
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Booking;
