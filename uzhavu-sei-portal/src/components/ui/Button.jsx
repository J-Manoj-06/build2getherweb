import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    className,
    isLoading,
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none w-full sm:w-auto";

    const variants = {
        primary: "bg-primary text-white hover:bg-green-800 focus:ring-green-600",
        secondary: "bg-secondary text-white hover:bg-yellow-700 focus:ring-yellow-500",
        danger: "bg-danger text-white hover:bg-red-700 focus:ring-red-500",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    };

    return (
        <button
            className={clsx(baseStyles, variants[variant], className)}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
