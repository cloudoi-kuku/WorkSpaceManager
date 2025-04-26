/**
 * Headless UI Menu component styled to match the application's design system
 */
import { Fragment, ReactNode } from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Menu Root
interface MenuRootProps {
  children: ReactNode;
  className?: string;
}

function MenuRoot({ children, className }: MenuRootProps) {
  return (
    <HeadlessMenu as="div" className={cn("relative inline-block text-left", className)}>
      {children}
    </HeadlessMenu>
  );
}

// Menu Trigger
interface MenuTriggerProps {
  children: ReactNode;
  className?: string;
}

function MenuTrigger({ children, className }: MenuTriggerProps) {
  return (
    <HeadlessMenu.Button 
      className={cn(
        "inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75",
        className
      )}
    >
      {children}
    </HeadlessMenu.Button>
  );
}

// Menu Items Container
interface MenuItemsProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right';
  width?: number;
}

function MenuItems({ 
  children, 
  className, 
  align = 'right',
  width = 200,
}: MenuItemsProps) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <HeadlessMenu.Items 
        className={cn(
          "absolute z-10 mt-2 origin-top-right rounded-md bg-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1",
          align === 'left' ? 'left-0' : 'right-0',
          className
        )}
        style={{ width: `${width}px` }}
      >
        {children}
      </HeadlessMenu.Items>
    </Transition>
  );
}

// Menu Item
interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function MenuItem({ children, onClick, disabled = false, className }: MenuItemProps) {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <button
          type="button"
          className={cn(
            "w-full group flex items-center rounded-md px-2 py-2 text-sm",
            active ? 'bg-primary-foreground text-primary' : 'text-foreground',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            className
          )}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </HeadlessMenu.Item>
  );
}

// Menu Separator
function MenuSeparator() {
  return (
    <div className="my-1 h-px bg-border" />
  );
}

// Menu Label
interface MenuLabelProps {
  children: ReactNode;
  className?: string;
}

function MenuLabel({ children, className }: MenuLabelProps) {
  return (
    <div className={cn("px-2 py-1 text-xs font-medium text-muted-foreground", className)}>
      {children}
    </div>
  );
}

// Menu Export
export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Items: MenuItems,
  Item: MenuItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
};

// Helper to create a simple dropdown menu
interface SimpleMenuProps {
  trigger: ReactNode;
  items: {
    id: string;
    label: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }[];
  className?: string;
  triggerClassName?: string;
  itemsClassName?: string;
  align?: 'left' | 'right';
  width?: number;
}

export function SimpleMenu({ 
  trigger, 
  items, 
  className,
  triggerClassName,
  itemsClassName,
  align,
  width,
}: SimpleMenuProps) {
  return (
    <Menu.Root className={className}>
      <Menu.Trigger className={triggerClassName}>
        {trigger}
        <ChevronDown className="ml-2 -mr-1 h-4 w-4" aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Items className={itemsClassName} align={align} width={width}>
        {items.map((item) => (
          <Menu.Item
            key={item.id}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu.Root>
  );
}
