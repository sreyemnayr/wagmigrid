import { useState, useEffect } from 'react';
import rules from '@/data/rules.json';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export const RulesModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const isModalClosed = localStorage.getItem('isModalClosed');
        if (!isModalClosed) {
            setIsOpen(true);
        }
    }, []);

    const closeModal = () => {
        setIsOpen(false);
        localStorage.setItem('isModalClosed', 'true');
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 text-center">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                    <span
                        className="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                        >
                            Game Rules
                        </Dialog.Title>

                        <div className="mt-2">
                            <ul className="list-disc list-inside">
                                {rules.map((rule, index) => (
                                    <li key={index}>{rule}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                onClick={closeModal}
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default RulesModal;