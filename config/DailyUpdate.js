var schedule = require('node-schedule');
var http = require('http');
var os = require('os');
var db = require('./DataProcessor');


function DailyUpdate()
{
    schedule.scheduleJob
    (
        '30 16 * * *'
        , function (req)
          {
              DataProcessor.setupNodemailer();
              console.log("Nodemailer setup.");

              DataProcessor.checkForAlarms();
              console.log("emails checked.");
          }
    );
}
var DailyUpdate = DailyUpdate();

module.exports = DailyUpdate;
