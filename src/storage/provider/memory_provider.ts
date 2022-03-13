import { StorageOptions } from "../storage_option";
import StorageProvider from "../storage_provider";

export class MemoryProvider<T> extends StorageProvider<T> {

    private memory = new Map<string, T>();
    private dataSource: StorageProvider<T>;

    constructor(dataSource: StorageProvider<T>, options: StorageOptions) {
        super(options);
        this.dataSource = dataSource;
    }

    start(): boolean {
        return this.dataSource.start();
    }

    read(key: string): T | undefined {
        if (this.memory.has(key)) {
            return this.memory.get(key);
        }

        const value = this.dataSource.read(key);
        if (value !== undefined) {
            this.memory.set(key, value);
        }
        return value;
    }

    write(key: string, value: T): boolean {
        this.memory.set(key, value);
        return this.dataSource.write(key, value);
    }

    clear(): void {
        this.memory.clear();
        this.dataSource.clear();
    }

    stop(): void {
        this.dataSource.stop();
    }

}