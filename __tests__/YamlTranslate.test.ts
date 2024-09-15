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

describe('YamlTranslate', () => {
    let yamlTranslate: YamlTranslate;
  
    beforeEach(() => {
      yamlTranslate = new YamlTranslate();
    });
  
    it('should return the YAML content in the specified language', () => {
      const yamlObject = {
        greeting: {
          translations: [
            { language: 'en', text: 'Hello' },
            { language: 'fr', text: 'Bonjour' },
            { language: 'default', text: 'Hi' }
          ]
        }
      };
      const result = yamlTranslate.getYamlContent(yamlObject, 'fr');
      expect(result).toEqual({
        greeting: 'Bonjour'
      });
    });
  
    it('should return the YAML content in the default language if the specified language is not found', () => {
      const yamlObject = {
        greeting: {
          translations: [
            { language: 'en', text: 'Hello' },
            { language: 'default', text: 'Hi' }
          ]
        }
      };
      const result = yamlTranslate.getYamlContent(yamlObject, 'fr');
      expect(result).toEqual({
        greeting: 'Hi'
      });
    });
  
    it('should handle nested YAML objects', () => {
      const yamlObject = {
        greeting: {
          translations: [
            { language: 'en', text: 'Hello' },
            { language: 'fr', text: 'Bonjour' },
            { language: 'default', text: 'Hi' }
          ]
        },
        farewell: {
          translations: [
            { language: 'en', text: 'Goodbye' },
            { language: 'fr', text: 'Au revoir' },
            { language: 'default', text: 'Bye' }
          ]
        }
      };
      const result = yamlTranslate.getYamlContent(yamlObject, 'en');
      expect(result).toEqual({
        greeting: 'Hello',
        farewell: 'Goodbye'
      });
    });
  
    it('should handle YAML objects without translations', () => {
      const yamlObject = {
        greeting: 'Hello',
        farewell: 'Goodbye'
      };
      const result = yamlTranslate.getYamlContent(yamlObject, 'en');
      expect(result).toEqual({
        greeting: 'Hello',
        farewell: 'Goodbye'
      });
    });
  });