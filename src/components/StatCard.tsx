interface StatCardProps {
  title: string;
  value: number | string;
  icon?: string;
  color?: string;
}

export function StatCard({ title, value, icon, color = 'bg-primary-500' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center">
        {icon && (
          <div className={`p-3 rounded-full ${color} text-white mr-4`}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
} 