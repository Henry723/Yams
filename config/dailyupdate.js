var schedule = require('node-schedule');
var http = require('http');
var os = require('os');
var dataProcessor = require('./dataprocessor');


function dailyUpdate()
{
    schedule.scheduleJob
    (
        '30 16 * * *'
        , function (req)
          {
              dataProcessor.setupNodemailer();
              console.log("Nodemailer setup.");

              dataProcessor.checkForAlarms();
              console.log("emails checked.");
          }
    );
}
var dailyUpdate = dailyUpdate();

module.exports = dailyUpdate;
