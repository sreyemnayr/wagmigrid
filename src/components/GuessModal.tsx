import { Combobox, Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";

interface Collection {
  id: number;
  name: string;
  image: string;
}

// import collections from '@/data/collections.json';

const collections: Collection[] = require("@/data/collections.json");

interface GuessModalProps {
  side_trait: string;
  top_trait: string;
  open: boolean;
  closeModal: () => void;
  checkGuess: (
    guess: number,
    side_trait: string,
    top_trait: string,
    img: string
  ) => void;
  already_guessed: number[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export const GuessModal: React.FC<GuessModalProps> = ({
  side_trait,
  top_trait,
  open,
  closeModal,
  checkGuess,
  already_guessed,
  inputRef,
}) => {
  const [guess, setGuess] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Collection | undefined>(
    undefined
  );

  const [shareText, setShareText] = React.useState("");

  React.useEffect(() => {
    setGuess("");
    setQuery("");
    setSelected({ id: -1, name: "", image: "" });
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (selected) {
      setGuess(selected.name);
    }
  }, [selected]);

  React.useEffect(() => {
    if (guess !== "") {
      handleSelect();
      setQuery("");
    }
  }, [guess]);

  React.useEffect(() => {
    setShareText(
      encodeURI(
        `Hey @PlaguePoppets, I tried to guess ${query} on the Immaculate Vibes Grid today, but it was missing! Can you add it?`
      )
    );
  }, [query]);

  const filteredCollections =
    query === ""
      ? []
      : collections
          .filter((collection) => {
            return !already_guessed.includes(collection.id);
          })
          .filter((collection) => {
            return collection.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""));
          })
          .slice(0, 10);

  const handleSelect = () => {
    const guessId =
      collections.find((collection) => collection.name === guess)?.id || 0;
    checkGuess(
      guessId,
      side_trait,
      top_trait,
      collections.find((collection) => collection.id === guessId)?.image ||
        collections[0].image ||
        ""
    );
  };

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 md:inset-24 z-10 overflow-hidden"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <Combobox value={selected} onChange={setSelected}>
            <div className="relative mt-[70%] md:mt-1">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-slate-100 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Button as="div" className="bg-slate-100">
                  <div className="relative  hover:bg-slate-600 bg-slate-700 rounded-tl-lg rounded-tr-lg px-3 py-2 text-slate-100">
                    Choose an NFT Collection that satisfies: {side_trait} x{" "}
                    {top_trait}
                  </div>
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-[16px]md:text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(collection?: Collection) =>
                      collection?.name || ""
                    }
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Begin typing to search..."
                    ref={inputRef}
                  />
                </Combobox.Button>
                <Combobox.Button className="absolute bottom-0 right-0 flex items-center pr-2 pb-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={React.Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => {
                  setQuery("");
                  setSelected(undefined);
                  setGuess("");
                }}
              >
                <Combobox.Options className="absolute mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {filteredCollections.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700 w-full flex flex-row justify-between">
                      Nothing found.
                      <a
                        className=" px-4 py-2 my-2 text-center text-white text-sm font-bold bg-blue-500 border-2 border-black rounded-lg shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all duration-300 scale-90 hover:bg-white hover:text-blue-500 hover:border-blue-500 hover:shadow-blue-500 hover:scale-100 active:bg-yellow-300 active:shadow-none active:translate-y-1"
                        href={`https://twitter.com/intent/tweet?text=${shareText}&url=https://wagmigrid.vercel.app`}
                        target="_blank"
                      >
                        Let us know!
                      </a>
                    </div>
                  ) : (
                    filteredCollections.map((collection) => (
                      <Combobox.Option
                        key={collection.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-teal-600 text-white" : "text-gray-900"
                          }`
                        }
                        value={collection}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {collection.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GuessModal;
