"use client";
import React from "react";
import { Button } from "./Button";

interface GridCounterProps {
  wagmiMode: boolean;
  guessCounter: number;
  giveUp: boolean;
  shareText: string;
  setGiveup: (value: boolean) => void;
}

export const GridCounter: React.FC<GridCounterProps> = ({
  wagmiMode,
  guessCounter,
  giveUp,
  shareText,
  setGiveup,
}) => {
  return (
    <div className="w-full grid place-content-center row-span-3">
      <div className="text-center text-xs uppercase">guesses left</div>
      <div className="text-center md:text-4xl">
        {wagmiMode ? "∞" : 9 - guessCounter}
      </div>
      {((!wagmiMode && guessCounter >= 9) || giveUp) && (
        <Button
          as="a"
          href={`https://twitter.com/intent/tweet?text=${shareText}`}
          target="_blank"
          color="blue"
        >
          Share on X
        </Button>
      )}
      {!giveUp && (
        <Button
          color="blue"
          onClick={() => {
            setGiveup(true);
          }}
        >
          {guessCounter < 9 || wagmiMode ? "NGMI" : "Refresh Metadata"}
        </Button>
      )}
    </div>
  );
};

export default GridCounter;
