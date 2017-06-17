var twilio_config = {
	"name": "Click To Call: Twilio & Node",
	"description": "An example of implementing click to call functionality in a Node.js application",
	"keywords": [
		"node.js",
		"API",
		"twilio",
		"expressjs",
		"Express",
		"Tutorial",
		"Telephone API",
		"Voice API",
		"REST API",
		"Demo"
	],
	"website": "https://twilio.com/docs/howto/click-to-call-walkthrough",
	"repository": "https://github.com/TwilioDevEd/clicktocall-node",
	"logo": "https://s3-us-west-2.amazonaws.com/deved/twilio-logo.png",
	"success_url": "/landing.html",
	accountSid: 'ACd1550dce7f28d8a378c13b517b9bf0e8',
	authToken: 'cba9bde18db21d91090c5c38ca13fd7d',
	from:  '+33756797227'
};

var client = require('twilio')(twilio_config.accountSid, twilio_config.authToken); 

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/voice', function (req, res) {
   res.sendFile(path.join(__dirname + '/voice.html'));
})

app.get('/alone', function (req, res) {
   res.sendFile(path.join(__dirname + '/alone.html'));
})

app.get('/falling', function (req, res) {
   res.sendFile(path.join(__dirname + '/falling.html'));
})

app.get('/howareyou', function (req, res) {
   res.sendFile(path.join(__dirname + '/howareyou.html'));
})

app.post('/sendsms', function (req, res) {
	var data = req.body;
	var result = {};
	if(data.to !== undefined && data.body !== undefined) {
		var res_sms;
		client.messages.create({ 
			to: data.to, 
			from: twilio_config.from, 
			body: data.body, 
		}, function(err, message) {
			if (err !== null) {
				console.log(err);
				result.result = false;
				result.message = 'Can\'t send the sms (twilio error)';
			}
			if (typeof(message) !== 'undefined') {
				console.log(message.sid);
				result.result = true;
				result.message = 'Message sent to ' + data.to;
			}
			res.setHeader('Content-Type', 'application/json');
			res.json(result);
		});
	}
	else {
		result.result = false;
		result.message = 'You have to send JSON {"to":"+33xxx","body":"your message"}';
		res.setHeader('Content-Type', 'application/json');
		res.json(result);
	}
})

app.post('/call', function(request, response) {
	// This should be the publicly accessible URL for your application
	// Here, we just use the host for the application making the request,
	// but you can hard code it or use something different if need be
	var salesNumber = "0033614322741";
	var url = 'http://' + request.headers.host + '/outbound/' + encodeURIComponent(salesNumber)

	var options = {
		to: request.body.to,
		from: twilio_config.from,
		url: url,
	};

	// Place an outbound call to the user, using the TwiML instructions
	// from the /outbound route
	client.calls.create(options)
		.then((message) => {
			console.log(message.responseText);
			response.send('Thank you! We will be calling you shortly.');
		})
		.catch((error) => {
			console.log(error);
			response.status(500).send(error);
		});
});

app.post('/call', function(req, res) {
	var url = 'http://google.com';

	var options = {
		to: req.body.to,
		from: twilio_config.from,
		url: url,
	};

	client.calls.create(options)
		.then((message) => {
			console.log(message.responseText);
			res.setHeader('Content-Type', 'application/json');
			res.json({'result': true, 'message': 'Call in coming'});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send(error);
		});
});


var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("AIMA Server listening at http://%s:%s", host, port)
})