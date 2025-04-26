/**
 * SyncIndicator component
 * Displays the synchronization status between windows
 */
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSession } from '@/features/session';

interface SyncIndicatorProps {
  className?: string;
}

export function SyncIndicator({ className }: SyncIndicatorProps) {
  const { sessionId } = useSession();
  const [syncState, setSyncState] = useState<'syncing' | 'synced' | 'error'>('synced');
  const [lastSynced, setLastSynced] = useState<Date | null>(new Date());
  const [isVisible, setIsVisible] = useState(false);
  
  // Setup broadcast channel for cross-window sync
  useEffect(() => {
    try {
      const syncChannel = new BroadcastChannel(`workspace-sync-${sessionId}`);
      
      // Listen for sync events
      syncChannel.onmessage = (event) => {
        const { type, timestamp } = event.data;
        
        if (type === 'sync-start') {
          setSyncState('syncing');
          setIsVisible(true);
        } else if (type === 'sync-complete') {
          setSyncState('synced');
          setLastSynced(new Date(timestamp));
          
          // Hide after a delay
          setTimeout(() => {
            setIsVisible(false);
          }, 3000);
        } else if (type === 'sync-error') {
          setSyncState('error');
          setIsVisible(true);
        }
      };
      
      // Clean up on unmount
      return () => {
        syncChannel.close();
      };
    } catch (error) {
      console.error('Error setting up sync channel:', error);
      return undefined;
    }
  }, [sessionId]);
  
  // Format time for display
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // If not visible, don't render
  if (!isVisible && syncState !== 'error') {
    return null;
  }
  
  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 flex items-center gap-2 py-2 px-4 rounded-md shadow-lg text-sm transition-opacity duration-300 z-50",
        syncState === 'syncing' && "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
        syncState === 'synced' && "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300",
        syncState === 'error' && "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300",
        className
      )}
    >
      {syncState === 'syncing' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Syncing workspaces...</span>
        </>
      )}
      
      {syncState === 'synced' && (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>Workspaces synced at {formatTime(lastSynced)}</span>
        </>
      )}
      
      {syncState === 'error' && (
        <>
          <AlertTriangle className="h-4 w-4" />
          <span>Sync error. Refresh to retry.</span>
        </>
      )}
    </div>
  );
}
