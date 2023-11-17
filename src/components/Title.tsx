import React from "react";

import { Poppet } from "@/assets/PoppetSVG";

import { asap, titan } from "@/util/fonts";

const Title: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-center">
      <Poppet className="hidden md:inline h-[6em]" />
      <div className="flex flex-col">
        <h2
          className={`w-full text-center text-[3em] leading-none ${asap.className}`}
        >
          Immaculate{" "}
          <span className={`${titan.className} block md:inline`}>Vibes</span>{" "}
          Grid
        </h2>
        <h3 className="w-full text-center md:text-left text-sm md:text-[1.6em] text-slate-600 dark:text-slate-400">
          <Poppet className="inline md:hidden h-[2em]" />
          presented by plague poppets ({" "}
          <a
            href="https://plaguepoppets.io/mint"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            minting now!
          </a>{" "}
          )
        </h3>
      </div>
    </div>
  );
};

export default Title;
