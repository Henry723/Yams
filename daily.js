var schedule = require('node-schedule');
var http = require('http');
var os = require('os');
var db = require('./config/db');


function daily() {
    schedule.scheduleJob('30 16 * * *', function (req) {
        console.log("job");  db.setupNodemailer();
        console.log("Nodemailer setup.");
        db.checkForAlarms();
        console.log("emails checked.");
    });
}




var daily = daily();
module.exports = daily;
