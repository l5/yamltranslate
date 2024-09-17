# YamlTranslate

Condensing a multilingual yaml file into a single language yaml file

## Motivation

Have you ever come across a multilingual yaml file? - Probably not. Why would anybody need such a thing?

Well, we wanted to use yaml as a 
simple type of database replacement to feed a static web application. It worked great as long as 
the website was available in English only, but when the second language came along, it soon became clear that just 
cloning the yaml files for each new language would have labour intensive consequences, 
such as having to update the yaml files for each language if a new feature was added, etc.

We therefore came up with a flexible format within the yaml specification that can handle 
multiple language strings for each value.

Most applications would just deserialize a yaml file, and then directly address properties within the resulting object. This would be pretty difficult with a language-enriched, modified yaml structure. Hence, we just built a "flattener", which, given a translation-rich yaml file and the desired language, just generates a normal object in that specific language.

And that's exactly what YamlTranslate does.

## Examples
##### No Translation:
```yaml
page:
  title: Help
```

##### Simple, manually translated version:
```yaml
page:
  title:
    translations:
      default: Help
      en_EN: Help
      de_DE: Hilfe
      fr_FR: Aide
```
The first language is the default value in case the translation for the requested language is not available.

Result after applying `yamltranslate("en_EN")`:
```yaml
page:
  title: Help
```
Result after applying `yamltranslate("de_DE")`:
```yaml
page:
  title: Hilfe
```
Result after applying `yamltranslate("xx_XX")` (this defaults to "default"):
```yaml
page:
  title: Help
```


##### Complex translation version:
```yaml
page:
  title:
    translations:
      - language: default
        text: Help
      - language: de_DE
        text: Hilfe
        textOriginalHash: <hash>
        textTimestamp: <timestamp>
      - language: fr_FR
        text: Aide
        textOriginalHash: <hash>
        textTimestamp: <timestamp>
        suggestion: 
        suggestionOriginalHash:
        suggestionTimestamp: 
```

## Complex translation version syntax

* **text**: The actual text used. This is a manual translation. Overrides a **suggestion**.
* **textOriginalHash**: Optional; hash of the default text at the time of creating the manual translation. Software implementations ideally update this hash whenever the **text** is updated. Useful to figure out which translations may need an update.
* **textTimestamp**: Optional; timestamp of the last update of the **text** field value. Useful to figure out which translations might be outdated.
* **suggestion**: Optional; software implementations may fill an automated translation into this field. Will be displayed if **text** field is missing.
* **suggestionOriginalHash**: Optional; hash of the default text at the time of creating the automated translation suggestion. Software implementations ideally update this hash whenever the **suggestion** is updated. Useful to figure out which translations may need an update.
* **suggestionTimestamp**: Optional; timestamp of the last update of the **suggestion** field value. Useful to figure out which translations might be outdated.

## Parallel Usage

All options may be used in parallel in the same file. Parsers are supposed to validate and process any of these options in any given yaml file. 

Example: A website operator decides to translate the description of a page into several languages, but not the title.

```yaml
page:
  title: Help
  description:
    translations:
      default: Our very helpful Help section helps helping application consumers in a helpful way.
      de_DE: Unser äußerst hilfreicher Hilfebereich unterstützt Anwendungsnutzer auf hilfreiche Weise.
      fr_FR: Notre section d'aide très utile aide les utilisateurs d'applications à s'en servir de manière utile.
```

# Getting started

The package is available at https://www.npmjs.com/package/yamltranslate ; please follow the usual instructions to install an npm package.

## Installation:
```
npm i yamltranslate
```
## Usage
### Using `import`
```
// Import the YamlTranslate class
import { YamlTranslate } from 'path-to-your-module/index.js';

// Create an instance of YamlTranslate
const yamlTranslator = new YamlTranslate();

// Add a language to the used list
yamlTranslator.addLanguageToUsedList('en');

// Get the list of available languages
const languages = yamlTranslator.getAvailableLanguageList();
console.log(languages); // Output: ['en']

// Example YAML object
const yamlObject = {
    key1: {
        translations: [
            { language: 'en', text: 'Hello' },
            { language: 'es', text: 'Hola' },
            { language: 'default', text: 'Hello' }
        ]
    }
};

// Get YAML content in a specific language
const translatedYaml = yamlTranslator.getYamlContent(yamlObject, 'es');
console.log(translatedYaml);
```

### Using `require`
```
// Require the YamlTranslate class
const { YamlTranslate } = require('./path-to-your-module/index.js');

// Create an instance of YamlTranslate
const yamlTranslator = new YamlTranslate();

// Add a language to the used list
yamlTranslator.addLanguageToUsedList('en');

// Get the list of available languages
const languages = yamlTranslator.getAvailableLanguageList();
console.log(languages); // Output: ['en']

// Example YAML object
const yamlObject = {
    key1: {
        translations: [
            { language: 'en', text: 'Hello' },
            { language: 'es', text: 'Hola' },
            { language: 'default', text: 'Hello' }
        ]
    }
};

// Get YAML content in a specific language
const translatedYaml = yamlTranslator.getYamlContent(yamlObject, 'es');
console.log(translatedYaml);
```


# Tech Data

Intended compatibility: ES and CommonJS

# Contributing / Developing this library

## Test

```
npm run test
```

## Build

```
npm run build
```

## Bump Version

manually edit `package.json` (1x) and `package-lock.json`
