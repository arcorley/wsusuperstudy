//uses pm2 for persistence. pm2 start wsusuperstudy.js or pm2 stop wsusuperstudy.js

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

var mysql = require('./dbcon.js');

var sha256 = require('js-sha256').sha256;

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
	mysql.pool.query("INSERT INTO super_study.participants_temp (`ppt_first_nm`,`ppt_last_nm`,`ppt_phone_no`,`addr_line_1`,`addr_line_2`,`addr_city`,`addr_state`,`addr_zip`,`referred_by`,`referred_by_other`,`future_contact`,`future_contact_method`,`partner_interest`,`partner_first_nm`,`partner_last_nm`,`partner_phone_no`,`partner_email`,`english_check`,`ppt_age`,`partner_age`,`married_flag`,`rel_length`,`living_together`,`living_together_length`,`ppt_daily_pain`,`ppt_pain_length`,`ppt_pain_location`,`ppt_pain_level`,`ppt_pain_interference`,`partner_daily_pain`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
	[req.body.ppt_first_nm, req.body.ppt_last_nm, req.body.ppt_phone_no, req.body.addr_line_1, req.body.addr_line_2, req.body.addr_city, req.body.addr_state, req.body.addr_zip, req.body.referred_by, req.body.referred_by_other, req.body.future_contact, req.body.future_contact_method, req.body.partner_interest, req.body.partner_first_nm, req.body.partner_last_nm, req.body.partner_phone_no, req.body.partner_email, req.body.english_check, req.body.ppt_age, req.body.partner_age, req.body.married_flag, req.body.rel_length, req.body.living_together, req.body.living_together_length, req.body.ppt_daily_pain, req.body.ppt_pain_length, req.body.ppt_pain_location, req.body.ppt_pain_level, req.body.ppt_pain_interference, req.body.partner_daily_pain],
	function(err, result){
		if(err){
			next(err);
			return;
		}
	});


	res.send();
});

/******************PARTNER PAIN LANDING PAGE***********/
app.get('/partner_pain', function(req, res, next){
	if (req.headers["x-forwarded-for"]){		
	res.render('partner-pain-landing');
	}
	else{
		res.status(404).end();
	}
});

/******************PARTNER NO PAIN LANDING PAGE***********/
app.get('/partner_no_pain', function(req, res, next){
	if (req.headers["x-forwarded-for"]){		
	res.render('partner-no-pain-landing');
	}
	else{
		res.status(404).end();
	}
});

/*******************RETURNING PARTNER PAGE****************/
app.get('/returning_partner', function(req, res, next){
	if (req.headers["x-forwarded-for"]){		
	res.render('returning-partner');
	}
	else{
		res.status(404).end();
	}
});

/*******************RETURN PPT ID FOR RETURNING PARTNER PAGE****************/
app.get('/get-ppt-id', function(req,res,next){
	mysql.pool.query("SELECT ppt_id FROM super_study.participants_temp WHERE ppt_first_nm=? AND ppt_last_nm=?",
		[req.query.ppt_first_nm, req.query.ppt_last_nm],
		function(err, rows, fields){
			if(err){
				next(err);
				return;
			}

			var output = JSON.stringify(rows);
			res.send(output);
		});
});

/***************UPDATE RECORD WITH RETURNING PARTNER INFO****************/
app.post('/insert_returning_partner', function(req,res,next){
	mysql.pool.query("UPDATE super_study.participants_temp SET partner_first_nm=?, partner_last_nm=?, partner_daily_pain=?, partner_pain_length=?, partner_pain_location=?, partner_pain_level=?, partner_pain_interference=? WHERE ppt_id=?",
	[req.body.partner_first_nm, req.body.partner_last_nm, req.body.partner_daily_pain, req.body.partner_pain_length, req.body.partner_pain_location, req.body.partner_pain_level, req.body.partner_pain_interference, req.body.ppt_id],
	function(err, result){
		if(err){
			next(err);
			return;
		}
	});

	res.send();
});

/******************SERVE UP LAB LOGIN PAGE**********************/
app.get('/lab_login', function(req,res,next){
	if (req.headers["x-forwarded-for"]){		
	res.render('lab_login');
	}
	else{
		res.status(404).end();
	}
});

/******************AUTHENTICATE USER LOGINS***********************/
app.post('/authenticate',function(req,res,next){
  var pass = sha256(req.body.userPassword);
  console.log(pass);

  mysql.pool.query('SELECT password FROM super_study.users WHERE user_nm = ?', [req.body.userName], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

  var authPass = rows;

  if(pass === authPass[0].password){
    res.status(200).send();
  }
  else{
    res.status(445).send();
  }
  });

});

/****************GENERATE TEST PAGE******************/
app.get('/test', function(req,res,next){
	if (req.headers["x-forwarded-for"]){		
	res.render('test');
	}
	else{
		res.status(404).end();
	}
});

/************RUN THE APP******************/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

