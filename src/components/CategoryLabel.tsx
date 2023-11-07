import React from 'react';

interface CategoryLabelProps {
    label: string;
}

export const CategoryLabel: React.FC<CategoryLabelProps> = ({ label }) => {
    return <div className="grid place-content-center w-36 h-36  bg-blue-500 text-white rounded">{label}</div>;
};

export default CategoryLabel;