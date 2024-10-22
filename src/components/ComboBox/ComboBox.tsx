import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import clsx from "clsx";
import { BiCheck, BiChevronDown } from "react-icons/bi";

interface ComboBoxProps<T> {
  items: T[];
  selectedItem: T;
  onItemChange: (item: T | null) => void;
  displayValue: (item: T) => string;
  inputId?: string;
  CustomInput: any;
  callback: () => void; // New prop for sending the message
  messageRef: React.RefObject<HTMLInputElement>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function MessageCombobox<T>({
  items,
  selectedItem,
  onItemChange,
  displayValue,
  CustomInput,
  query,
  setQuery,
}: ComboBoxProps<T>) {
  const filteredItems =
    query === ""
      ? items
      : items.filter((item) =>
          displayValue(item).toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div>
      <Combobox
        value={selectedItem}
        onChange={(value) => onItemChange(value)}
        onClose={() => setQuery("")}
        __demoMode={false}
      >
        <div className="relative">
          <CustomInput
            value={query}
            onChange={(value: string) => setQuery(value)}
            callback={() => {
              if (filteredItems.length > 0) {
                onItemChange(filteredItems[0]);
              }
            }}
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <BiChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor="bottom"
          transition
          className={clsx(
            "w-[var(--input-width)] rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
            "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
          )}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <ComboboxOption
                key={index} // Using index as key since item.id does not exist
                value={item}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
              >
                <BiCheck className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div className="text-sm/6 text-white">{displayValue(item)}</div>
              </ComboboxOption>
            ))
          ) : (
            <div className="text-sm/6 text-white text-center py-2">
              No items found
            </div>
          )}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
