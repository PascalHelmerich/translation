import Language from "./language";
import { SqliteProvider } from "./storage/provider/sqlite_provider";
import { StorageOptions } from "./storage/storage_option";
import StorageProvider from "./storage/storage_provider";
import Translations from "./translations";

test("clear", () => {
    const storageProvider = new SqliteProvider<string>(new StorageOptions("test", "translations", false));
    storageProvider.start();
    storageProvider.clear();
    storageProvider.stop();
});

test("read 404", () => {
    const storageProvider = new SqliteProvider<string>(new StorageOptions("test", "translations", false));
    storageProvider.start();
    const translations = new Translations(Language.DE, storageProvider);
    expect(translations.get("test.test")).toBe("test.test - 404");
    storageProvider.stop();
});

test("write", () => {
    const storageProvider = new SqliteProvider<string>(new StorageOptions("test", "translations", false));
    storageProvider.start();
    const translations = new Translations(Language.DE, storageProvider);
    expect(translations.set("test.test", "TEST")).toBe(true);
    storageProvider.stop();
});

test("read write", () => {
    const storageProvider = new SqliteProvider<string>(new StorageOptions("test", "translations", false));
    storageProvider.start();
    const translations = new Translations(Language.DE, storageProvider);
    expect(translations.get("test.test")).toBe("TEST");
    storageProvider.stop();
});