import rules from "@/data/rules.json";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

import Poppet from "@/assets/PoppetSVG";
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
        className={`fixed inset-0 z-10 overflow-y-auto text-slate-900 dark:text-slate-200 ${asap.className}`}
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

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-700 shadow-xl rounded-2xl">
            <Dialog.Title as="h3" className="text-xl leading-6 text-center">
              How to play Immaculate Vibes Grid
            </Dialog.Title>
            <Dialog.Description as="div" className="mt-2">
              <ul className="list-disc list-inside">
                {rules.map((rule, index) => (
                  <li className="my-1" key={index}>
                    {rule}
                  </li>
                ))}
              </ul>
            </Dialog.Description>

            <Dialog.Title as="h3" className="text-xl mt-6 leading-6  ">
              <Poppet className="inline h-[1.5em] mr-2" />
              Who are the Plague Poppets?
            </Dialog.Title>

            <Dialog.Description as="div" className="mt-2">
              <p>
                The Plague Poppets are small and mighty friends, coming to
                digital life on the Ethereum blockchain.
              </p>
              <p>
                {" "}
                <a
                  className="underline hover:text-amber-500"
                  href="https://plaguepoppets.io"
                >
                  Visit the orphanarium
                </a>{" "}
                or{" "}
                <a
                  className="underline hover:text-amber-500"
                  href="https://twitter.com/plaguepoppets"
                >
                  follow us on X
                </a>{" "}
                for more information. OR you can just go ahead and{" "}
                <a
                  className="underline hover:text-amber-500"
                  href="https://plaguepoppets.io/mint"
                >
                  mint your own
                </a>
                !
              </p>
            </Dialog.Description>

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
