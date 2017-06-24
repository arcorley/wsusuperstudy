//uses pm2 for persistence. pm2 start wsusuperstudy.js or pm2 stop wsusuperstudy.js

var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/public'));

var mysql = require('./dbcon.js');

var sha256 = require('js-sha256').sha256;

var tools = require('./config/tools.js');
tools.setParams();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8080);

app.enable('trust proxy');
app.set('trust proxy', 1); // trust first proxy

app.use(session({secret:process.env.secret, cookie: {httpOnly: false, proxy: true, secure: true}}));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

/**************INDEX PAGE******************/
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
	mysql.pool.query("INSERT INTO super_study.participants_temp (`ppt_first_nm`,`ppt_last_nm`,`ppt_cell_phone_no`,`ppt_home_phone_no`,`ppt_email`,`addr_line_1`,`addr_line_2`,`addr_city`,`addr_state`,`addr_zip`,`referred_by`,`referred_by_other`,`future_contact`,`future_contact_method`,`partner_interest`,`partner_first_nm`,`partner_last_nm`,`partner_cell_phone_no`,`partner_home_phone_no`,`partner_email`,`english_check`,`ppt_age`,`partner_age`,`married_flag`,`rel_length`,`living_together`,`living_together_length`,`ppt_daily_pain`,`ppt_pain_length`,`ppt_pain_location`,`ppt_pain_level`,`ppt_pain_interference`,`partner_daily_pain`,`completed_screen`,`num_contacts`,`ineligible_no_full_screen`,`disinterest`,`eligibility_status`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
	[req.body.ppt_first_nm, req.body.ppt_last_nm, req.body.ppt_cell_phone_no, req.body.ppt_home_phone_no, req.body.ppt_email,req.body.addr_line_1, req.body.addr_line_2, req.body.addr_city, req.body.addr_state, req.body.addr_zip, req.body.referred_by, req.body.referred_by_other, req.body.future_contact, req.body.future_contact_method, req.body.partner_interest, req.body.partner_first_nm, req.body.partner_last_nm, req.body.partner_cell_phone_no, req.body.partner_home_phone_no, req.body.partner_email, req.body.english_check, req.body.ppt_age, req.body.partner_age, req.body.married_flag, req.body.rel_length, req.body.living_together, req.body.living_together_length, req.body.ppt_daily_pain, req.body.ppt_pain_length, req.body.ppt_pain_location, req.body.ppt_pain_level, req.body.ppt_pain_interference, req.body.partner_daily_pain, req.body.completed_screen, req.body.num_contacts, req.body.ineligible_no_full_screen, req.body.disinterest, req.body.eligibility_status],
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

  mysql.pool.query('SELECT user_nm, password FROM super_study.users WHERE user_nm = ?', [req.body.userName], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

  var authPass = rows;
 
  if(pass === authPass[0].password){
	req.session.name = authPass[0].user_nm;
	req.session.save();
    res.status(200).send();
  }
  else{
    res.status(445).send();
  }
  });

});


/****************GENERATE LAB LOGIN LANDING PAGE******************/
app.get('/lab_login_landing', function(req,res,next){
	if (req.headers["x-forwarded-for"]){
			if (req.session.name){
				res.render('lab_login_landing');
			}
			else {
				res.redirect('lab_login');
			}
	}
	else{
		res.status(404).end();
	}
});

/****************GENERATE PARTICIPANTS IN PROGRESS PAGE******************/
app.get('/participants_in_progress', function(req, res, next){
	if (req.headers["x-forwarded-for"]){
		if (req.session.name){
			var context = {};
			mysql.pool.query('SELECT * from super_study.participants_temp', function(err, rows, fields){
				if(err){
					next(err);
					return;
				}
				context.ppt_results = rows;
				res.render('participants_in_progress', context);
			});
		}
		else{
			res.redirect('lab_login');
		}
	}
	else{
		res.status(404).end();
	}
});

/****************GENERATE CONTACT LOG PAGE******************/
app.get('/contact_log', function(req, res, next){
	if (req.headers["x-forwarded-for"]){
		if (req.session.name){
			res.render('contact_log');
		}
		else{
			res.redirect('lab_login');
		}
	}
	else{
		res.status(404).end();
	}
});

/****************GENERATE ALL PARTICIPANTS PAGE******************/
app.get('/all_participants', function(req, res, next){
	if (req.headers["x-forwarded-for"]){
		if (req.session.name){
			res.render('all_participants');
		}
		else{
			res.redirect('lab_login');
		}
	}
	else{
		res.status(404).end();
	}
});

/****************PARTICIPANTS IN PROGRESS DETAIL PAGE******************/
app.get('/in_progress_detail', function(req, res, next){
	if (req.headers["x-forwarded-for"]){ 
		if (req.session.name){
			var context = {};
			mysql.pool.query("SELECT * from super_study.participants_temp WHERE ppt_id = ?;" +  //0
			" SELECT a.*, case when ref.referred_by IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //1
				" LEFT JOIN (SELECT referred_by FROM super_study.participants_temp WHERE ppt_id=?) ref ON a.option_nm=ref.referred_by" +
				" WHERE a.field_nm='referred_by';" +
			" SELECT a.*, case when fc.future_contact IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //2
				" LEFT JOIN (SELECT future_contact FROM super_study.participants_temp WHERE ppt_id=?) fc ON a.option_nm=fc.future_contact" +
				" WHERE a.field_nm = 'future_contact';" +
			" SELECT a.*, case when fcm.future_contact_method IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //3
				" LEFT JOIN (SELECT future_contact_method from super_study.participants_temp WHERE ppt_id=?) fcm" +
				" ON a.option_nm=fcm.future_contact_method" +
				" WHERE a.field_nm = 'future_contact_method';" +
			" SELECT a.*, case when pin.partner_interest IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //4
				" LEFT JOIN (SELECT partner_interest from super_study.participants_temp WHERE ppt_id=?) pin ON a.option_nm=pin.partner_interest" +
				" WHERE a.field_nm = 'partner_interest';" +
			" SELECT a.*, case when ec.english_check IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //5
				" LEFT JOIN (SELECT english_check from super_study.participants_temp WHERE ppt_id=?) ec ON a.option_nm=ec.english_check" +
				" WHERE a.field_nm = 'english_check';" +
			" SELECT a.*, case when mf.married_flag IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //6
				" LEFT JOIN (SELECT married_flag from super_study.participants_temp WHERE ppt_id=?) mf ON a.option_nm=mf.married_flag" +
				" WHERE a.field_nm = 'married_flag';" +
			" SELECT a.*, case when lt.living_together IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //7
				" LEFT JOIN (SELECT living_together from super_study.participants_temp WHERE ppt_id=?) lt ON a.option_nm=lt.living_together" +
				" WHERE a.field_nm = 'living_together';" +
			" SELECT a.*, case when pdp.ppt_daily_pain IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //8
				" LEFT JOIN (SELECT ppt_daily_pain from super_study.participants_temp WHERE ppt_id=?) pdp ON a.option_nm=pdp.ppt_daily_pain" +
				" WHERE a.field_nm = 'ppt_daily_pain';" +
			" SELECT a.*, case when ppl.ppt_pain_level IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //9
				" LEFT JOIN (SELECT cast(ppt_pain_level as CHAR(2)) as ppt_pain_level FROM super_study.participants_temp WHERE ppt_id=?) ppl" +
				" ON a.option_nm=ppl.ppt_pain_level AND a.field_nm = 'ppt_pain_level'" +
				" WHERE a.field_nm = 'ppt_pain_level';" +
			" SELECT a.*, case when ppi.ppt_pain_interference IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //10
				" LEFT JOIN (SELECT cast(ppt_pain_interference as CHAR(2)) as ppt_pain_interference FROM super_study.participants_temp WHERE ppt_id=?) ppi" +
				" ON a.option_nm=ppi.ppt_pain_interference AND a.field_nm = 'ppt_pain_interference'" +
				" WHERE a.field_nm = 'ppt_pain_interference';" +
			" SELECT a.*, case when pd.partner_daily_pain IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //11
				" LEFT JOIN (SELECT partner_daily_pain FROM super_study.participants_temp WHERE ppt_id=?) pd ON a.option_nm=pd.partner_daily_pain" +
				" WHERE a.field_nm = 'partner_daily_pain';" + 
			" SELECT a.*, case when pl.partner_pain_level IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //12
				" LEFT JOIN (SELECT partner_pain_level FROM super_study.participants_temp WHERE ppt_id=?) pl ON a.option_nm=pl.partner_pain_level" +
				" WHERE a.field_nm = 'partner_pain_level';" +
			" SELECT a.*, case when part_pi.partner_pain_interference IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //13
				" LEFT JOIN (SELECT partner_pain_interference from super_study.participants_temp WHERE ppt_id=?) part_pi ON a.option_nm=part_pi.partner_pain_interference" +
				" WHERE a.field_nm = 'partner_pain_interference';" +
			" SELECT a.*, case when cs.completed_screen IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //14
				" LEFT JOIN (SELECT completed_screen from super_study.participants_temp WHERE ppt_id=?) cs ON a.option_nm=cs.completed_screen" +
				" WHERE a.field_nm = 'completed_screen';" +
			" SELECT a.*, case when infs.ineligible_no_full_screen IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //15
				" LEFT JOIN (SELECT ineligible_no_full_screen from super_study.participants_temp WHERE ppt_id=?) infs ON a.option_nm=infs.ineligible_no_full_screen" +
				" WHERE a.field_nm = 'ineligible_no_full_screen';" +
			" SELECT a.*, case when dis.disinterest IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //16
				" LEFT JOIN (SELECT disinterest from super_study.participants_temp WHERE ppt_id=?) dis ON a.option_nm=dis.disinterest" +
				" WHERE a.field_nm='disinterest';" +
			" SELECT a.*, case when es.eligibility_status IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //17
				" LEFT JOIN (SELECT eligibility_status from super_study.participants_temp WHERE ppt_id=?) es ON a.option_nm=es.eligibility_status" +
				" WHERE a.field_nm='eligibility_status';" + 
			" SELECT a.*, case when infsr.ineligible_no_full_screen_reason IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //18
				" LEFT JOIN (SELECT ineligible_no_full_screen_reason from super_study.participants_temp WHERE ppt_id=?) infsr ON a.option_nm=infsr.ineligible_no_full_screen_reason" +
				" WHERE a.field_nm='ineligible_no_full_screen_reason';" +
			" SELECT a.*, case when dr.disinterest_reason IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //19
				" LEFT JOIN (SELECT disinterest_reason from super_study.participants_temp WHERE ppt_id=?) dr ON a.option_nm=dr.disinterest_reason" +
				" WHERE a.field_nm='disinterest_reason';" +
			" SELECT a.*, case when ppt.ppt_pain_type IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //20
				" LEFT JOIN (SELECT ppt_pain_type from super_study.participants_temp WHERE ppt_id=?) ppt ON a.option_nm=ppt.ppt_pain_type" +
				" WHERE a.field_nm='ppt_pain_type';" +
			" SELECT a.*, case when part_pt.partner_pain_type IS NOT NULL then 'selected' else '' end as selected FROM super_study.options a" + //21
				" LEFT JOIN (SELECT partner_pain_type from super_study.participants_temp WHERE ppt_id=?) part_pt ON a.option_nm = part_pt.partner_pain_type" +
				" WHERE a.field_nm='partner_pain_type';"
			,[req.query.ppt_id, req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id,req.query.ppt_id], function(err, rows, fields){
				if(err){
					next(err);
					return;
				}
				rows[0].rel_length_yrs = Math.round(((rows[0][0].rel_length)/12));
				rows[0].rel_length_mos = Math.round(rows[0][0].rel_length%12);
				rows[0].living_together_yrs = Math.round(rows[0][0].living_together_length/12);
				rows[0].living_together_mos = Math.round(rows[0][0].living_together_length%12);
				rows[0].ppt_pain_yrs = Math.round(rows[0][0].ppt_pain_length/12);
				rows[0].ppt_pain_mos = Math.round(rows[0][0].ppt_pain_length%12);
				rows[0].partner_pain_yrs = Math.round(rows[0][0].partner_pain_length/12);
				rows[0].partner_pain_mos = Math.round(rows[0][0].partner_pain_length%12);
				context.ppt_results = rows[0];
				context.referred_by_options = rows[1];
				context.future_contact = rows[2];
				context.future_contact_method = rows[3];
				context.partner_interest = rows[4];
				context.english_check = rows[5];
				context.married_flag = rows[6];
				context.living_together = rows[7];
				context.ppt_daily_pain = rows[8];
				context.ppt_pain_level = rows[9];
				context.ppt_pain_interference = rows[10];
				context.partner_daily_pain = rows[11];
				context.partner_pain_level = rows[12];
				context.partner_pain_interference = rows[13];
				context.completed_screen = rows[14];
				context.ineligible_no_full_screen = rows[15];
				context.disinterest = rows[16];
				context.eligibility_status = rows[17];
				context.ineligible_no_full_screen_reason = rows[18];
				context.disinterest_reason = rows[19];
				context.ppt_pain_type = rows[20];
				context.partner_pain_type = rows[21];
				res.render('in_progress_detail', context);
			});
		}
		else{
			res.redirect('lab_login');
		}
	}
	else{
		res.status(404).end();
	}
});

/***************UPDATE RECORD FROM PARTICIPANTS IN PROGRESS****************/
app.post('/update_in_progress', function(req,res,next){
	mysql.pool.query("UPDATE super_study.participants_temp SET ppt_first_nm=?, ppt_last_nm=?, ppt_cell_phone_no=?, ppt_home_phone_no=?, ppt_email=?, addr_line_1=?, addr_line_2=?, addr_city=?, addr_state=?, addr_zip=?, referred_by=?, referred_by_other=?, future_contact=?, future_contact_method=?, partner_interest=?, partner_first_nm=?, partner_last_nm=?, partner_cell_phone_no=?, partner_home_phone_no=?, partner_email=?, ppt_age=?, partner_age=?, married_flag=?, rel_length=?, living_together=?, living_together_length=?, ppt_daily_pain=?, ppt_pain_length=?, ppt_pain_location=?, ppt_pain_level=?, ppt_pain_interference=?, ppt_pain_type=?, partner_daily_pain=?, partner_pain_length=?, partner_pain_location=?, partner_pain_level=?, partner_pain_interference=?, partner_pain_type=?, completed_screen=?, num_contacts=?, ineligible_no_full_screen=?, ineligible_no_full_screen_reason=?, disinterest=?, disinterest_reason=?, eligibility_status=? WHERE ppt_id=?",
	[req.body.ppt_id, req.body.ppt_first_nm, req.body.ppt_last_nm, req.body.ppt_cell_phone_no, req.body.ppt_home_phone_no, req.body.ppt_email, req.body.addr_line_1, req.body.addr_line_2, req.body.addr_city, req.body.addr_state, req.body.addr_zip, req.body.referred_by, req.body.referred_by_other, req.body.future_contact, req.body.future_contact_method, req.body.partner_interest, req.body.partner_first_nm, req.body.partner_last_nm, req.body.partner_cell_phone_no, req.body.partner_home_phone_no, req.body.partner_email, req.body.ppt_age, req.body.partner_age, req.body.married_flag, req.body.rel_length, req.body.living_together, req.body.living_together_length, req.body.ppt_daily_pain, req.body.ppt_pain_length, req.body.ppt_pain_location, req.body.ppt_pain_level, req.body.ppt_pain_interference, req.body.ppt_pain_type, req.body.partner_daily_pain, req.body.partner_pain_length, req.body.partner_pain_location, req.body.partner_pain_level, req.body.partner_pain_interference, req.body.partner_pain_type, req.body.completed_screen, req.body.num_contacts, req.body.ineligible_no_full_screen, req.body.ineligible_no_full_screen_reason, req.body.disinterest, req.body.disinterest_reason, req.body.eligibility_status],
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

