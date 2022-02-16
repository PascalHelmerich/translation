import Language from "./language";
import { writeFileSync, readFileSync, existsSync } from "fs";

export class TranslationFile {

    language: Language;
    chunkId: number;
    fileName: string;
    translations: Map<string, string>;

    public constructor(language: Language, chunkId: number) {
        this.language = language;
        this.chunkId = chunkId;
        this.fileName = "./" + this.language.toString() + "_" + chunkId + ".js";
        this.translations = new Map();
    }

    public store(chunkToSave: Map<string, string>) {
        this.translations = chunkToSave;
        writeFileSync(this.fileName, JSON.stringify(chunkToSave), { encoding: "utf8", flag: "w"})
    }

    public exists(): boolean {
        return existsSync(this.fileName);
    }

    public load(): void {
        const content = readFileSync(this.fileName, {encoding:'utf8', flag:'r'});
        this.translations = JSON.parse(content);
    }

    public getTranslations(): Map<string, string> {
        return this.translations;
    }

}