import rules from "@/data/rules.json";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { Asap_Condensed } from "next/font/google";
import { Button } from "./Button";

const asap = Asap_Condensed({ weight: "200", subsets: ["latin"] });

interface RulesModalProps {
  open: boolean;
  close: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({
  open,
  close: closeModal,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={`fixed inset-0 z-10 overflow-y-auto ${asap.className}`}
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
            <Dialog.Title as="h3" className="text-lg leading-6 text-gray-900">
              Game Rules
            </Dialog.Title>

            <div className="mt-2">
              <ul className="list-disc list-inside">
                {rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-right">
              <Button color="blue" onClick={closeModal}>
                Got it!
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RulesModal;
