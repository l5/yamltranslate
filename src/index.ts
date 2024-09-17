interface Translation {
    language: string;
    text?: string;
    suggestion?: string;
}

interface Translatable {
    translations: Translation[] | { [key: string]: string };
}

type YamlValue = string | number | boolean | null | YamlObject | YamlObject[];
type YamlObject = { [key: string]: YamlValue } | Map<string, YamlValue>;


export class YamlTranslate {
    private allLanguagesUsed: string[] = [];

    private addLanguageToUsedList(languageName: string): void {
        if (!this.allLanguagesUsed.includes(languageName)) {
            this.allLanguagesUsed.push(languageName);
        }
    }

    public getAvailableLanguageList(): string[] {
        return this.allLanguagesUsed;
    }

    public getYamlContent(yamlObject: YamlObject, destLg?: string): YamlObject {
        return this.changeYamlLanguage(yamlObject, destLg);
    }

    private changeYamlLanguage(yamlObject: YamlObject, destLg: string = 'default'): YamlObject {
        if (yamlObject instanceof Map) {
            for (const [key, value] of yamlObject.entries()) {
                if (value !== null && (typeof value === 'object' || Array.isArray(value))) {
                    yamlObject.set(key, this.changeYamlLanguage(value as YamlObject, destLg));
                } else {
                    yamlObject.set(key, value);
                }
            }
        } else if (typeof yamlObject === 'object' && yamlObject !== null) {
            for (const key in yamlObject) {
                if (yamlObject[key] === null) continue;

                if (typeof yamlObject[key] === 'object' && !('translations' in yamlObject[key])) {
                    this.changeYamlLanguage(yamlObject[key] as YamlObject, destLg);
                } else if (typeof yamlObject[key] === 'object' && 'translations' in yamlObject[key]) {
                    const translatable = yamlObject[key] as unknown as Translatable;

                    if (Array.isArray(translatable.translations)) {
                        const translations = translatable.translations as Translation[];
                        let langId: number | null = null;
                        let defaultId = 0;

                        for (let i = 0; i < translations.length; i++) {
                                const myLg:string|undefined = translations[i]?.language;
                                if (myLg) {
                                    if (translations[i]?.language !== undefined) {
                                        this.addLanguageToUsedList(myLg);
                                    }
                                    if (translations[i]?.language === destLg) {
                                        langId = i;
                                    }
                                    if (translations[i]?.language === 'default') {
                                        defaultId = i;
                                    }
                                }
                        }

                        langId = langId ?? defaultId;
                        const myTranslation: Translation|undefined = translations[langId];
                        if (myTranslation) {
                            if ('text' in myTranslation) {
                                yamlObject[key] = myTranslation.text as YamlValue;
                            } else if ('suggestion' in myTranslation) {
                                yamlObject[key] = myTranslation.suggestion as YamlValue;
                            }
                        }
                    } else {
                        const translations = translatable.translations as { [key: string]: string };
                        for (const t in translations) {
                            this.addLanguageToUsedList(t);
                        }
                        yamlObject[key] = translations[destLg] as YamlValue ?? translations['default'] as YamlValue;
                    }
                }
            }
        }
        return yamlObject;
    }
}

export default YamlTranslate;
