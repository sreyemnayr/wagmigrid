"use client";
import React from "react";
import { Button } from "./Button";

import { useGridContext } from "@/context/GridContext";
import { generateShareText } from "@/util/util";

export const GridCounter: React.FC = () => {
  const {
    wagmiMode,
    guessCounter,
    giveUp,
    setGiveup,
    results,
    activePuzzleIndex,
  } = useGridContext();
  const [shareText, setShareText] = React.useState("");

  React.useEffect(() => {
    setShareText(
      generateShareText(results, guessCounter, wagmiMode, activePuzzleIndex + 1)
    );
  }, [results]);

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
