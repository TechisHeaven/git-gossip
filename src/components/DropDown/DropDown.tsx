import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function DropDown({
  children,
  target,
  attr_key,
}: {
  children: React.ReactNode;
  target: React.ReactNode;
  attr_key?: string;
}) {
  return (
    <div className=" text-right">
      <Menu __demoMode={false}>
        <MenuButton>{target}</MenuButton>

        <MenuItems
          transition
          anchor="bottom start"
          className={`dropdown-${attr_key} w-fit z-10 origin-top-right rounded-xl border border-white/5 bg-mainBackgroundColor p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0`}
        >
          {Array.isArray(children) ? (
            children.map((item, index) => (
              <MenuItem key={index}>{item}</MenuItem>
            ))
          ) : (
            <MenuItem>{children}</MenuItem>
          )}
        </MenuItems>
      </Menu>
    </div>
  );
}
