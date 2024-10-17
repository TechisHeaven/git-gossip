import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";

interface DialogInterface {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  className?: React.ComponentProps<"button">["className"];
  heading?: string;
  isHoldButton?: boolean;
  forceDialogTrigger?: boolean;
  onClose?: () => void;
}

export default function MainDialog({
  trigger,
  children,
  className,
  heading,
  isHoldButton,
  forceDialogTrigger,
  onClose,
}: DialogInterface) {
  let [isOpen, setIsOpen] = useState(forceDialogTrigger || false);

  function open() {
    setIsOpen(true);
    window.document.body.style.overflowY = "hidden";
  }

  function close() {
    setIsOpen(false);
    if (onClose) onClose();
    window.document.body.style.overflowY = "auto";
  }

  useEffect(() => {
    if (forceDialogTrigger) {
      open();
    } else {
      close();
    }
  }, [forceDialogTrigger]);

  let holdTimeout: NodeJS.Timeout | null = null; // Timer for hold action

  function handleMouseDown(event: React.MouseEvent) {
    if (isHoldButton) {
      event.preventDefault();
      // holdTimeout = setTimeout(() => open(), 400);
    }
  }

  function handleMouseUp() {
    if (holdTimeout) {
      clearTimeout(holdTimeout); // Clear the timer if mouse is released
      holdTimeout = null;
    }
  }

  return (
    <>
      <Button
        className={`${className} focus-visible:outline-none`}
        onClick={!isHoldButton ? open : undefined} // Only allow click if not a hold button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
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
