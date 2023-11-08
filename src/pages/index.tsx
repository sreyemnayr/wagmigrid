import React from "react";
import type { NextPage } from "next";
import { Button } from "../components/Button";
import { CategoryLabel } from "@/components/CategoryLabel";
import { GuessBox } from "@/components/GuessBox";
import { ArticlesList, getArticlePath } from "./a/[slug]";
import { GuessModal } from "@/components/GuessModal";
import { RulesModal } from "@/components/RulesModal";
import { FlashMessage } from "@/components/FlashMessage";

import { shuffle } from "@/util/util";
import { Asap_Condensed } from 'next/font/google';
import { Titan_One } from "next/font/google";

import { Poppet } from "@/assets/PoppetSVG";

const asap = Asap_Condensed({ weight: "400", subsets: ['latin'] })
const titan = Titan_One({ weight: "400", subsets: ['latin'] })

interface Guesses {
  [key: string]: {
    [key: string]: string;
  };
}

interface GuessesDefaults {
  [key: string]: {
    [key: string]: number;
  };
}

const generateGridString = (guesses: Guesses) => {
  let gridString = "";

  Object.keys(guesses).forEach((side_trait) => {
    Object.keys(guesses[side_trait]).forEach((top_trait) => {
      gridString += guesses[side_trait][top_trait] ? "🟪" : "⬜";
    });
    gridString += "\n";
  });

  return gridString;
};

const generateShareText = (guesses: Guesses, numberOfGuesses: number = 9, wagmi: boolean = false) => {

  let shareText = "";

  const numberCorrect = Object.keys(guesses).reduce((acc, side_trait) => {
    return acc + Object.keys(guesses[side_trait]).reduce((acc, top_trait) => {
      return acc + (guesses[side_trait][top_trait] ? 1 : 0);
    }, 0);
  }, 0);
  shareText = "\n";
  if (numberCorrect == 9) {

    shareText += "9/9 IMMACULATE"
  } else {
    shareText += `${numberCorrect}/9`;
  }

  if (wagmi) {
    shareText += `*`;
  } else {
    shareText += `!`;
  }

  shareText += "\n";

  let gridString = generateGridString(guesses);

  shareText += gridString;

  shareText += "\n";

  shareText += "Play today's Immaculate Vibes Grid by @PlaguePoppets\n\n";

  if (wagmi) {
    shareText += `\n*in ${numberOfGuesses} guesses! WAGMI!\n`;
  }

  return encodeURIComponent(shareText);
};

// import winners from "@/data/winners.json";

interface Winner {
  [key: string]: {
    [key: string]: number[];
  };
}

interface TraitCriteria {
  [key: string]: number[]
}

const winners: Winner = require("@/data/winners.json");

const trait_criteria: TraitCriteria = require("@/data/trait_criteria.json");



const Home: NextPage = () => {

  const [side_traits, setSideTraits] = React.useState<string[]>([]);
  const [top_traits, setTopTraits] = React.useState<string[]>([]);

  const [shareText, setShareText] = React.useState("");

  const [guessModalParams, setGuessModalParams] = React.useState({ side_trait: "", top_trait: "", open: false });

  const [alreadyGuessed, setAlreadyGuessed] = React.useState<number[]>([]);



  const [results, setResults] = React.useState<Guesses>({});
  const [topChoices, setTopChoices] = React.useState<GuessesDefaults>({});

  React.useEffect(() => {
    setSideTraits(["Background", "Airdrop / Free Mints", "Glasses"]);
    setTopTraits(["Cigar", "Flower", "3D Glasses"]);
  }, []);

  React.useEffect(() => {
    if (side_traits.length > 0 && top_traits.length > 0) {
      setResults({
        [side_traits[0]]: {
          [top_traits[0]]: "",
          [top_traits[1]]: "",
          [top_traits[2]]: "",
        },
        [side_traits[1]]: {
          [top_traits[0]]: "",
          [top_traits[1]]: "",
          [top_traits[2]]: "",
        },
        [side_traits[2]]: {
          [top_traits[0]]: "",
          [top_traits[1]]: "",
          [top_traits[2]]: "",
        },
      });

      shuffle(trait_criteria[side_traits[0]]);
      shuffle(trait_criteria[side_traits[1]]);
      shuffle(trait_criteria[side_traits[2]]);

      const top_choices: GuessesDefaults = {
        [side_traits[0]]: {
          [top_traits[0]]: 0,
          [top_traits[1]]: 0,
          [top_traits[2]]: 0,
        },
        [side_traits[1]]: {
          [top_traits[0]]: 0,
          [top_traits[1]]: 0,
          [top_traits[2]]: 0,
        },
        [side_traits[2]]: {
          [top_traits[0]]: 0,
          [top_traits[1]]: 0,
          [top_traits[2]]: 0,
        },
      }

      top_choices[side_traits[0]][top_traits[0]] = trait_criteria[side_traits[0]].find((id) => trait_criteria[top_traits[0]].includes(id)) || 0;
      top_choices[side_traits[1]][top_traits[0]] = trait_criteria[side_traits[1]].find((id) => trait_criteria[top_traits[0]].includes(id)) || 0;
      top_choices[side_traits[2]][top_traits[0]] = trait_criteria[side_traits[2]].find((id) => trait_criteria[top_traits[0]].includes(id)) || 0;

      shuffle(trait_criteria[side_traits[0]]);
      shuffle(trait_criteria[side_traits[1]]);
      shuffle(trait_criteria[side_traits[2]]);

      top_choices[side_traits[0]][top_traits[1]] = trait_criteria[side_traits[0]].find((id) => trait_criteria[top_traits[1]].includes(id)) || 0;
      top_choices[side_traits[1]][top_traits[1]] = trait_criteria[side_traits[1]].find((id) => trait_criteria[top_traits[1]].includes(id)) || 0;
      top_choices[side_traits[2]][top_traits[1]] = trait_criteria[side_traits[2]].find((id) => trait_criteria[top_traits[1]].includes(id)) || 0;

      shuffle(trait_criteria[side_traits[0]]);
      shuffle(trait_criteria[side_traits[1]]);
      shuffle(trait_criteria[side_traits[2]]);

      top_choices[side_traits[0]][top_traits[2]] = trait_criteria[side_traits[0]].find((id) => trait_criteria[top_traits[2]].includes(id)) || 0;
      top_choices[side_traits[1]][top_traits[2]] = trait_criteria[side_traits[1]].find((id) => trait_criteria[top_traits[2]].includes(id)) || 0;
      top_choices[side_traits[2]][top_traits[2]] = trait_criteria[side_traits[2]].find((id) => trait_criteria[top_traits[2]].includes(id)) || 0;

      setTopChoices(top_choices);

    }
  }, [JSON.stringify(side_traits), JSON.stringify(top_traits)]);

  const [guessCounter, setGuessCounter] = React.useState(0);
  const [wagmiMode, setWagmiMode] = React.useState(false);
  const [giveUp, setGiveup] = React.useState(false);

  const openGuessModal = (side_trait: string, top_trait: string) => {
    if (!giveUp && (wagmiMode || guessCounter < 9)) {
      setGuessModalParams({ side_trait, top_trait, open: true });
    }

  }

  const closeGuessModal = () => {
    setGuessModalParams((cur) => ({ side_trait: cur.side_trait, top_trait: cur.side_trait, open: false }));
  }

  const checkGuess = (guess: number, side_trait: string, top_trait: string, img: string) => {
    if (trait_criteria[side_trait].includes(guess)) {
      if (trait_criteria[top_trait].includes(guess)) {
        setResults((cur: Guesses) => ({ ...cur, [side_trait]: { ...cur[side_trait], [top_trait]: img } }));
        setAlreadyGuessed((cur) => [...cur, guess]);
      }
    }

    setGuessCounter((cur) => cur + 1);

    closeGuessModal();
  }

  React.useEffect(() => {

    setShareText(generateShareText(results, guessCounter, wagmiMode));
  }, [results]);

  const [showRules, setShowRules] = React.useState(false);



  return (


    <div className={`my-auto w-[100vw] h-[100vh] grid place-content-center mx-auto overflow-hidden bg-gray-200 rounded-lg shadow-md dark:bg-gray-800 text-slate-800 dark:text-slate-200 ${asap.className}`}>

      <div className="flex flex-col md:flex-row"><Poppet className="hidden md:inline h-[6em]" /><div className="flex flex-col"><h2 className="w-full text-center text-[3em] leading-none">Immaculate <span className={`${titan.className} block md:inline`}>Vibes</span> Grid</h2>
        <h3 className="w-full text-left text-[1.6em] text-slate-600"><Poppet className="inline md:hidden h-[3em]" />presented by plague poppets ( <a href="https://plaguepoppets.io/mint" className="underline" target="_blank">minting now!</a> )</h3></div></div>
      <GuessModal open={guessModalParams.open} side_trait={guessModalParams.side_trait} top_trait={guessModalParams.top_trait} checkGuess={checkGuess} closeModal={closeGuessModal} already_guessed={alreadyGuessed} />
      <RulesModal open={showRules} />

      <div className="my-auto grid grid-cols-5 grid-rows-5 gap-px w-[80vh] max-w-[95vw] md:max-w-[80vw] aspect-square text-xs md:text-sm grid-flow-dense">
        <div></div>
        <CategoryLabel label={top_traits[0]} />
        <CategoryLabel label={top_traits[1]} />
        <CategoryLabel label={top_traits[2]} />
        <div></div>

        <CategoryLabel label={side_traits[0]} />
        <GuessBox side_trait={side_traits[0]} top_trait={top_traits[0]} openGuessModal={openGuessModal} image={results?.[side_traits[0]]?.[top_traits[0]]} corner="tl" top_guess={topChoices?.[side_traits[0]]?.[top_traits[0]]} give_up={giveUp} />
        <GuessBox side_trait={side_traits[0]} top_trait={top_traits[1]} openGuessModal={openGuessModal} image={results?.[side_traits[0]]?.[top_traits[1]]} top_guess={topChoices?.[side_traits[0]]?.[top_traits[1]]} give_up={giveUp} />
        <GuessBox side_trait={side_traits[0]} top_trait={top_traits[2]} openGuessModal={openGuessModal} image={results?.[side_traits[0]]?.[top_traits[2]]} corner="tr" top_guess={topChoices?.[side_traits[0]]?.[top_traits[2]]} give_up={giveUp} />

        <div className="w-full grid place-content-center row-span-3"><div className="text-center text-xs uppercase">guesses left</div><div className="text-center md:text-4xl">{wagmiMode ? '∞' : 9 - guessCounter}</div>


          {((!wagmiMode && guessCounter >= 9) || giveUp) && (
            <a className=" px-4 py-2 text-center text-white text-sm font-bold bg-blue-500 border-2 border-black rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all duration-300 scale-90 hover:bg-white hover:text-blue-500 hover:border-blue-500 hover:shadow-blue-500 hover:scale-100 active:bg-yellow-300 active:shadow-none active:translate-y-1"
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=https://wagmigrid.vercel.app`}
              target="_blank"
            >Share on X</a>
          )}
          {(guessCounter < 9 || wagmiMode) && (!giveUp) && (
            <button className=" px-4 py-2 text-center text-white text-sm font-bold bg-blue-500 border-2 border-black rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all duration-300 scale-90 hover:bg-white hover:text-blue-500 hover:border-blue-500 hover:shadow-blue-500 hover:scale-100 active:bg-yellow-300 active:shadow-none active:translate-y-1"
              onClick={() => { setGiveup(true); }}
            >Give Up</button>
          )}


        </div>


        <CategoryLabel label={side_traits[1]} />
        <GuessBox side_trait={side_traits[1]} top_trait={top_traits[0]} openGuessModal={openGuessModal} image={results?.[side_traits[1]]?.[top_traits[0]]} top_guess={topChoices?.[side_traits[1]]?.[top_traits[0]]} give_up={giveUp} />
        <GuessBox side_trait={side_traits[1]} top_trait={top_traits[1]} openGuessModal={openGuessModal} image={results?.[side_traits[1]]?.[top_traits[1]]} top_guess={topChoices?.[side_traits[1]]?.[top_traits[1]]} give_up={giveUp} />
        <GuessBox side_trait={side_traits[1]} top_trait={top_traits[2]} openGuessModal={openGuessModal} image={results?.[side_traits[1]]?.[top_traits[2]]} top_guess={topChoices?.[side_traits[1]]?.[top_traits[2]]} give_up={giveUp} />


        <CategoryLabel label={side_traits[2]} />
        <GuessBox side_trait={side_traits[2]} top_trait={top_traits[0]} openGuessModal={openGuessModal} image={results?.[side_traits[2]]?.[top_traits[0]]} corner="bl" top_guess={topChoices?.[side_traits[2]]?.[top_traits[0]]} give_up={giveUp} />
        <GuessBox side_trait={side_traits[2]} top_trait={top_traits[1]} openGuessModal={openGuessModal} image={results?.[side_traits[2]]?.[top_traits[1]]} top_guess={topChoices?.[side_traits[2]]?.[top_traits[1]]} give_up={giveUp} />
        <GuessBox side_trait={side_traits[2]} top_trait={top_traits[2]} openGuessModal={openGuessModal} image={results?.[side_traits[2]]?.[top_traits[2]]} corner="br" top_guess={topChoices?.[side_traits[2]]?.[top_traits[2]]} give_up={giveUp} />

        <div></div>
        <div className="col-span-3 flex flex-row items-center justify-center">
          <button type="button" className=" px-4 py-2 text-center text-white text-sm font-bold bg-red-500 border-2 border-black rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all duration-300 scale-90 hover:bg-white hover:text-red-500 hover:border-red-500 hover:shadow-red-500 hover:scale-100 active:bg-yellow-300 active:shadow-none active:translate-y-1 h-fit"
            onClick={() => { setShowRules(true); }}
          >WTF?</button>

          {!wagmiMode && (
            <button type="button" className=" px-4 py-2 text-center text-white text-sm font-bold bg-red-500 border-2 border-black rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all duration-300 scale-90 hover:bg-white hover:text-red-500 hover:border-red-500 hover:shadow-red-500 hover:scale-100 active:bg-yellow-300 active:shadow-none active:translate-y-1 h-fit"
              onClick={() => { setWagmiMode(true); }}
            >
              WAGMI

            </button>
          )}
          {wagmiMode && (
            <div className={`text-sm w-24 text-center px-4 py-2 font-bold bg-gradient-to-r from-red-400 via-green-500 to-indigo-400 text-transparent bg-clip-text ${asap.className}`}>
              WAGMI MODE ENGAGED!
            </div>
          )}
          <FlashMessage show={wagmiMode} />

        </div>
        <div></div>


      </div>
    </div>
  );
};

export default Home;
