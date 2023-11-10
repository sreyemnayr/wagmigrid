"use client";
import { CategoryLabel } from "@/components/CategoryLabel";
import { FlashMessage } from "@/components/FlashMessage";
import { GuessBox } from "@/components/GuessBox";
import { GuessModal } from "@/components/GuessModal";
import { RulesModal } from "@/components/RulesModal";
import React from "react";

import { shuffle } from "@/util/util";
import { Asap_Condensed, Titan_One } from "next/font/google";

import { Button } from "@/components/Button";
import GridCounter from "@/components/GridCounter";
import Title from "@/components/Title";

const corners = [
  ["tl", "none", "tr"],
  ["none", "none", "none"],
  ["bl", "none", "br"],
];

const asap = Asap_Condensed({ weight: "400", subsets: ["latin"] });
const titan = Titan_One({ weight: "400", subsets: ["latin"] });

const now = new Date();
const fullDaysSinceEpoch = Math.floor(now.getTime() / 8.64e7);
const puzzle_number = fullDaysSinceEpoch - 19669;

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

const all_puzzles: string[][] = require("@/data/puzzles.json");
const puzzles = all_puzzles.slice(0, puzzle_number + 1);

const total_collection_count = 2971;

const generateGridString = (guesses: Guesses, wagmi: boolean = false) => {
  let gridString = "";

  Object.keys(guesses).forEach((side_trait) => {
    Object.keys(guesses[side_trait]).forEach((top_trait) => {
      gridString += guesses[side_trait][top_trait]
        ? wagmi
          ? "🟪"
          : "🟩"
        : "⬜";
    });
    gridString += "\n";
  });

  return gridString;
};

const generateShareText = (
  guesses: Guesses,
  numberOfGuesses: number = 9,
  wagmi: boolean = false,
  puzzle_number: number
) => {
  let shareText = `#ImmaculateVibes Grid #${puzzle_number}: `;

  const numberCorrect = Object.keys(guesses).reduce((acc, side_trait) => {
    return (
      acc +
      Object.keys(guesses[side_trait]).reduce((acc, top_trait) => {
        return acc + (guesses[side_trait][top_trait] ? 1 : 0);
      }, 0)
    );
  }, 0);

  if (numberCorrect == 9) {
    shareText += "9/9 IMMACULATE";
  } else {
    shareText += `${numberCorrect}/9`;
  }

  if (wagmi) {
    shareText += `*`;
  } else {
    shareText += `!`;
  }

  shareText += "\n";

  let gridString = generateGridString(guesses, wagmi);

  shareText += gridString;

  shareText += "\n";

  shareText += "Play today's grid by @PlaguePoppets at wagmigrid.com\n\n";

  if (wagmi) {
    shareText += `\n*in ${numberOfGuesses} guesses! WAGMI!\n`;
  }

  return encodeURIComponent(shareText);
};

interface TraitCriteria {
  [key: string]: number[];
}

const trait_criteria: TraitCriteria = require("@/data/trait_criteria.json");

const resetGuesses = (
  side_traits: string[],
  top_traits: string[],
  default_value: number | string = ""
) => {
  const reset_guesses: Guesses | GuessesDefaults = {};
  side_traits.forEach((side_trait) => {
    reset_guesses[side_trait] = {};
    top_traits.forEach((top_trait) => {
      reset_guesses[side_trait][top_trait] = default_value;
    });
  });
  return reset_guesses;
};

const Page = ({ params }: { params: { slug: string[] } }) => {
  console.log(params.slug);

  const [side_traits, setSideTraits] = React.useState<string[]>([]);
  const [top_traits, setTopTraits] = React.useState<string[]>([]);

  const [shareText, setShareText] = React.useState("");

  const [guessModalParams, setGuessModalParams] = React.useState({
    side_trait: "",
    top_trait: "",
    open: false,
  });

  const [alreadyGuessed, setAlreadyGuessed] = React.useState<number[]>([]);

  const [results, setResults] = React.useState<Guesses>({});
  const [topChoices, setTopChoices] = React.useState<GuessesDefaults>({});
  const [numberPossible, setNumberPossible] = React.useState<GuessesDefaults>(
    {}
  );

  const [activePuzzle, setActivePuzzle] = React.useState<string[]>([]);
  const [activePuzzleIndex, setActivePuzzleIndex] = React.useState<number>(0);
  const [activePuzzleDifficulty, setActivePuzzleDifficulty] =
    React.useState<number>(0);

  React.useEffect(() => {
    // choose random puzzle
    // setActivePuzzleIndex(Math.floor(Math.random() * puzzles.length));
    setActivePuzzleIndex(puzzles.length - 1);
  }, []);

  React.useEffect(() => {
    setActivePuzzle(puzzles[activePuzzleIndex]);
  }, [activePuzzleIndex]);

  React.useEffect(() => {
    setSideTraits(activePuzzle.slice(0, 3));
    setTopTraits(activePuzzle.slice(3, 6));
  }, [JSON.stringify(activePuzzle)]);

  React.useEffect(() => {
    if (side_traits.length > 0 && top_traits.length > 0) {
      setResults(resetGuesses(side_traits, top_traits, "") as Guesses);
    }
  }, [JSON.stringify(side_traits), JSON.stringify(top_traits)]);

  const [ping, setPing] = React.useState(false);

  React.useEffect(() => {
    if (side_traits.length > 0 && top_traits.length > 0) {
      const top_choices: GuessesDefaults = resetGuesses(
        side_traits,
        top_traits,
        0
      ) as GuessesDefaults;
      const num_possible: GuessesDefaults = resetGuesses(
        side_traits,
        top_traits,
        0
      ) as GuessesDefaults;

      let total_num_possible = 0;

      side_traits.forEach((side_trait) => {
        top_traits.forEach((top_trait) => {
          shuffle(trait_criteria[side_trait]);
          const filtered = trait_criteria[side_trait].filter((id) =>
            trait_criteria[top_trait].includes(id)
          );
          top_choices[side_trait][top_trait] = filtered[0];
          num_possible[side_trait][top_trait] = filtered.length;
          total_num_possible += filtered.length;
        });
      });

      setTopChoices(top_choices);
      setNumberPossible(num_possible);
      setActivePuzzleDifficulty(
        (((1 - total_num_possible / (total_collection_count * 1.5)) * 10) / 2) |
          0
      );
    }
  }, [JSON.stringify(side_traits), JSON.stringify(top_traits), ping]);

  const [guessCounter, setGuessCounter] = React.useState(0);
  const [wagmiMode, setWagmiMode] = React.useState(false);
  const [giveUp, setGiveup] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const openGuessModal = (side_trait: string, top_trait: string) => {
    if (!giveUp && (wagmiMode || guessCounter < 9)) {
      inputRef.current?.focus();
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

  React.useEffect(() => {
    setShareText(
      generateShareText(results, guessCounter, wagmiMode, activePuzzleIndex + 1)
    );
  }, [results]);

  const [showRules, setShowRules] = React.useState(false);

  React.useEffect(() => {
    const isModalClosed = localStorage.getItem("isModalClosed");
    if (!isModalClosed) {
      setShowRules(true);
    }
  }, []);

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

      <div className="my-auto grid grid-cols-5 grid-rows-5 gap-px w-[80vh] max-w-[95vw] md:max-w-[80vw] aspect-square text-xs md:text-sm grid-flow-dense">
        <div></div>
        {top_traits.map((trait, i) => (
          <CategoryLabel label={trait} key={`top_label_${i}`} />
        ))}

        <div></div>

        {side_traits.map((side_trait, i) => (
          <>
            <CategoryLabel label={side_trait} key={`side_label_${i}`} />
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
                key={`guess_box_${i}_${j}`}
              />
            ))}
            {i == 0 && (
              <GridCounter
                wagmiMode={wagmiMode}
                guessCounter={guessCounter}
                giveUp={giveUp}
                shareText={shareText}
                setGiveup={setGiveup}
                key="grid_counter"
              />
            )}
          </>
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
