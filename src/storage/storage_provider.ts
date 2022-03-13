import { StorageOptions } from "./storage_option";

export default abstract class StorageProvider<T> {
    
    private storageOptions;

    constructor(options: StorageOptions) {
        this.storageOptions = options;
    }

    protected getStorageOptions(): StorageOptions {
        return this.storageOptions;
    }

    abstract start(): boolean;

    abstract read(key: string): T | undefined;

    abstract write(key: string, value: T): boolean;

    abstract clear(): void;

    abstract stop(): void;
}
