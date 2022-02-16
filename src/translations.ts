import Language from './language';
import LanguageData from './language_data';

export default class Translations {
  defaultLanguage: Language;

  languageCache: Map<Language, LanguageData> = new Map();

  public constructor(defaultLanguage: Language = Language.US) {
    this.defaultLanguage = defaultLanguage;
  }

  public set(key: string, value: string, language: Language = this.defaultLanguage) {
    this.getLanguageFromCache(language).set(key, value)
  }


  public get(key: string, language: Language = this.defaultLanguage) {
    return this.getFromCache(key, language);
  }

  public warmup(languages: Language[]) {
    languages.forEach(language => { this.loadLanguage(language) });
  }

  private loadLanguage(language: Language) {
    this.getFromCache("", language);
  }

  private getLanguageFromCache(language: Language): LanguageData {
    const languageDate = this.languageCache.get(language) ?? new LanguageData(language);
    if (!this.languageCache.has(language)) {
      this.languageCache.set(language, new LanguageData(language));
    }
    return languageDate;
  }

  private getFromCache(key: string, language: Language = this.defaultLanguage): string {
    return this.getLanguageFromCache(language).get(key);
  }
}
