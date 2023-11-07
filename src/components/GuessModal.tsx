import React from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface Collection {
    id: number;
    name: string;
    image: string;
}

// import collections from '@/data/collections.json';

const collections: Collection[] = require('@/data/collections.json');


interface GuessModalProps {
    side_trait: string;
    top_trait: string;
    open: boolean;
    checkGuess: (guess: number, side_trait: string, top_trait: string, img: string) => void;
}

export const GuessModal: React.FC<GuessModalProps> = ({ side_trait, top_trait, open, checkGuess }) => {
    const [guess, setGuess] = React.useState('');
    const [query, setQuery] = React.useState('')
    const [selected, setSelected] = React.useState<Collection | undefined>(undefined)

    React.useEffect(() => {
        setGuess('')
        setQuery('')
        setSelected({ id: -1, name: '', image: '' })
        if (open) {
            inputRef.current?.focus()
        }
    }, [open])

    React.useEffect(() => {
        if (selected) {
            setGuess(selected.name)
        }

    }, [selected])

    React.useEffect(() => {
        if (guess !== '') {
            handleSelect()
            setQuery('')

        }


    }, [guess])

    const inputRef = React.useRef<HTMLInputElement>(null)

    const filteredCollections =
        query === ''
            ? collections.slice(0, 10)
            : collections.filter((collection) => {

                return collection.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
            }).slice(0, 10)

    const handleSelect = () => {
        const guessId = collections.find((collection) => collection.name === guess)?.id || 0;
        checkGuess(guessId, side_trait, top_trait, collections.find((collection) => collection.id === guessId)?.image || collections[0].image || '');
    };

    return (
        <div className={`fixed z-10 inset-0 overflow-y-auto ${open ? '' : 'hidden'}`}>

            <Combobox value={selected} onChange={setSelected}  >
                <div className="relative mt-1">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Button as="div">
                            <Combobox.Input
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                displayValue={(collection?: Collection) => collection?.name || ''}
                                onChange={(event) => setQuery(event.target.value)}
                                ref={inputRef}
                            />
                        </Combobox.Button>
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
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
                        afterLeave={() => { setQuery(''); setSelected(undefined); setGuess('') }}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {filteredCollections.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredCollections.map((collection) => (
                                    <Combobox.Option
                                        key={collection.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                            }`
                                        }
                                        value={collection}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {collection.name}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                                                            }`}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
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


    );
};

export default GuessModal;