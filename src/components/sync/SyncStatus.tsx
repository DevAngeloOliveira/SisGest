import { useSyncStatus } from '@/hooks/useSyncStatus';

export function SyncStatus() {
  const { isOnline } = useSyncStatus();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`h-2 w-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="text-sm text-gray-500">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
} 