import Language from "./language";
import Translations from "./translations";

export default class Test {

    public test() {
        const translations = new Translations(Language.DE);
        expect(translations.get("test.test")).toBe("test.test");
    }

}