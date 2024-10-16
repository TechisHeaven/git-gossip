import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { CgClose } from "react-icons/cg";

interface DialogInterface {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  className?: React.ComponentProps<"button">["className"];
  heading?: string;
}

export default function MainDialog({
  trigger,
  children,
  className,
  heading,
}: DialogInterface) {
  let [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
    window.document.body.style.overflowY = "hidden";
  }

  function close() {
    setIsOpen(false);
    window.document.body.style.overflowY = "auto";
  }

  return (
    <>
      <Button className={`${className}`} onClick={open}>
        {trigger}
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/40">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <div className="inline-flex items-center justify-between w-full pb-2">
                <DialogTitle
                  as="h3"
                  className="text-base/7 font-medium text-white"
                >
                  {heading}
                </DialogTitle>
                <CgClose className="text-lg cursor-pointer" onClick={close} />
              </div>
              {children}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
