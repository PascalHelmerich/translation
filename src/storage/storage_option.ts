
export class StorageOptions {
    private production: boolean;
    private name: string;
    private table: string;
    
    public get getName(): string {
        return this.name;
    }

    public get getTableName(): string {
        return this.table;
    }

    public get isProduction(): boolean {
        return this.production;
    }

    public constructor(name: string, table: string, isProduction = false) {
        this.name = name;
        this.table = table;
        this.production = isProduction;
    }

}