import { exec } from 'child_process';
import { promisify } from 'util';

export const execAsync = promisify(exec);

export class CommandCache {
    private static instance: CommandCache;
    private cache: Map<string, { value: any; timestamp: number }>;
    private static readonly defaultTimeout = 5 * 60 * 1000; // 5分钟缓存

    private constructor() {
        this.cache = new Map();
    }

    static getInstance(): CommandCache {
        if (!CommandCache.instance) {
            CommandCache.instance = new CommandCache();
        }
        return CommandCache.instance;
    }

    public get(key: string): any {
        const item = this.cache.get(key);
        if (!item) {
            return null;
        }

        if (Date.now() - item.timestamp > CommandCache.defaultTimeout) {
            this.cache.delete(key);
            return null;
        }

        return item.value;
    }

    set(key: string, value: any): void {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    clear(): void {
        this.cache.clear();
    }
}
