//uses pm2 for persistence. pm2 start wsusuperstudy.js or pm2 stop wsusuperstudy.js

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

var mysql = require('./dbcon.js');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8080);

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/**************INDEX/TEAM PAGE******************/
app.get('/', function(req,res,next){
	if (req.headers["x-forwarded-for"]){		
	res.render('home');
	}
	else{
		res.status(404).end();
	}
});

/**************NEW PARTICIPANT******************/
app.get('/add-new', function(req,res,next){
	if (req.headers["x-forwarded-for"]){		
	res.render('add-new');
	}
	else{
		res.status(404).end();
	}
});

/**************INSERT NEW PARTICIPANT IN DATABASE******************/
app.post('/insert-ppt', function(req, res, next){
	mysql.pool.query("INSERT INTO super_study.participants (`ppt_first_nm`,`ppt_last_nm`,`ppt_phone_no`,`addr_line_1`,`addr_line_2`,`addr_city`,`addr_state`,`addr_zip`,`referred_by`,`future_contact`,`partner_interest`,`partner_first_nm`,`partner_last_nm`,`partner_phone_no`,`partner_email`,`english_check`,`ppt_age`,`partner_age`,`married_flag`,`rel_length`,`living_together`,`living_together_length`,`ppt_daily_pain`,`ppt_pain_length`,`ppt_pain_location`,`ppt_pain_level`,`ppt_pain_interference`,`partner_daily_pain`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
	[req.body.ppt_first_nm, req.body.ppt_last_nm, req.body.ppt_phone_no, req.body.addr_line_1, req.body.addr_line_2, req.body.addr_city, req.body.addr_state, req.body.addr_zip, req.body.referred_by, req.body.future_contact, req.body.partner_interest, req.body.partner_first_nm, req.body.partner_last_nm, req.body.partner_phone_no, req.body.partner_email, req.body.english_check, req.body.ppt_age, req.body.partner_age, req.body.married_flag, req.body.rel_length, req.body.living_together, req.body.living_together_length, req.body.ppt_daily_pain, req.body.ppt_pain_length, req.body.ppt_pain_location, req.body.ppt_pain_level, req.body.ppt_pain_interference, req.body.partner_daily_pain],
	function(err, result){
		if(err){
			next(err);
			return;
		}
	});


	res.send();
});

/************RUN THE APP******************/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

