import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function DropDown({
  children,
  target,
}: {
  children: React.ReactNode;
  target: React.ReactNode;
}) {
  return (
    <div className=" top-24 w-52 text-right">
      <Menu __demoMode={false}>
        <MenuButton>{target}</MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
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
