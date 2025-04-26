/**
 * Headless UI Disclosure component styled to match the application's design system
 */
import { ReactNode } from 'react';
import { Disclosure as HeadlessDisclosure } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Disclosure Root
interface DisclosureRootProps {
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function DisclosureRoot({ children, defaultOpen, className }: DisclosureRootProps) {
  return (
    <HeadlessDisclosure as="div" className={cn("w-full", className)} defaultOpen={defaultOpen}>
      {children}
    </HeadlessDisclosure>
  );
}

// Disclosure Button
interface DisclosureButtonProps {
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
}

function DisclosureButton({ children, className, showIcon = true, iconClassName }: DisclosureButtonProps) {
  return (
    <HeadlessDisclosure.Button
      className={cn(
        "flex w-full justify-between rounded-md p-3 text-left focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75 items-center",
        className
      )}
    >
      {({ open }) => (
        <>
          {children}
          {showIcon && (
            open ? 
              <ChevronUp className={cn("h-4 w-4 text-muted-foreground", iconClassName)} /> : 
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />
          )}
        </>
      )}
    </HeadlessDisclosure.Button>
  );
}

// Disclosure Panel
interface DisclosurePanelProps {
  children: ReactNode;
  className?: string;
}

function DisclosurePanel({ children, className }: DisclosurePanelProps) {
  return (
    <HeadlessDisclosure.Panel
      className={cn("p-3 bg-muted/30", className)}
    >
      {children}
    </HeadlessDisclosure.Panel>
  );
}

// Export Disclosure components
export const Disclosure = {
  Root: DisclosureRoot,
  Button: DisclosureButton,
  Panel: DisclosurePanel,
};

// Simple Disclosure Helper
interface SimpleDisclosureProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  showIcon?: boolean;
  iconClassName?: string;
}

export function SimpleDisclosure({
  title,
  children,
  defaultOpen,
  className,
  buttonClassName,
  panelClassName,
  showIcon = true,
  iconClassName,
}: SimpleDisclosureProps) {
  return (
    <Disclosure.Root className={className} defaultOpen={defaultOpen}>
      <Disclosure.Button 
        className={buttonClassName} 
        showIcon={showIcon}
        iconClassName={iconClassName}
      >
        {title}
      </Disclosure.Button>
      <Disclosure.Panel className={panelClassName}>
        {children}
      </Disclosure.Panel>
    </Disclosure.Root>
  );
}
