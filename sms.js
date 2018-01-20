import schedule from 'node-schedule';
import twilio from 'twilio';

const accountSid = 'Your Twillo SID';
const authToken = 'Your Twillo Auth Token';
const twilioNumber = 'Your Twillo Number';

module.exports.createSms = function(date, to, body){
    let client = new twilio(accountSid, authToken);

    schedule.scheduleJob(date, function(){
        client.messages.create({
            to: to,
            from: twilioNumber,
            body: body,
        }).then(msg => {
            return true;
        });
    });
}