/*


*/

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(\W|^)(within|in)\s*([0-9]+|an?)\s*(minutes?|hours?|days?)\s*(?=(?:\W|$))/i;

exports.Parser = function ENDeadlineFormatParser(){
    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var index = match.index + match[1].length;
        var text  = match[0];
        text  = match[0].substr(match[1].length, match[0].length - match[1].length);

        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        var num = match[3];
        if (num === 'a' || num === 'an'){
            num = 1;
        } else {
            num = parseInt(num);
        }

        var date = moment(ref);
        if (match[4].match(/day/)) {
            date.add(num, 'd');

            result.start.assign('année', date.year());
            result.start.assign('mois', date.month() + 1);
            result.start.assign('jour', date.date());
            return result;
        }


        if (match[4].match(/hour/)) {

            date.add(num, 'heure');

        } else if (match[4].match(/minute/)) {

            date.add(num, 'minute');
        }

        result.start.imply('année', date.year());
        result.start.imply('mois', date.month() + 1);
        result.start.imply('jour', date.date());
        result.start.assign('heure', date.hour());
        result.start.assign('minute', date.minute());
        result.tags['ENDeadlineFormatParser'] = true;
        return result;
    };
}
