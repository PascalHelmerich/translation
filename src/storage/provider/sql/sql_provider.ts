import { StorageOptions } from "../../storage_option";
import StorageProvider from "../../storage_provider";

export abstract class SqlProvider<T> extends StorageProvider<T> {

    public constructor(options: SqlStorageOptions) {
        super(options);
    }

    getStorageOptions(): SqlStorageOptions {
        return super.getStorageOptions() as SqlStorageOptions;
    }

    protected abstract runCreateTableQuery(query: string): boolean;
    protected abstract runDropTableQuery(query: string): boolean;
    protected abstract runSelectByKeyQuery(query: string, key: string): any;
    protected abstract runWriteByKeyQuery(query: string, key: string, value: T): boolean;

    start(): boolean {
        return this.runCreateTableQuery("CREATE TABLE IF NOT EXISTS " + this.getStorageOptions().table + " (key TEXT, value TEXT, PRIMARY KEY(key))");
    }

    read(key: string): T | undefined {
        const result = this.runSelectByKeyQuery("SELECT value FROM " + this.getStorageOptions().table + " WHERE key = @key", key);
        const value = result === undefined ? undefined : result.value as T;
        return value;
    }

    write(key: string, value: T): boolean {
        return this.runWriteByKeyQuery("INSERT INTO " + this.getStorageOptions().table + " (key, value) VALUES (@key, @value)", key, value);
    }

    clear(): void {
        this.runDropTableQuery("DROP TABLE IF EXISTS " + this.getStorageOptions().table);
    }

}

export class SqlStorageOptions extends StorageOptions {

    private _database: string;
    public get database(): string {
        return this._database;
    }

    private _table: string;
    public get table(): string {
        return this._table;
    }

    constructor(database: string, table: string, production = false) {
        super(production);
        this._database = database;
        this._table = table;
    }

}