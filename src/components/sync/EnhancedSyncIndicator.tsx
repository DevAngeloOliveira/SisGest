import { useSyncStatus } from '@/hooks/useSyncStatus';

export function EnhancedSyncIndicator() {
  const { isOnline } = useSyncStatus();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`h-3 w-3 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
        <span className="text-xs text-gray-500">
          {isOnline ? 'Conectado' : 'Sem conexão'}
        </span>
      </div>
    </div>
  );
} 