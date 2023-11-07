import React from 'react';

interface GuessBoxProps {
    side_trait: any;
    top_trait: any;
    guess?: any;
    image?: string;
    openGuessModal: (side_trait: any, top_trait: any) => void;
}

export const GuessBox: React.FC<GuessBoxProps> = ({ side_trait, top_trait, guess, image, openGuessModal }) => {
    const handleClick = () => {
        if (!image) {
            openGuessModal(side_trait, top_trait);
        }
    };

    return (
        <button
            className="w-36 h-36 border-2 border-solid border-rounded border-gray-300"
            disabled={!!image}
            onClick={handleClick}
        >
            {image !== "" && (
                <img src={image} alt="" className="w-full h-full object-cover" />
            )}
        </button>
    );
};

export default GuessBox;