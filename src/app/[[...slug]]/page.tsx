"use client";
import { CategoryLabel } from "@/components/CategoryLabel";
import { FlashMessage } from "@/components/FlashMessage";
import { GuessBox } from "@/components/GuessBox";
import { GuessModal } from "@/components/GuessModal";
import { RulesModal } from "@/components/RulesModal";
import React from "react";

import { Button } from "@/components/Button";
import GridCounter from "@/components/GridCounter";
import Title from "@/components/Title";

import { Guesses } from "@/util/util";

import { useGridContext } from "@/context/GridContext";

const corners = [
  ["tl", "none", "tr"],
  ["none", "none", "none"],
  ["bl", "none", "br"],
];

import { asap } from "@/util/fonts";

const total_collection_count = 2971;

const Page = ({ params }: { params: { slug: string[] } }) => {
  console.log(params.slug);

  const {
    puzzles,
    total_collection_count,
    trait_criteria,
    side_traits,
    setSideTraits,
    top_traits,
    setTopTraits,
    guessModalParams,
    setGuessModalParams,
    alreadyGuessed,
    setAlreadyGuessed,
    results,
    setResults,
    topChoices,
    setTopChoices,
    numberPossible,
    setNumberPossible,
    activePuzzle,
    setActivePuzzle,
    activePuzzleIndex,
    setActivePuzzleIndex,
    activePuzzleDifficulty,
    setActivePuzzleDifficulty,
    ping,
    setPing,
    guessCounter,
    setGuessCounter,
    wagmiMode,
    setWagmiMode,
    giveUp,
    setGiveup,
    showRules,
    setShowRules,
  } = useGridContext();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const openGuessModal = (side_trait: string, top_trait: string) => {
    inputRef.current?.focus();
    if (!giveUp && (wagmiMode || guessCounter < 9)) {
      setGuessModalParams({ side_trait, top_trait, open: true });
    } else {
      setPing((c) => !c);
    }
  };

  const closeGuessModal = () => {
    setGuessModalParams((cur) => ({
      side_trait: cur.side_trait,
      top_trait: cur.side_trait,
      open: false,
    }));
  };

  const checkGuess = (
    guess: number,
    side_trait: string,
    top_trait: string,
    img: string
  ) => {
    if (trait_criteria[side_trait].includes(guess)) {
      if (trait_criteria[top_trait].includes(guess)) {
        setResults((cur: Guesses) => ({
          ...cur,
          [side_trait]: { ...cur[side_trait], [top_trait]: img },
        }));
        setAlreadyGuessed((cur) => [...cur, guess]);
      }
    }

    setGuessCounter((cur) => cur + 1);

    closeGuessModal();
  };

  const closeRulesModal = () => {
    setShowRules(false);
    localStorage.setItem("isModalClosed", "true");
  };

  return (
    <div
      className={`my-auto w-[100vw] h-[100vh] grid place-content-center mx-auto overflow-hidden bg-gray-200 rounded-lg shadow-md dark:bg-gray-800 text-slate-800 dark:text-slate-200 ${asap.className}`}
    >
      <Title />
      <GuessModal
        open={guessModalParams.open}
        side_trait={guessModalParams.side_trait}
        top_trait={guessModalParams.top_trait}
        checkGuess={checkGuess}
        closeModal={closeGuessModal}
        already_guessed={alreadyGuessed}
        inputRef={inputRef}
      />
      <RulesModal open={showRules} close={closeRulesModal} />

      <div
        className="my-auto grid grid-cols-5 grid-rows-5 gap-px w-[80vh] max-w-[95vw] md:max-w-[80vw] aspect-square text-xs md:text-sm grid-flow-dense"
        key={`traits_grid`}
      >
        <div></div>
        {top_traits.map((trait, i) => (
          <CategoryLabel label={trait} key={`top_label_${trait}x${i}`} />
        ))}

        <div></div>

        {side_traits.map((side_trait, i) => (
          <React.Fragment key={`side_trait_${i}`}>
            <CategoryLabel label={side_trait} />
            {top_traits.map((top_trait, j) => (
              <GuessBox
                side_trait={side_trait}
                top_trait={top_trait}
                openGuessModal={openGuessModal}
                inputRef={inputRef}
                image={results?.[side_trait]?.[top_trait]}
                corner={corners[i][j]}
                top_guess={topChoices?.[side_trait]?.[top_trait]}
                give_up={giveUp}
                number_possible={numberPossible?.[side_trait]?.[top_trait]}
                key={`guess_box_${top_trait}x${side_trait}x${i}_${j}`}
              />
            ))}
            {i == 0 && <GridCounter key={`grid_counterx${side_trait}`} />}
          </React.Fragment>
        ))}

        <div></div>
        <div className="col-span-3 flex flex-row items-center justify-center">
          <Button
            onClick={() => {
              setShowRules(true);
            }}
          >
            WTF?
          </Button>

          {!wagmiMode && (
            <Button
              onClick={() => {
                if (!giveUp) {
                  setWagmiMode(true);
                } else {
                  setGuessCounter(0);
                  setWagmiMode(true);
                  setGiveup(false);
                }
              }}
            >
              WAGMI
            </Button>
          )}
          {wagmiMode && (
            <div
              className={`text-sm w-24 text-center px-4 py-2 font-bold bg-gradient-to-r from-red-400 via-green-500 to-indigo-400 text-transparent bg-clip-text ${asap.className}`}
            >
              WAGMI MODE ENGAGED!
            </div>
          )}
          <FlashMessage show={wagmiMode} />
        </div>
        <div></div>
      </div>
      <div className="flex flex-row justify-center items-center">
        You&apos;re playing puzzle #{activePuzzleIndex + 1} of {puzzles.length}{" "}
        - Difficulty {activePuzzleDifficulty} ({" "}
        <button
          className="underline"
          onClick={() => {
            setGuessCounter(0);
            setWagmiMode(false);
            setGiveup(false);
            setActivePuzzleIndex(Math.floor(Math.random() * puzzles.length));
          }}
        >
          try another?
        </button>{" "}
        )
      </div>
    </div>
  );
};

export default Page;
