import React from "react";
import type { NextPage } from "next";
import { Button } from "../components/Button";
import { CategoryLabel } from "@/components/CategoryLabel";
import { GuessBox } from "@/components/GuessBox";
import { ArticlesList, getArticlePath } from "./a/[slug]";
import { GuessModal } from "@/components/GuessModal";
import { RulesModal } from "@/components/RulesModal";

// import winners from "@/data/winners.json";

interface Winner {
  [key: string]: {
    [key: string]: number[];
  };
}


const winners: Winner = require("@/data/winners.json");



const Home: NextPage = () => {

  const [guessModalParams, setGuessModalParams] = React.useState({ side_trait: "", top_trait: "", open: false });

  interface Guesses {
    [key: string]: {
      [key: string]: string;
    };
  }

  const [results, setResults] = React.useState<Guesses>({
    Background: {
      Alien: '',
      Flower: '',
      Zombie: '',
    },
    Crown: {
      Alien: '',
      Flower: '',
      Zombie: '',
    },
    Glasses: {
      Alien: '',
      Flower: '',
      Zombie: '',
    },
  });

  const [guessCounter, setGuessCounter] = React.useState(0);

  const openGuessModal = (side_trait: string, top_trait: string) => {
    setGuessModalParams({ side_trait, top_trait, open: true });
  }

  const closeGuessModal = () => {
    setGuessModalParams((cur) => ({ side_trait: cur.side_trait, top_trait: cur.side_trait, open: false }));
  }

  const checkGuess = (guess: number, side_trait: string, top_trait: string, img: string) => {
    if (((winners?.[side_trait] || [])?.[top_trait] as number[] || []).includes(guess)) {
      setResults((cur: Guesses) => ({ ...cur, [side_trait]: { ...cur[side_trait], [top_trait]: img } }));
    }
    setGuessCounter((cur) => cur + 1);

    closeGuessModal();
  }

  return (


    <div className="my-auto w-[100vw] h-[100vh] grid place-content-center mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-200">

      <h2 className="w-full text-center text-[3em]">WAGMI Grid</h2>
      <GuessModal open={guessModalParams.open} side_trait={guessModalParams.side_trait} top_trait={guessModalParams.top_trait} checkGuess={checkGuess} />
      <RulesModal />

      <div className="grid grid-cols-4 grid-rows-4 gap-0 w-[80vh] max-w-[80vw] aspect-square text-xs md:text-sm">
        <div className="w-full grid place-content-center"><span className="text-center md:text-xl">{9 - guessCounter}</span><span className="text-center">guesses</span><span>remaining</span></div>
        <CategoryLabel label="Alien" />
        <CategoryLabel label="Flower" />
        <CategoryLabel label="Zombie" />

        <CategoryLabel label="Background" />
        <GuessBox side_trait="Background" top_trait="Alien" openGuessModal={openGuessModal} image={results.Background.Alien} />
        <GuessBox side_trait="Background" top_trait="Flower" openGuessModal={openGuessModal} image={results.Background.Flower} />
        <GuessBox side_trait="Background" top_trait="Zombie" openGuessModal={openGuessModal} image={results.Background.Zombie} />

        <CategoryLabel label="Crown" />
        <GuessBox side_trait="Crown" top_trait="Alien" openGuessModal={openGuessModal} image={results.Crown.Alien} />
        <GuessBox side_trait="Crown" top_trait="Flower" openGuessModal={openGuessModal} image={results.Crown.Flower} />
        <GuessBox side_trait="Crown" top_trait="Zombie" openGuessModal={openGuessModal} image={results.Crown.Zombie} />

        <CategoryLabel label="Glasses" />
        <GuessBox side_trait="Glasses" top_trait="Alien" openGuessModal={openGuessModal} image={results.Glasses.Alien} />
        <GuessBox side_trait="Glasses" top_trait="Flower" openGuessModal={openGuessModal} image={results.Glasses.Flower} />
        <GuessBox side_trait="Glasses" top_trait="Zombie" openGuessModal={openGuessModal} image={results.Glasses.Zombie} />

      </div>
    </div>
  );
};

export default Home;
