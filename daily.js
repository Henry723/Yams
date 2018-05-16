var schedule = require('node-schedule');
var http = require('http');
var os = require('os');
var db = require('./config/db');


function daily() {


    schedule.scheduleJob('* * * * *', function (req) {
        //console.log("daily");
        //var user = JSON.stringify({
        //    email: 'yamsreminder@gmail.com',
        //    password: "Yams321!"
        //});
        //var thisPort = (process.env.PORT) ? process.env.PORT : '3000';
        //var req = new http.ClientRequest({
        //    hostname: os.hostname(),
        //    port: thisPort,
        //    path: '/auth/local/login',
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json',
        //        'Content-Length': Buffer.byteLength(user)
        //    }
        //});
        //req.end(user);
        console.log("job");
        /*********Uncomment line 15/16 to run updateDaysleft*****/
        /******change 11 to * in schedule.scheduleJob('* * 11 * *')*****/
        db.setupNodemailer();
        console.log("Nodemailer setup.");
        db.checkForAlarms();
        console.log("emails checked.");
    });
}




var daily = daily();
module.exports = daily;
