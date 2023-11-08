import React from 'react';

interface CategoryLabelProps {
    label: string;
}

export const CategoryLabel: React.FC<CategoryLabelProps> = ({ label }) => {
    return <div className="grid place-content-center w-full aspect-square uppercase text-xs md:text-sm  ">
        {label}</div>;
};

export default CategoryLabel;