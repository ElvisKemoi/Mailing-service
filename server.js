const express = require("express");
const app = express();
const https = require("https");
const request = require("request");
const keys = require("./keys.js")
const bodyParser= require("body-parser");




const ejs = require("ejs");


app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:false}))



app.get("/", (req,res)=>{
    res.render("home") 
})


app.get("/subscribe", (req,res)=>{

    res.render("subscribe")
})

app.post("/subscribe", (req, res) => {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    var phoneNumber = req.body.phone;
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                    PHONE: phoneNumber,
                },
            },
        ],
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/"+keys.list_id;
    const options = {
        method: "POST",
        auth: keys.key,
    };

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            const message = JSON.parse(data);
            const errorMessage = message.errors;
            const errorCount = message.error_count;
            if (errorCount === 0) {
                res.redirect("current")
                // res.sendFile(__dirname + "/success.html");
                console.log("Signup Successful!");
            } else {
                // res.sendFile(__dirname + "/failure.html");
                console.log(errorMessage);
                console.log(
                    "There was a problem in your sign up! Please try again."
                );
            }
        });
    });
    request.write(jsonData);
    request.end();
});


app.get("/current", (req,res)=>{
    res.render("current")
})


app.listen(3001, 
    ()=>{
        console.log("Server is live at port 3001.")
    })