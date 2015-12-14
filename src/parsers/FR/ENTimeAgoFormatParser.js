/*


*/

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(\W|^)(?:within\s*)?([0-9]+|an?)\s*(minutes?|hours?|weeks?|days?|months?|years?)\s*(?:ago|before|earlier)(?=(?:\W|$))/i;
var STRICT_PATTERN = /(\W|^)(?:within\s*)?([0-9]+|an?)\s*(minutes?|hours?|days?)\s*ago(?=(?:\W|$))/i;

exports.Parser = function ENTimeAgoFormatParser(){
    Parser.apply(this, arguments);

    this.pattern = function() {
        return this.isStrictMode()? STRICT_PATTERN : PATTERN;
    }

    this.extract = function(text, ref, match, opt){

        if (match.index > 0 && text[match.index-1].match(/\w/)) return null;

        var text = match[0];
        text  = match[0].substr(match[1].length, match[0].length - match[1].length);
        index = match.index + match[1].length;

        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        var num = match[2];
        if(num === 'a' || num === 'an'){
            num = 1;
        } else {
            num = parseInt(num);
        }

        var date = moment(ref);

        if (match[3].match(/hour/) || match[3].match(/minute/)) {
            if (match[3].match(/hour/)) {

                date.add(-num, 'heure');

            } else if (match[3].match(/minute/)) {

                date.add(-num, 'minute');
            }

            result.start.imply('jour', date.date());
            result.start.imply('mois', date.month() + 1);
            result.start.imply('année', date.year());
            result.start.assign('heure', date.hour());
            result.start.assign('minute', date.minute());
            result.tags['ENTimeAgoFormatParser'] = true;
            return result;
        }

        if (match[3].match(/weeks/)) {
            date.add(-num, 'semaine');

            result.start.imply('jour', date.date());
            result.start.imply('mois', date.month() + 1);
            result.start.imply('année', date.year());
            result.start.imply('jour de la semaine', date.day());
            return result;
        }

        if (match[3].match(/day/)) {
            date.add(-num, 'd');
        }

        if (match[3].match(/month/)) {
            date.add(-num, 'mois');
        }

        if (match[3].match(/year/)) {

            date.add(-num, 'année');
        }

        result.start.assign('jour', date.date());
        result.start.assign('mois', date.month() + 1);
        result.start.assign('année', date.year());
        return result;

    };
}
