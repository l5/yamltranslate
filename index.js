function yamlTranslate() {
    return "hello NPM"
}

let allLanguagesUsed = []

function addLanguageToUsedList(languageName) {
    if (!(allLanguagesUsed.includes(languageName))) {
        allLanguagesUsed.push(languageName)
    }
}
function getAvailableLanguageList() {
    return allLanguagesUsed
}
function changeLang(yamlObject, destLg) {
    return changeYamlLanguage(yamlObject, destLg)
}
function changeYamlLanguage(yamlObject, destLg) {
    if (destLg === undefined) {
        destLg = 'default'
    }
    if (yamlObject instanceof Map) {
        for (const [key, value] of yamlObject.entries()) {
            yamlObject.set(key, changeYamlLanguage(value, destLg))
        }
    }
    else if (typeof yamlObject === 'object') {
        for (var key in yamlObject) {
            if (yamlObject[key] === null) continue
            if (typeof yamlObject[key] === 'object' && !("translations" in yamlObject[key])) {
                changeYamlLanguage(yamlObject[key], destLg)
            }
            else if (typeof yamlObject[key] === 'object' && "translations" in yamlObject[key]) {
                if (Array.isArray(yamlObject[key]["translations"])) { // Type 2
                    // search for the right language, or select default
                    var translations = yamlObject[key]["translations"]
                    var lang_id = null
                    var default_id = 0
                    for (var i = 0; i < translations.length; i++) {
                        addLanguageToUsedList(translations[i]['language'])
                        if ("language" in translations[i] && translations[i]['language'] == destLg) {
                            lang_id = i
                            // break
                        }
                        if ("language" in translations[i] && translations[i]['language'] == "default") {
                            default_id = i
                        }
                    }
                    (lang_id === null) ? lang_id = default_id : null;
                    (default_id === null) ? lang_id = 0 : null;

                    if ("text" in translations[lang_id]) {
                        yamlObject[key] = translations[lang_id]["text"]
                    } else if ("suggestion" in translations[lang_id]) {
                        yamlObject[key] = translations[lang_id]["suggestion"]
                    }
                } else { // Type 1
                    if (yamlObject[key]["translations"] === null) continue
                    for (var t in yamlObject[key]["translations"]) {
                        addLanguageToUsedList(t)
                    }
                    if (destLg in yamlObject[key]["translations"]) {
                        yamlObject[key] = yamlObject[key]["translations"][destLg]
                    } else {
                        yamlObject[key] = yamlObject[key]["translations"]["default"]
                    }
                }
            }
        }
    }
    return yamlObject
}

// module.exports = changeLang, getAvailableLanguageList
export default changeLang
