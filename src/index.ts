interface Translation {
    language: string;
    text?: string;
    suggestion?: string;
}

interface Translatable {
    translations: Translation[] | { [key: string]: string };
}

type YamlObject = { [key: string]: any } | Map<any, any>;

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
                yamlObject.set(key, this.changeYamlLanguage(value, destLg));
            }
        } else if (typeof yamlObject === 'object' && yamlObject !== null) {
            for (const key in yamlObject) {
                if (yamlObject[key] === null) continue;

                if (typeof yamlObject[key] === 'object' && !('translations' in yamlObject[key])) {
                    this.changeYamlLanguage(yamlObject[key], destLg);
                } else if (typeof yamlObject[key] === 'object' && 'translations' in yamlObject[key]) {
                    const translatable = yamlObject[key] as Translatable;

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
                                yamlObject[key] = myTranslation.text;
                            } else if ('suggestion' in myTranslation) {
                                yamlObject[key] = myTranslation.suggestion;
                            }
                        }
                    } else {
                        const translations = translatable.translations as { [key: string]: string };
                        for (const t in translations) {
                            this.addLanguageToUsedList(t);
                        }
                        yamlObject[key] = translations[destLg] ?? translations['default'];
                    }
                }
            }
        }
        return yamlObject;
    }
}

export default YamlTranslate;
