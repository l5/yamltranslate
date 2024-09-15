import { YamlTranslate } from '../src/index';

describe('YamlTranslate', () => {
  let yamlTranslate: YamlTranslate;

  beforeEach(() => {
    yamlTranslate = new YamlTranslate();
  });

  it('should return an empty list when no languages are added', () => {
    const languages = yamlTranslate.getAvailableLanguageList();
    expect(languages).toEqual([]);
  });

  it('should return a list with one language when one language is added', () => {
    yamlTranslate['addLanguageToUsedList']('en');
    const languages = yamlTranslate.getAvailableLanguageList();
    expect(languages).toEqual(['en']);
  });

  it('should return a list with multiple languages when multiple languages are added', () => {
    yamlTranslate['addLanguageToUsedList']('en');
    yamlTranslate['addLanguageToUsedList']('fr');
    const languages = yamlTranslate.getAvailableLanguageList();
    expect(languages).toEqual(['en', 'fr']);
  });

  it('should not add the same language more than once', () => {
    yamlTranslate['addLanguageToUsedList']('en');
    yamlTranslate['addLanguageToUsedList']('en');
    const languages = yamlTranslate.getAvailableLanguageList();
    expect(languages).toEqual(['en']);
  });
});