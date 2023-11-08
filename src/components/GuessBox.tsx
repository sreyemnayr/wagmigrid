import React from 'react';

interface GuessBoxProps {
    side_trait: any;
    top_trait: any;
    guess?: any;
    image?: string;
    corner?: string;
    openGuessModal: (side_trait: any, top_trait: any) => void;
    top_guess?: number;
    give_up?: boolean;
}

const corners: {
    [key: string]: string;
} = {
    'tl': 'rounded-tl-2xl',
    'tr': 'rounded-tr-2xl',
    'bl': 'rounded-bl-2xl',
    'br': 'rounded-br-2xl',
}

interface Collection {
    id: number;
    name: string;
    image: string;
}

// import collections from '@/data/collections.json';

const collections: Collection[] = require('@/data/collections.json');

export const GuessBox: React.FC<GuessBoxProps> = ({ side_trait, top_trait, guess, image, corner, openGuessModal, top_guess, give_up }) => {
    const handleClick = () => {
        if (!image) {
            openGuessModal(side_trait, top_trait);
        }
    };

    return (
        <button
            className={`relative w-full aspect-square hover:bg-slate-600 ${image !== '' && !give_up ? 'bg-slate-200' : 'bg-slate-700'} ${corner ? corners[corner] : ''} ${image === "" && give_up ? 'opacity-10 hover:opacity-80' : ''}`}
            disabled={!!image}
            onClick={handleClick}
        >
            {image !== "" && (
                <>
                    <img src={image} alt="" className={`w-full h-full object-cover ${corner ? corners[corner] : ''}`} />
                    <div className="absolute bottom-0 left-0 w-full  bg-black text-white opacity-50">
                        {collections.find((collection) => collection.image === image)?.name || ""}
                    </div>
                </>
            )}
            {image === "" && give_up && (
                <>
                    <img src={collections.find((collection) => collection.id === top_guess)?.image || ""} alt="" className={`w-full h-full  object-cover ${corner ? corners[corner] : ''}`} />
                    <div className="absolute bottom-0 left-0 w-full  bg-black text-white opacity-50">
                        {collections.find((collection) => collection.id === top_guess)?.name || ""}
                    </div>
                </>
            )}
        </button>
    );
};

export default GuessBox;