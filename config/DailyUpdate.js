var schedule = require('node-schedule');
var http = require('http');
var os = require('os');
var dataProcessor = require('./DataProcessor');


function DailyUpdate()
{
    schedule.scheduleJob
    (
        '* * * * *'
        , function (req)
          {
              dataProcessor.setupNodemailer();
              console.log("Nodemailer setup.");

              dataProcessor.checkForAlarms();
              console.log("emails checked.");
          }
    );
}
var DailyUpdate = DailyUpdate();

module.exports = DailyUpdate;
