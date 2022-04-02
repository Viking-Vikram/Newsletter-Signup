const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	const fName = req.body.firstName;
	const lName = req.body.lastName;
	const email = req.body.email;
	console.log(fName, lName, email);
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: fName,
					LNAME: lName,
				},
			},
		],
	};
	const jsonData = JSON.stringify(data);

	const url = "https://us14.api.mailchimp.com/3.0/lists/4c28af5460";
	const options = {
		method: "post",
		auth: "vikram:cd0cdc014625bdd221ae46dcf5b1f623-us14",
	};

	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});
	request.write(jsonData);
	request.end();
});

app.post("/failure", function (req, res) {
	res.redirect("/");
});

app.listen(process.env.PORT || 3000, function (req, res) {
	console.log("server running at port 3000");
});

//api
//cd0cdc014625bdd221ae46dcf5b1f623-us14

//list
//4c28af5460.
