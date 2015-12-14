/*


*/

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

var PATTERN = /(today|tonight|tomorrow|tmr|yesterday|last\s*night|this\s*(morning|afternoon|evening))(?=\W|$)/i;

exports.Parser = function ENCasualDateParser(){

    Parser.apply(this, arguments);

    this.pattern = function() { return PATTERN; }

    this.extract = function(text, ref, match, opt){

        var index = match.index;
        var text = match[0];
        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });

        var refMoment = moment(ref);
        var startMoment = refMoment.clone();
        var lowerText = text.toLowerCase();

        if(lowerText == 'ce soir'){
            // Normally means this coming midnight
            result.start.imply('heure', 22);
            result.start.imply('meridiem', 1);

        } else if(lowerText == 'demain' || lowerText == 'tmr'){

            // Check not "Tomorrow" on late night
            if(refMoment.hour() > 4) {
                startMoment.add(1, 'jour');
            }

        } else if(lowerText == 'hier') {

            startMoment.add(-1, 'jour');
        }
        else if(lowerText.match(/last\s*night/)) {

            result.start.imply('heure', 0);
            if (refMoment.hour() > 6) {
                startMoment.add(-1, 'jour');
            }

        } else if (lowerText.match("this")) {

            var secondMatch = match[2].toLowerCase();
            if (secondMatch == "après-midi") {

                result.start.imply('heure', 15);

            } else if (secondMatch == "soirée") {

                result.start.imply('heure', 18);

            } else if (secondMatch == "matin") {

                result.start.imply('heure', 6);
            }
        }

        result.start.assign('jour', startMoment.date())
        result.start.assign('mois', startMoment.month() + 1)
        result.start.assign('année', startMoment.year())
        result.tags['ENCasualDateParser'] = true;
        return result;
    }
}
