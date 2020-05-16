let express = require("express");
let bodyPaser = require("body-parser");

require('dotenv').config();

const nodemailer = require('nodemailer');
// const log = console.log;

let app = express();
app.use(bodyPaser.json());

app.listen("3000", () => {
    log("it runs");
})

app.get("/", (req, res, next) => {
    res.statusCode = 200;
    res.sendFile( __dirname +"/index.htm")
    
})
app.post("/sendmail", async (req, res, next) => {
    if (req.body.mama == "girlscriptsuratHai") {
        try {
            let x = await sendMail(req.body, "GirlScriptWebsite");
            let y = await sendMail({
                name: "Girlscript Surat",
                email: req.body.email,
                message: "We Successfully recieve your email and we will contact you soon",
                forUser : true
            }, "GirlScriptWebsite");
            res.statusCode = 200;
            res.setHeader("content-type", "application/json");
            res.json({
                status: "ok",
                girlscript: x,
                reciver: y
            });
        } catch (e) {
            res.statusCode = 403;
            res.setHeader("content-type", "application/json");
            res.json({
                status: "fail",
                message: "mail no recive"
            });
        }
    } else {
        res.statusCode = 403;
        res.setHeader("content-type", "application/json");
        res.json({
            status: "fail",
            message: "You are Unauthporized"
        });
    }
})



function sendMail(body, sub) {
    console.log(body);
    let status = true;
    // Step 1
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // TODO: your gmail account
            pass: process.env.PASSWORD // TODO: your gmail password
        }
    });

    // log(process.env.EMAIL)
    // Step 2
    let mailOptions = {
        from: process.env.EMAIl, // TODO: email sender
        to: body.hasOwnProperty('forUser') ?  body.email : process.env.EMAIL, // TODO: email receiver
        subject: sub,
        html: `<h1>${body.name}</h1><br><h3>${body.email}</h3><br><p>${body.message}</p>`
    };

    // Step 3

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            status = false
            return console.log("ERROR Occured \n", err);
        }
        status = true
        return console.log("Email Sent!");
    });

    return status

}
