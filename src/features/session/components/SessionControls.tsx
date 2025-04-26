/**
 * SessionControls component
 * Allows users to create manual recovery points
 */
import { useState } from 'react';
import { useRecoveryPoint } from '../SessionContext';

export function SessionControls() {
  const { createManualRecoveryPoint } = useRecoveryPoint();
  
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Create a recovery point
  const handleCreateRecoveryPoint = async () => {
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    
    setIsCreating(true);
    setError(null);
    setSuccess(null);
    
    try {
      await createManualRecoveryPoint(description);
      setDescription('');
      setSuccess('Recovery point created successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recovery point');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <div>
        <label 
          htmlFor="recovery-point-description" 
          className="sr-only"
        >
          Checkpoint Description
        </label>
        <input
          type="text"
          id="recovery-point-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter checkpoint description"
          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleCreateRecoveryPoint}
          disabled={isCreating}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Checkpoint'}
        </button>
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-2 text-sm text-green-700 dark:text-green-300">
          {success}
        </div>
      )}
    </div>
  );
}
