/**
 * Headless UI Dialog component styled to match the application's design system
 */
import { Fragment, ReactNode } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dialog Root
interface DialogRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
}

function DialogRoot({ isOpen, onClose, children, initialFocus }: DialogRootProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog 
        as="div" 
        className="relative z-10" 
        onClose={onClose}
        initialFocus={initialFocus}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {children}
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}

// Dialog Panel
interface DialogPanelProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

function DialogPanel({ children, className, size = 'md' }: DialogPanelProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <HeadlessDialog.Panel 
        className={cn(
          "w-full transform overflow-hidden rounded-lg bg-background p-6 text-left align-middle shadow-xl transition-all",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </HeadlessDialog.Panel>
    </Transition.Child>
  );
}

// Dialog Title
interface DialogTitleProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function DialogTitle({ children, className, showCloseButton = false, onClose }: DialogTitleProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <HeadlessDialog.Title
        as="h3"
        className="text-lg font-medium leading-6"
      >
        {children}
      </HeadlessDialog.Title>
      
      {showCloseButton && onClose && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Dialog Description
interface DialogDescriptionProps {
  children: ReactNode;
  className?: string;
}

function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <HeadlessDialog.Description
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </HeadlessDialog.Description>
  );
}

// Dialog Content
interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div className={cn("mt-2", className)}>
      {children}
    </div>
  );
}

// Dialog Footer
interface DialogFooterProps {
  children: ReactNode;
  className?: string;
}

function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <div className={cn("mt-6 flex justify-end gap-2", className)}>
      {children}
    </div>
  );
}

// Export Dialog components
export const Dialog = {
  Root: DialogRoot,
  Panel: DialogPanel,
  Title: DialogTitle,
  Description: DialogDescription,
  Content: DialogContent,
  Footer: DialogFooter,
};

// Simple Dialog Helper
interface SimpleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
}

export function SimpleDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  showCloseButton = true,
}: SimpleDialogProps) {
  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose}>
      <Dialog.Panel size={size} className={className}>
        <Dialog.Title showCloseButton={showCloseButton} onClose={onClose}>
          {title}
        </Dialog.Title>
        
        {description && (
          <Dialog.Description>{description}</Dialog.Description>
        )}
        
        <Dialog.Content>
          {children}
        </Dialog.Content>
        
        {footer && (
          <Dialog.Footer>
            {footer}
          </Dialog.Footer>
        )}
      </Dialog.Panel>
    </Dialog.Root>
  );
}
