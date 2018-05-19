var schedule = require('node-schedule');
var http = require('http');
var os = require('os');
var db = require('./DataProcessor');


function daily() {
    schedule.scheduleJob('30 16 * * *', function (req) {
        console.log("job"); DataProcessor.setupNodemailer();
        console.log("Nodemailer setup.");
        DataProcessor.checkForAlarms();
        console.log("emails checked.");
    });
}

var daily = daily();
module.exports = daily;
