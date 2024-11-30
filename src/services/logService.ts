interface LogEntry {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: string;
    data?: unknown;
    error?: Error;
    userId?: string;
    action?: string;
    component?: string;
}

class LogService {
    private readonly MAX_LOGS = 1000;
    private logs: LogEntry[] = [];
    private readonly STORAGE_KEY = 'app_logs';

    constructor() {
        this.loadLogs();
        window.addEventListener('beforeunload', () => this.saveLogs());
    }

    private loadLogs(): void {
        try {
            const storedLogs = localStorage.getItem(this.STORAGE_KEY);
            if (storedLogs) {
                this.logs = JSON.parse(storedLogs);
            }
        } catch (error) {
            console.error('Error loading logs:', error);
        }
    }

    private saveLogs(): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs));
        } catch (error) {
            console.error('Error saving logs:', error);
        }
    }

    private addLog(entry: LogEntry): void {
        this.logs.unshift(entry);
        if (this.logs.length > this.MAX_LOGS) {
            this.logs = this.logs.slice(0, this.MAX_LOGS);
        }

        // Em desenvolvimento, também loga no console
        if (process.env.NODE_ENV === 'development') {
            const { level, message, data, error } = entry;
            console[level](message, { ...entry, data, error });
        }
    }

    info(message: string, data?: unknown, options?: { action?: string; component?: string }): void {
        this.addLog({
            level: 'info',
            message,
            timestamp: new Date().toISOString(),
            data,
            ...options
        });
    }

    warn(message: string, data?: unknown, options?: { action?: string; component?: string }): void {
        this.addLog({
            level: 'warn',
            message,
            timestamp: new Date().toISOString(),
            data,
            ...options
        });
    }

    error(message: string, error?: Error, data?: unknown, options?: { action?: string; component?: string }): void {
        this.addLog({
            level: 'error',
            message,
            timestamp: new Date().toISOString(),
            error,
            data,
            ...options
        });
    }

    debug(message: string, data?: unknown, options?: { action?: string; component?: string }): void {
        if (process.env.NODE_ENV === 'development') {
            this.addLog({
                level: 'debug',
                message,
                timestamp: new Date().toISOString(),
                data,
                ...options
            });
        }
    }

    getLogs(
        filter?: {
            level?: LogEntry['level'];
            startDate?: Date;
            endDate?: Date;
            search?: string;
        }
    ): LogEntry[] {
        let filteredLogs = [...this.logs];

        if (filter) {
            const { level, startDate, endDate, search } = filter;

            if (level) {
                filteredLogs = filteredLogs.filter(log => log.level === level);
            }

            if (startDate) {
                filteredLogs = filteredLogs.filter(
                    log => new Date(log.timestamp) >= startDate
                );
            }

            if (endDate) {
                filteredLogs = filteredLogs.filter(
                    log => new Date(log.timestamp) <= endDate
                );
            }

            if (search) {
                const searchLower = search.toLowerCase();
                filteredLogs = filteredLogs.filter(
                    log =>
                        log.message.toLowerCase().includes(searchLower) ||
                        log.action?.toLowerCase().includes(searchLower) ||
                        log.component?.toLowerCase().includes(searchLower)
                );
            }
        }

        return filteredLogs;
    }

    clearLogs(): void {
        this.logs = [];
        localStorage.removeItem(this.STORAGE_KEY);
    }

    // Método para exportar logs
    exportLogs(format: 'json' | 'csv' = 'json'): string {
        if (format === 'csv') {
            const headers = ['timestamp', 'level', 'message', 'action', 'component', 'data', 'error'];
            const csvRows = [headers];

            this.logs.forEach(log => {
                csvRows.push([
                    log.timestamp,
                    log.level,
                    log.message,
                    log.action || '',
                    log.component || '',
                    log.data ? JSON.stringify(log.data) : '',
                    log.error ? JSON.stringify(log.error) : ''
                ]);
            });

            return csvRows.map(row => row.join(',')).join('\n');
        }

        return JSON.stringify(this.logs, null, 2);
    }
}

export const logService = new LogService(); 