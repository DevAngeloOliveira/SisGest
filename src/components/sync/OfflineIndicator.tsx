import { useSyncStatus } from '@/hooks/useSyncStatus';

export function OfflineIndicator() {
  const { isOnline } = useSyncStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
      <p className="text-sm">Você está offline</p>
    </div>
  );
} 