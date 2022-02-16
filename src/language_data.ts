import Language from "./language";
import { TranslationFile } from "./translation_file";

export default class LanguageData {

    static readonly transLationChunkSize = 1024;

    language: Language;
    currentIndex: number;
    cachedTranslationCount: number;
    areAllTranslationsCached: boolean;
    cachedTranslations: Map<string, string>;
    hasChanged: boolean;

    constructor(language: Language) {
        this.language = language;
        this.currentIndex = 0;
        this.cachedTranslationCount = 0;
        this.areAllTranslationsCached = false;
        this.cachedTranslations = new Map<string, string>();
        this.hasChanged = false;
    }


    public set(key: string, value: string) {
        if (key == "") {
            throw new Error("Key cannot be empty.");
        }
        
        if (value == "") {
            throw new Error("Value cannot be empty.");
        }

        if (!this.areAllTranslationsCached) {
            this.get(""); //load all translations
        }

        ++this.cachedTranslationCount;
        this.cachedTranslations.set(key, value);
        if (!this.hasChanged) {
            this.hasChanged = true;            
        }
    }

    public writeToFiles() {
        if (!this.hasChanged) {
            return;
        }
        
        let savedTranslationCount = 0;
        this.currentIndex = 0;

        const chunkToSave = new Map<string, string>();
        this.cachedTranslations.forEach((key, value) => {
            chunkToSave.set(key, value);

            if (++savedTranslationCount == LanguageData.transLationChunkSize) {
                const translationFile = new TranslationFile(this.language, this.currentIndex++);
                translationFile.store(chunkToSave);
                chunkToSave.clear();
                savedTranslationCount = 0;
            }
        });
    }

    public get(key: string): string {
        if (this.cachedTranslations.has(key)) {
            return this.cachedTranslations.get(key) ?? key;
        }

        if (!this.canNewTranslationsBeLoaded()) {
            return key;
        }

        this.tryLoadNextFile();
        return this.get(key);
    }

    private canNewTranslationsBeLoaded(): boolean {
        if (this.areAllTranslationsCached) {
            return false;
        }

        if ((this.cachedTranslationCount / LanguageData.transLationChunkSize) != this.currentIndex) {
            this.areAllTranslationsCached = true;
            return false;
        }

        return true;
    }

    private tryLoadNextFile() {
        const translationFile = new TranslationFile(this.language, this.currentIndex);
        
        if (!translationFile.exists()) {
            this.areAllTranslationsCached = true;
            return;
        }

        translationFile.load();
        const result = translationFile.getTranslations();
        
        result.forEach((key,translation) => {
            this.cachedTranslations.set(key,translation);
        });
        this.cachedTranslationCount = this.cachedTranslations.size;

        ++this.currentIndex;
    }
}