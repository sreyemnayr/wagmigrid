import React from 'react';

interface CategoryLabelProps {
    label: string;
}

export const CategoryLabel: React.FC<CategoryLabelProps> = ({ label }) => {
    return <div className="p-2 grid place-content-center w-full aspect-square border-2 border-solid border-blue-800 text-blue-800 text-xs md:text-sm">
        {label}</div>;
};

export default CategoryLabel;