import React from 'react';

const InitialLoading = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-lg font-semibold text-gray-700">Initializing...</p>
            </div>
        </div>
    );
};

export default InitialLoading;