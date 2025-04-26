/**
 * Headless UI Combobox component styled to match the application's design system
 */
import { Fragment, useState, ReactNode } from 'react';
import { Combobox as HeadlessCombobox, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Search } from 'lucide-react';

// Generic type for item
type Item = {
  id: string;
  [key: string]: any;
};

// Props for Combobox component
interface ComboboxProps<T extends Item> {
  items: T[];
  value: T | null;
  onChange: (value: T) => void;
  displayValue: (item: T) => string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  optionsClassName?: string;
  disabled?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  width?: number;
  emptyMessage?: string;
}

// Combobox component
export function Combobox<T extends Item>({
  items,
  value,
  onChange,
  displayValue,
  placeholder = 'Select an option',
  className,
  buttonClassName,
  optionsClassName,
  disabled = false,
  showSearch = false,
  searchPlaceholder = 'Search...',
  width = 200,
  emptyMessage = 'No items found.',
}: ComboboxProps<T>) {
  const [query, setQuery] = useState('');

  // Filter items based on query
  const filteredItems = query === ''
    ? items
    : items.filter((item) => {
        const itemDisplay = displayValue(item).toLowerCase();
        return itemDisplay.includes(query.toLowerCase());
      });

  return (
    <div className={cn("relative w-full", className)} style={{ maxWidth: `${width}px` }}>
      <HeadlessCombobox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative w-full">
          <HeadlessCombobox.Button
            className={cn(
              "relative w-full cursor-default rounded-md bg-background py-2 pl-3 pr-10 text-left border shadow-sm focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 sm:text-sm",
              disabled && "opacity-50 cursor-not-allowed",
              buttonClassName
            )}
          >
            <span className="block truncate">
              {value ? displayValue(value) : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </span>
          </HeadlessCombobox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <HeadlessCombobox.Options
              className={cn(
                "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                optionsClassName
              )}
            >
              {showSearch && (
                <div className="relative px-2 py-2 border-b">
                  <Search className="h-4 w-4 text-muted-foreground absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    className="pl-8 pr-4 py-1 w-full bg-transparent border-0 focus:ring-0 focus:outline-none text-sm"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                  />
                </div>
              )}

              {filteredItems.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <HeadlessCombobox.Option
                    key={item.id}
                    value={item}
                    className={({ active }) =>
                      cn(
                        "relative cursor-default select-none py-2 pl-10 pr-4",
                        active ? "bg-primary-foreground text-primary" : "text-foreground"
                      )
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cn(
                            "block truncate",
                            selected ? "font-medium" : "font-normal"
                          )}
                        >
                          {displayValue(item)}
                        </span>
                        {selected ? (
                          <span
                            className={cn(
                              "absolute inset-y-0 left-0 flex items-center pl-3",
                              active ? "text-primary" : "text-primary"
                            )}
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </Transition>
        </div>
      </HeadlessCombobox>
    </div>
  );
}

// Props for SimpleCombobox component
interface SimpleComboboxProps {
  items: Array<{ id: string; name: string; [key: string]: any }>;
  value: { id: string; name: string } | null;
  onChange: (value: { id: string; name: string }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showSearch?: boolean;
  width?: number;
}

// Simple Combobox wrapper for common use cases
export function SimpleCombobox({
  items,
  value,
  onChange,
  placeholder,
  className,
  disabled,
  showSearch,
  width,
}: SimpleComboboxProps) {
  return (
    <Combobox
      items={items}
      value={value}
      onChange={onChange}
      displayValue={(item) => item.name}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      showSearch={showSearch}
      width={width}
    />
  );
}
