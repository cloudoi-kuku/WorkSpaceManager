/**
 * Session controls component for session management
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSession, useRecoveryPoint } from '../SessionContext';
import { formatDate } from '../utils';

interface SessionControlsProps {
  minimized?: boolean;
  onCreateRecoveryPoint?: (id: string) => void;
}

export function SessionControls({ 
  minimized = false,
  onCreateRecoveryPoint 
}: SessionControlsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [description, setDescription] = useState('');
  const { createManualRecoveryPoint } = useRecoveryPoint();
  
  const handleCreateRecoveryPoint = async () => {
    if (!description) return;
    
    setIsCreating(true);
    try {
      const id = await createManualRecoveryPoint(description);
      setDescription('');
      onCreateRecoveryPoint?.(id);
    } finally {
      setIsCreating(false);
    }
  };
  
  if (minimized) {
    return (
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setDescription('Manual checkpoint')}
        >
          Create Checkpoint
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-4 border rounded-md bg-background">
      <div className="flex flex-col space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Checkpoint Description
        </label>
        <div className="flex space-x-2">
          <input
            id="description"
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter checkpoint description"
          />
          <Button 
            onClick={handleCreateRecoveryPoint}
            disabled={!description || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}

interface RecoveryPointListProps {
  onRestore?: (id: string) => void;
  filter?: 'all' | 'auto' | 'manual';
  max?: number;
}

export function RecoveryPointList({
  onRestore,
  filter = 'all',
  max = 10
}: RecoveryPointListProps) {
  const { recoveryPoints, restoreFromRecoveryPoint } = useSession();
  const [isRestoring, setIsRestoring] = useState(false);
  
  // Filter and sort the recovery points
  const filteredPoints = recoveryPoints
    .filter(point => {
      if (filter === 'all') return true;
      return point.snapshotType === filter;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, max);
  
  const handleRestore = async (id: string) => {
    if (window.confirm('Are you sure you want to restore this checkpoint? Any unsaved changes will be lost.')) {
      setIsRestoring(true);
      try {
        await restoreFromRecoveryPoint(id);
        onRestore?.(id);
      } finally {
        setIsRestoring(false);
      }
    }
  };
  
  if (filteredPoints.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No recovery points available.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {filteredPoints.map(point => (
        <div key={point.id} className="flex justify-between items-center p-3 border rounded-md">
          <div>
            <div className="font-medium">{point.description}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(point.timestamp)}
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-primary/10 text-xs">
                {point.snapshotType}
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRestore(point.id)}
            disabled={isRestoring}
          >
            {isRestoring ? 'Restoring...' : 'Restore'}
          </Button>
        </div>
      ))}
    </div>
  );
}

interface SessionStatusProps {
  showRecoveryPointCount?: boolean;
}

export function SessionStatus({ showRecoveryPointCount = true }: SessionStatusProps) {
  const { sessionId, recoveryPoints } = useSession();
  const manualPoints = recoveryPoints.filter(p => p.snapshotType === 'manual').length;
  const autoPoints = recoveryPoints.filter(p => p.snapshotType === 'auto').length;
  
  return (
    <div className="text-xs text-muted-foreground">
      <div>Session ID: {sessionId.slice(0, 8)}...</div>
      {showRecoveryPointCount && (
        <div>
          Recovery Points: {recoveryPoints.length} ({manualPoints} manual, {autoPoints} auto)
        </div>
      )}
    </div>
  );
}
