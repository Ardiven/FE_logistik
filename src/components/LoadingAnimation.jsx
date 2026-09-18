import React from 'react';

const LoadingAnimation = ({ size = 'large', text = 'Memuat data...' }) => {
    const sizeClasses = {
        small: 'w-5 h-5',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    const containerSize = size === 'small' ? 'flex flex-row items-center justify-center gap-2' : 'flex flex-col items-center justify-center gap-3 p-8';

    return (
        <div className={containerSize}>
            <div className={`relative ${sizeClasses[size]}`}>
                <div className="absolute inset-0 border-4 border-orange-100 border-t-tps-orange rounded-full animate-spin"></div>
            </div>
            {text && size !== 'small' && (
                <span className="text-sm text-gray-500 font-medium animate-pulse">{text}</span>
            )}
        </div>
    );
};

export default LoadingAnimation;
