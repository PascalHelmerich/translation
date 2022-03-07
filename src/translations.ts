import Language from './language';
import StorageProvider from './storage/storage_provider';

export default class Translations {
  defaultLanguage: Language;

  storage: StorageProvider<string>;

  public constructor(defaultLanguage: Language, storage: StorageProvider<string>) {
    this.defaultLanguage = defaultLanguage;
    this.storage = storage;
  }

  public set(key: string, value: string): boolean {
    return this.storage.write(key, value);
  }


  public get(key: string): string {
    const value = this.storage.read(key);

    if (value === undefined) {
      return key + " - 404";
    }
    return value;
  }
}
