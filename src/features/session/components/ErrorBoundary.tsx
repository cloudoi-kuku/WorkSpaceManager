/**
 * Error boundary component to catch and handle errors
 */
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useRecoveryPoint } from '../SessionContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error boundary component
 * Catches and handles errors in its children
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state to trigger fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call onError handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Try to create a recovery point
    try {
      // We can't use hooks directly in class components, so using static method
      ErrorBoundaryRecovery.createRecoveryPoint('Error recovery point', {
        error: error.message,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to create recovery point:', e);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise render default fallback
      return this.props.fallback || (
        <div className="p-6 bg-destructive/10 border border-destructive rounded-md">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">
            An error occurred while rendering this component. A recovery point has been created.
          </p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            <Button 
              variant="outline"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </Button>
          </div>
          
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
            <div className="mt-2 p-2 bg-muted/50 rounded text-sm font-mono whitespace-pre-wrap overflow-auto max-h-[300px]">
              {this.state.error && this.state.error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Static helper for error boundary recovery
 * (allows class components to work with our hooks)
 */
export class ErrorBoundaryRecovery {
  private static recoveryPointCallback: ((description: string, context?: any) => Promise<string>) | null = null;
  
  static setRecoveryPointCallback(
    callback: (description: string, context?: any) => Promise<string>
  ): void {
    ErrorBoundaryRecovery.recoveryPointCallback = callback;
  }
  
  static createRecoveryPoint(description: string, context?: any): Promise<string> {
    if (ErrorBoundaryRecovery.recoveryPointCallback) {
      return ErrorBoundaryRecovery.recoveryPointCallback(description, context);
    }
    return Promise.resolve('');
  }
}

/**
 * Wrapper component to initialize ErrorBoundaryRecovery with hooks
 */
export function ErrorBoundaryProvider({ children }: { children: ReactNode }) {
  const { createManualRecoveryPoint } = useRecoveryPoint();
  
  // Set the recovery point callback
  React.useEffect(() => {
    ErrorBoundaryRecovery.setRecoveryPointCallback(createManualRecoveryPoint);
    
    return () => {
      ErrorBoundaryRecovery.setRecoveryPointCallback(null);
    };
  }, [createManualRecoveryPoint]);
  
  return <>{children}</>;
}
