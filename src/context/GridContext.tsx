"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

import { resetGuesses, shuffle } from "@/util/util";

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

interface GuessModalParams {
  side_trait: string;
  top_trait: string;
  open: boolean;
}

interface GridContextProps {
  puzzles: string[][];
  total_collection_count: number;
  trait_criteria: { [key: string]: number[] };
  side_traits: string[];
  setSideTraits: React.Dispatch<React.SetStateAction<string[]>>;
  top_traits: string[];
  setTopTraits: React.Dispatch<React.SetStateAction<string[]>>;
  guessModalParams: GuessModalParams;
  setGuessModalParams: React.Dispatch<React.SetStateAction<GuessModalParams>>;
  alreadyGuessed: number[];
  setAlreadyGuessed: React.Dispatch<React.SetStateAction<number[]>>;
  results: Guesses;
  setResults: React.Dispatch<React.SetStateAction<Guesses>>;
  topChoices: GuessesDefaults;
  setTopChoices: React.Dispatch<React.SetStateAction<GuessesDefaults>>;
  numberPossible: GuessesDefaults;
  setNumberPossible: React.Dispatch<React.SetStateAction<GuessesDefaults>>;
  activePuzzle: string[];
  setActivePuzzle: React.Dispatch<React.SetStateAction<string[]>>;
  activePuzzleIndex: number;
  setActivePuzzleIndex: React.Dispatch<React.SetStateAction<number>>;
  activePuzzleDifficulty: number;
  setActivePuzzleDifficulty: React.Dispatch<React.SetStateAction<number>>;
  ping: boolean;
  setPing: React.Dispatch<React.SetStateAction<boolean>>;
  guessCounter: number;
  setGuessCounter: React.Dispatch<React.SetStateAction<number>>;
  wagmiMode: boolean;
  setWagmiMode: React.Dispatch<React.SetStateAction<boolean>>;
  giveUp: boolean;
  setGiveup: React.Dispatch<React.SetStateAction<boolean>>;
  showRules: boolean;
  setShowRules: React.Dispatch<React.SetStateAction<boolean>>;
}

const GridContext = createContext<GridContextProps | undefined>(undefined);

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const all_puzzles: string[][] = require("@/data/puzzles.json");
  const now = new Date();
  const fullDaysSinceEpoch = Math.floor(now.getTime() / 8.64e7);
  const puzzle_number = fullDaysSinceEpoch - 19669;
  const puzzles = all_puzzles.slice(0, puzzle_number + 1);

  const total_collection_count = 2971;
  const trait_criteria: {
    [key: string]: number[];
  } = require("@/data/trait_criteria.json");

  const [side_traits, setSideTraits] = useState<string[]>([]);
  const [top_traits, setTopTraits] = useState<string[]>([]);
  const [guessModalParams, setGuessModalParams] = useState<GuessModalParams>({
    side_trait: "",
    top_trait: "",
    open: false,
  });
  const [alreadyGuessed, setAlreadyGuessed] = useState<number[]>([]);
  const [results, setResults] = useState<Guesses>({});
  const [topChoices, setTopChoices] = useState<GuessesDefaults>({});
  const [numberPossible, setNumberPossible] = useState<GuessesDefaults>({});
  const [activePuzzle, setActivePuzzle] = useState<string[]>([]);
  const [activePuzzleIndex, setActivePuzzleIndex] = useState<number>(0);
  const [activePuzzleDifficulty, setActivePuzzleDifficulty] =
    useState<number>(0);
  const [ping, setPing] = useState<boolean>(false);
  const [guessCounter, setGuessCounter] = useState<number>(0);
  const [wagmiMode, setWagmiMode] = useState<boolean>(false);
  const [giveUp, setGiveup] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);

  useEffect(() => {
    setActivePuzzleIndex(puzzles.length - 1);
  }, []);

  useEffect(() => {
    setActivePuzzle(puzzles[activePuzzleIndex]);
  }, [activePuzzleIndex]);

  useEffect(() => {
    setSideTraits(activePuzzle.slice(0, 3));
    setTopTraits(activePuzzle.slice(3, 6));
  }, [JSON.stringify(activePuzzle)]);

  useEffect(() => {
    if (side_traits.length > 0 && top_traits.length > 0) {
      setResults(resetGuesses(side_traits, top_traits, "") as Guesses);
    }
  }, [JSON.stringify(side_traits), JSON.stringify(top_traits)]);

  useEffect(() => {
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

  React.useEffect(() => {
    const isModalClosed = localStorage.getItem("isModalClosed");
    if (!isModalClosed) {
      setShowRules(true);
    }
  }, []);

  return (
    <GridContext.Provider
      value={{
        puzzles: puzzles,
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
      }}
    >
      {children}
    </GridContext.Provider>
  );
};

export const useGridContext = () => {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error("useGridContext must be used within a GridProvider");
  }
  return context;
};
