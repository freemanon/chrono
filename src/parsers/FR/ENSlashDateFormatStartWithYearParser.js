/*
    Date format with slash "/" between numbers like ENSlashDateFormatParser,
    but this parser expect year before month and date.
    - YYYY/MM/DD
    - YYYY-MM-DD
    - YYYY.MM.DD
*/
var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = new RegExp('(\\W|^)'
            + '([0-9]{4})[\\-\\.\\/]([0-9]{1,2})[\\-\\.\\/]([0-9]{1,2})'
            + '(?=\\W|$)', 'i');

var YEAR_NUMBER_GROUP = 2;
var MONTH_NUMBER_GROUP = 3;
var DATE_NUMBER_GROUP  = 4;

exports.Parser = function ENSlashDateFormatStartWithYearParser(){
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var text = match[0].substr(match[1].length);
        var index = match.index + match[1].length;

        var result = new ParsedResult({
            text: text,
            index: index,
            ref: ref,
        })

        result.start.assign('année', parseInt(match[YEAR_NUMBER_GROUP]));
        result.start.assign('mois', parseInt(match[MONTH_NUMBER_GROUP]));
        result.start.assign('jour', parseInt(match[DATE_NUMBER_GROUP]));

        if (moment(result.start.get('mois')) > 12 || moment(result.start.get('mois')) < 1 ||
            moment(result.start.get('jour')) > 31 || moment(result.start.get('jour')) < 1) {
            return null;
        }

        result.tags['ENDateFormatParser'] = true;
        return result;
    };
}
