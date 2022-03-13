import { SqlProvider, SqlStorageOptions } from "./sql_provider";
import BetterSqlite3, { Database } from "better-sqlite3";


export default class SqliteProvider<T> extends SqlProvider<T> {

    private database: Database;

    public constructor(options: SqlStorageOptions) {
        super(options);

        const dbOptions = { readonly: this.getStorageOptions().isProduction }
        const dbName = this.getStorageOptions().database + ".db";
        this.database = new BetterSqlite3(dbName, dbOptions)
    }

    protected runCreateTableQuery(query: string): boolean {
        this.database.prepare(query).run();
        return true;
    }

    protected runDropTableQuery(query: string): boolean {
        this.database.prepare(query).run();
        return true;
    }

    protected runSelectByKeyQuery(query: string, key: string) {
        const statement = this.database.prepare(query);
        return statement.get({ key: key });
    }

    protected runWriteByKeyQuery(query: string, key: string, value: T): boolean {
        const insert = this.database.prepare(query);
        const result = insert.run({ key: key, value: value });

        return result.changes == 1;
    }

    stop(): void {
        this.database.close();
    }

}