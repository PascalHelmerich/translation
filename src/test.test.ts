import Language from "./language";
import { MemoryProvider } from "./storage/provider/memory_provider";
import SqliteProvider from "./storage/provider/sql/sqlite_provider";
import { SqlStorageOptions } from "./storage/provider/sql/sql_provider";
import { StorageOptions } from "./storage/storage_option";
import StorageProvider from "./storage/storage_provider";
import Translations from "./translations";

function storage<T>(): StorageProvider<T> {
    return new MemoryProvider<T>(
        new SqliteProvider<T>(new SqlStorageOptions("test", "translations", false)),
        new StorageOptions(false)
    )
}

test("clear", () => {
    const storageProvider = storage<string>();
    storageProvider.start();
    storageProvider.clear();
    storageProvider.stop();
});

test("read 404", () => {
    const storageProvider = storage<string>();
    storageProvider.start();
    const translations = new Translations(Language.DE, storageProvider);
    expect(translations.get("test.test")).toBe("test.test - 404");
    storageProvider.stop();
});

test("write", () => {
    const storageProvider = storage<string>();
    storageProvider.start();
    const translations = new Translations(Language.DE, storageProvider);
    expect(translations.set("test.test", "TEST")).toBe(true);
    storageProvider.stop();
});

test("read write", () => {
    const storageProvider = storage<string>();
    storageProvider.start();
    const translations = new Translations(Language.DE, storageProvider);
    expect(translations.get("test.test")).toBe("TEST");
    storageProvider.stop();
});