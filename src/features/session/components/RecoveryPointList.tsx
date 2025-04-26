/**
 * RecoveryPointList component
 * Displays a list of recovery points with restore options
 */
import { useState } from 'react';
import { useSession } from '../SessionContext';
import { RecoveryPoint } from '../types';
import { CheckCircle2, Clock, RotateCcw } from 'lucide-react';

interface RecoveryPointListProps {
  max?: number;
}

export function RecoveryPointList({ max = 5 }: RecoveryPointListProps) {
  const { recoveryPoints, restoreFromRecoveryPoint } = useSession();
  
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sort recovery points by timestamp (newest first) and limit to max
  const sortedPoints = [...recoveryPoints]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, max);
  
  // Restore from a recovery point
  const handleRestore = async (point: RecoveryPoint) => {
    if (confirm(`Are you sure you want to restore "${point.description}"? Your current state will be lost.`)) {
      setIsRestoring(true);
      setError(null);
      
      try {
        await restoreFromRecoveryPoint(point.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to restore from recovery point');
      } finally {
        setIsRestoring(false);
      }
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (sortedPoints.length === 0) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        No checkpoints available.
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {sortedPoints.map((point) => (
          <li 
            key={point.id}
            className="relative rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {point.description}
                </p>
                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center">
                    {point.snapshotType === 'manual' ? (
                      <CheckCircle2 className="mr-1 h-3 w-3 text-primary" />
                    ) : (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    <span>
                      {formatTimestamp(point.timestamp)} 
                      ({point.snapshotType === 'manual' ? 'Manual' : 'Auto'})
                    </span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRestore(point)}
                disabled={isRestoring}
                className="ml-2 rounded-md p-1 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="sr-only">Restore</span>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
      
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
