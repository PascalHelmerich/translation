import StorageProvider from "../storage_provider";
import BetterSqlite3, { Database } from "better-sqlite3";
import { StorageOptions } from "../storage_option";

export class SqliteProvider<T> extends StorageProvider<T> {

    private database: Database;

    public constructor(options: StorageOptions) {
        super(options);

        const dbOptions = { readonly: this.getStorageOptions().isProduction }
        const dbName = this.getStorageOptions().getName + ".db";
        this.database = new BetterSqlite3(dbName, dbOptions)
    }

    start(): boolean {
        const insert = this.database.prepare("CREATE TABLE IF NOT EXISTS " + this.getStorageOptions().getTableName + " (key TEXT, value TEXT, PRIMARY KEY(key))");
        insert.run();
        return true;
    }

    read(key: string): T | undefined {
        const statement = this.database.prepare("SELECT value FROM " + this.getStorageOptions().getTableName + " WHERE key = @key");
        const result = statement.get({ key: key });
        const value = result === undefined ? undefined : result.value as T;
        return value;
    }

    write(key: string, value: T): boolean {
        const insert = this.database.prepare("INSERT INTO " + this.getStorageOptions().getTableName + " (key, value) VALUES (@key, @value)");
        const result = insert.run({ key: key, value: value });

        return result.changes == 1;
    }

    stop(): void {
        this.database.close();
    }

    clear(): void {
        this.database.prepare("DROP TABLE IF EXISTS " + this.getStorageOptions().getTableName).run();
    }

}