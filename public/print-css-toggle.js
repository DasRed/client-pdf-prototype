/**
 * @see https://github.com/RRMoelker/print-css-toggle
 */

var screenRules = [];
var printRules = [];

function simulatePrintMediaQuery(rules) {
    for (var rule of rules.screenRules) {
        rule.media.mediaText = 'disabled';
    }

    for (var rule of rules.printRules) {
        rule.media.mediaText = 'screen';
    }
}

function restorePrintMediaQuery(rules) {
    for (var rule of rules.screenRules) {
        rule.media.mediaText = 'screen';
    }

    for (var rule of rules.printRules) {
        rule.media.mediaText = 'print';
    }
}

function simulatePrintLink(sheet) {
    if (sheet.media === 'screen') {
        sheet.disabled = true;
    }
    if (sheet.media === 'print') {
        sheet.title = 'print-disabled';
        sheet.media = '';
    }
}

function restoreScreenLink(sheet) {
    if (sheet.media === 'screen') {
        sheet.disabled = false;
    }
    if (sheet.title === 'print-disabled') {
        sheet.title = '';
        sheet.media = 'print';
    }
}

function identifyCssRules() {
    var styleSheets = document.styleSheets;

    for (var sheet of styleSheets) {
        var rules = sheet.cssRules || sheet.rules; // IE <= 8 use "rules" property

        for (var rule of rules) {
            if (rule.type == CSSRule.MEDIA_RULE) {
                var media = rule.media;

                if (rule.conditionText === 'print') {
                    printRules.push(rule);
                } else if (rule.conditionText === 'screen') {
                    screenRules.push(rule);
                }
            }
        }
    }
    return {
        printRules:printRules,
        screenRules:screenRules
    }
}

function simulatePrintMedia() {
    screenRules.length = 0;
    printRules.length = 0;
    var rules = identifyCssRules();
    simulatePrintMediaQuery(rules);
    for (var sheet of document.getElementsByTagName("link")) {
        simulatePrintLink(sheet);
    }
}

function restoreScreenMedia() {
    var rules = {
        printRules:printRules,
        screenRules:screenRules
    };
    restorePrintMediaQuery(rules);
    for (var sheet of document.getElementsByTagName("link")) {
        restoreScreenLink(sheet);
    }
}
