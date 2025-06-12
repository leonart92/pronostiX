import React from 'react';

const StatCard = ({
    title,
    value,
    change,
    changeType = 'neutral',
    icon,
    color = 'blue'
}) => {
    const colorClasses = {
        blue: 'bg-blue-500 text-blue-600 bg-blue-50',
        green: 'bg-green-500 text-green-600 bg-green-50',
        red: 'bg-red-500 text-red-600 bg-red-50',
        yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
        purple: 'bg-purple-500 text-purple-600 bg-purple-50'
    };

    const getChangeColor = (type) => {
        switch (type) {
            case 'positive': return 'text-green-600';
            case 'negative': return 'text-red-600';
            default: return 'text-grey-600';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <p className={`text-sm ${getChangeColor(changeType)} flex items-center mt-1`}>
                            {changeType === 'positive' && (
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {changeType === 'negative' && (
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {change}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={`p-3 rounded-full ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : color === 'red' ? 'bg-red-50' : color === 'yellow' ? 'bg-yellow-50' : 'bg-purple-50'}`}>
                        <div className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'red' ? 'text-red-600' : color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`}>
                            {icon}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default StatCard;