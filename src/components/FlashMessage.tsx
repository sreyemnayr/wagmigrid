"use client";
import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

import { asapBold as asap } from "@/util/fonts";

interface FlashMessageProps {
  show: boolean;
}

export const FlashMessage = ({ show: initialShow }: FlashMessageProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(initialShow);
  }, [initialShow]);

  // Automatically hide the component after 1 second
  useEffect(() => {
    if (show) {
      const timeoutId = setTimeout(() => {
        setShow(false);
      }, 200); // Adjust this value to control the delay

      // Clean up the timeout when the component is unmounted
      return () => clearTimeout(timeoutId);
    }
  }, [show]);

  return (
    <Transition
      show={show}
      enter="transition-all ease-in duration-100"
      enterFrom="opacity-0 scale-25"
      enterTo="opacity-100 scale-100"
      leave="transition-all ease-out duration-500"
      leaveFrom="opacity-100 scale-150"
      leaveTo="opacity-0 scale-[20] rotate-45 -translate-y-96"
    >
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div
          className={`text-4xl font-bold bg-gradient-to-r from-red-400 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text ${asap.className}`}
        >
          WAGMI!
        </div>
      </div>
    </Transition>
  );
};

export default FlashMessage;
