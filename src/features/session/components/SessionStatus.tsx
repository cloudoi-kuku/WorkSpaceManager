/**
 * SessionStatus component
 * Displays current session information
 */
import { useSession } from '../SessionContext';

export function SessionStatus() {
  const { sessionId } = useSession();
  
  // Take only the first 8 characters of the session ID for display
  const shortSessionId = sessionId.substring(0, 8);
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Session ID:</span>
        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
          {shortSessionId}...
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-green-500"></span>
          Active
        </span>
      </div>
    </div>
  );
}
