import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import React from "react";

interface CustomPopover {
  trigger: React.ReactNode;
  children: React.ReactNode;
}
const CustomPopover = ({ trigger, children }: CustomPopover) => {
  return (
    <Popover>
      <PopoverButton className={"w-full text-start"}>{trigger}</PopoverButton>
      <PopoverPanel
        transition
        anchor="bottom"
        className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:var(--spacing-5)] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
      >
        {children}
      </PopoverPanel>
    </Popover>
  );
};

export default CustomPopover;
