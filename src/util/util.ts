export interface Guesses {
  [key: string]: {
    [key: string]: string;
  };
}

export interface GuessesDefaults {
  [key: string]: {
    [key: string]: number;
  };
}

export function shuffle(
  a: any[],
  b: any = undefined,
  c: any = undefined,
  d: any = undefined
) {
  //array,placeholder,placeholder,placeholder
  c = a.length;
  while (c)
    (b = (Math.random() * c--) | 0), (d = a[c]), (a[c] = a[b]), (a[b] = d);
}

export const generateGridString = (
  guesses: Guesses,
  wagmi: boolean = false
) => {
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

export const generateShareText = (
  guesses: Guesses,
  numberOfGuesses: number = 9,
  wagmi: boolean = false,
  puzzle_number: number
) => {
  let shareText = `I just completed #ImmaculateVibes Grid #${puzzle_number}\n`;

  let gridString = generateGridString(guesses, wagmi);

  shareText += gridString;

  shareText += `Score: `;

  const numberCorrect = Object.keys(guesses).reduce((acc, side_trait) => {
    return (
      acc +
      Object.keys(guesses[side_trait]).reduce((acc, top_trait) => {
        return acc + (guesses[side_trait][top_trait] ? 1 : 0);
      }, 0)
    );
  }, 0);

  if (numberCorrect == 9) {
    shareText += "9 of 9 IMMACULATE";
  } else {
    shareText += `${numberCorrect} of 9`;
  }

  if (wagmi) {
    shareText += `*`;
  } else {
    shareText += `!`;
  }

  shareText += "\n";

  shareText += "\n";

  shareText +=
    "Test your NFT knowledge with today's puzzle at wagmigrid.com by @PlaguePoppets ";

  if (wagmi) {
    shareText += `\n\n*in ${numberOfGuesses} guesses! WAGMI!\n`;
  }

  return encodeURIComponent(shareText);
};

export const resetGuesses = (
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
