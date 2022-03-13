
export class StorageOptions {
    private production: boolean;


    public get isProduction(): boolean {
        return this.production;
    }

    public constructor(isProduction = false) {
        this.production = isProduction;
    }

}