"use strict";

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * @see https://github.com/RRMoelker/print-css-toggle
 */
var screenRules = [];
var printRules = [];

function simulatePrintMediaQuery(rules) {
    var _iterator = _createForOfIteratorHelper(rules.screenRules),
        _step;

    try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var rule = _step.value;
            rule.media.mediaText = 'disabled';
        }
    } catch (err) {
        _iterator.e(err);
    } finally {
        _iterator.f();
    }

    var _iterator2 = _createForOfIteratorHelper(rules.printRules),
        _step2;

    try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var rule = _step2.value;
            rule.media.mediaText = 'screen';
        }
    } catch (err) {
        _iterator2.e(err);
    } finally {
        _iterator2.f();
    }
}

function restorePrintMediaQuery(rules) {
    var _iterator3 = _createForOfIteratorHelper(rules.screenRules),
        _step3;

    try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var rule = _step3.value;
            rule.media.mediaText = 'screen';
        }
    } catch (err) {
        _iterator3.e(err);
    } finally {
        _iterator3.f();
    }

    var _iterator4 = _createForOfIteratorHelper(rules.printRules),
        _step4;

    try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var rule = _step4.value;
            rule.media.mediaText = 'print';
        }
    } catch (err) {
        _iterator4.e(err);
    } finally {
        _iterator4.f();
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

    var _iterator5 = _createForOfIteratorHelper(styleSheets),
        _step5;

    try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var sheet = _step5.value;
            var rules = sheet.cssRules || sheet.rules; // IE <= 8 use "rules" property

            var _iterator6 = _createForOfIteratorHelper(rules),
                _step6;

            try {
                for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                    var rule = _step6.value;

                    if (rule.type == CSSRule.MEDIA_RULE) {
                        var media = rule.media;

                        if (rule.conditionText === 'print') {
                            printRules.push(rule);
                        } else if (rule.conditionText === 'screen') {
                            screenRules.push(rule);
                        }
                    }
                }
            } catch (err) {
                _iterator6.e(err);
            } finally {
                _iterator6.f();
            }
        }
    } catch (err) {
        _iterator5.e(err);
    } finally {
        _iterator5.f();
    }

    return {
        printRules: printRules,
        screenRules: screenRules
    };
}

function simulatePrintMedia() {
    screenRules.length = 0;
    printRules.length = 0;
    var rules = identifyCssRules();
    simulatePrintMediaQuery(rules);

    var _iterator7 = _createForOfIteratorHelper(document.getElementsByTagName("link")),
        _step7;

    try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var sheet = _step7.value;
            simulatePrintLink(sheet);
        }
    } catch (err) {
        _iterator7.e(err);
    } finally {
        _iterator7.f();
    }
}

function restoreScreenMedia() {
    var rules = {
        printRules: printRules,
        screenRules: screenRules
    };
    restorePrintMediaQuery(rules);

    var _iterator8 = _createForOfIteratorHelper(document.getElementsByTagName("link")),
        _step8;

    try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var sheet = _step8.value;
            restoreScreenLink(sheet);
        }
    } catch (err) {
        _iterator8.e(err);
    } finally {
        _iterator8.f();
    }
}