var twilio_config = {
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


var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("AIMA Server listening at http://%s:%s", host, port)
})