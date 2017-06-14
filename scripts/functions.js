function addNew(){
	var ppt_first_nm = document.getElementById("ppt_first_nm").value;
	var ppt_last_nm = document.getElementById("ppt_last_nm").value;
	var ppt_cell_phone_no = document.getElementById("ppt_cell_phone_no").value;
	var ppt_home_phone_no = document.getElementById("ppt_home_phone_no").value;
	var ppt_email = document.getElementById("ppt_email").value;
	var addr_line_1 = document.getElementById("addr_line_1").value;
	var addr_line_2 = document.getElementById("addr_line_2").value;
	var addr_city = document.getElementById("addr_city").value;
	var addr_state = document.getElementById("addr_state").value;
	var addr_zip = document.getElementById("addr_zip").value;
	var referred_by = document.getElementById("referred_by").value;
	var referred_by_other = document.getElementById("referred_by_other").value;
	var future_contact = document.getElementById("future_contact").value;
	var future_contact_method = document.getElementById("future_contact_method").value;
	var partner_interest = document.getElementById("partner_interest").value;
	var partner_first_nm = document.getElementById("partner_first_nm").value;
	var partner_last_nm = document.getElementById("partner_last_nm").value;
	var partner_cell_phone_no = document.getElementById("partner_cell_phone_no").value;
	var partner_home_phone_no = document.getElementById("partner_home_phone_no").value;
	var partner_email = document.getElementById("partner_email").value;
	var english_check = document.getElementById("english_check").value;
	var ppt_age = document.getElementById("ppt_age").value;
	var partner_age = document.getElementById("partner_age").value;
	var married_flag = document.getElementById("married_flag").value;
	var rel_length = document.getElementById("rel_length_mos").value + (document.getElementById("rel_length_yrs").value * 12);
	var living_together = document.getElementById("living_together").value;
	var living_together_length = document.getElementById("living_together_yrs").value + (document.getElementById("living_together_mos").value * 12);
	var ppt_daily_pain = document.getElementById("ppt_daily_pain").value;
	var ppt_pain_length = document.getElementById("ppt_pain_length_mos").value + (document.getElementById("ppt_pain_length_yrs").value * 12);
	var ppt_pain_location = document.getElementById("ppt_pain_location").value;
	var ppt_pain_level = document.getElementById("ppt_pain_level").value;
	var ppt_pain_interference = document.getElementById("ppt_pain_interference").value;
	var partner_daily_pain = document.getElementById("partner_daily_pain").value;

	//do checks on the values that need integers. if they're null make them 0
	if (ppt_age == "")
		ppt_age = 0;

	if (partner_age == "")
		partner_age = 0;

	var formData = {ppt_first_nm: ppt_first_nm, ppt_last_nm: ppt_last_nm, ppt_cell_phone_no: ppt_cell_phone_no, ppt_home_phone_no: ppt_home_phone_no, ppt_email: ppt_email, addr_line_1: addr_line_1, addr_line_2: addr_line_2, 
					addr_city: addr_city, addr_state: addr_state, addr_zip: addr_zip, referred_by: referred_by, referred_by_other: referred_by_other, future_contact: future_contact, 
					future_contact_method: future_contact_method, partner_interest: partner_interest, partner_first_nm: partner_first_nm, partner_last_nm: partner_last_nm, partner_cell_phone_no: partner_cell_phone_no, 
					partner_home_phone_no: partner_home_phone_no, partner_email: partner_email, english_check: english_check, ppt_age: ppt_age, partner_age: partner_age, married_flag: married_flag, rel_length: rel_length, 
					living_together: living_together, living_together_length: living_together_length, ppt_daily_pain: ppt_daily_pain, ppt_pain_length: ppt_pain_length, 
					ppt_pain_location: ppt_pain_location, ppt_pain_level: ppt_pain_level, ppt_pain_interference: ppt_pain_interference, partner_daily_pain: partner_daily_pain};

	var req = new XMLHttpRequest();
	req.open('POST', 'http://wsusuperstudy.com/insert-ppt', true);
	req.setRequestHeader("Content-Type", "application/json");

	formData = JSON.stringify(formData);
	req.send(formData);

	req.addEventListener('load', function(){
		if (partner_daily_pain == "yes"){
			window.location = "http://www.wsusuperstudy.com/partner_pain";
		}
		else{
			window.location = "http://www.wsusuperstudy.com/partner_no_pain";
		}
	});
}

function updateReturning(){
	var partner_first_nm = document.getElementById("partner_first_nm").value;
	var partner_last_nm = document.getElementById("partner_last_nm").value;
	var ppt_first_nm = document.getElementById("ppt_first_nm").value;
	var ppt_last_nm = document.getElementById("ppt_last_nm").value;
	var partner_daily_pain = document.getElementById("partner_daily_pain").value;
	var partner_pain_length = document.getElementById("partner_pain_length_mos").value + (document.getElementById("partner_pain_length_yrs").value * 12);
	var partner_pain_location = document.getElementById("partner_pain_location").value;	
	var partner_pain_level = document.getElementById("partner_pain_level").value;
	var partner_pain_interference = document.getElementById("partner_pain_interference").value;	

	//only submit a request if the name fields are present
	if (ppt_first_nm && partner_first_nm){
		var idRequestData = {ppt_first_nm: ppt_first_nm, ppt_last_nm: ppt_last_nm}; //prep a JSON object to send in a GET request


		var idReq = new XMLHttpRequest();
		idReq.open('GET', 'http://wsusuperstudy.com/get-ppt-id?ppt_first_nm=' + ppt_first_nm + '&ppt_last_nm=' + ppt_last_nm, true); //submit the GET request for the ppt id so we know which record to update
		idReq.setRequestHeader("Content-Type", "application/json");

		idRequestData = JSON.stringify(idRequestData);

		idReq.send(idRequestData); //send the request

		idReq.addEventListener('load', function(){
			var response = JSON.parse(idReq.responseText); //parse the response

			if (response.length > 0){ //if we got a response, continue.
				var ppt_id = response[0].ppt_id;

				var formData = {partner_first_nm: partner_first_nm, partner_last_nm: partner_last_nm, partner_pain_length: partner_pain_length, partner_daily_pain: partner_daily_pain,
							    partner_pain_location: partner_pain_location, partner_pain_level: partner_pain_level, partner_pain_interference: partner_pain_interference, ppt_id: ppt_id};

				var req = new XMLHttpRequest();
				req.open('POST', 'http://wsusuperstudy.com/insert_returning_partner', true);
				req.setRequestHeader("Content-Type", "application/json");

				formData = JSON.stringify(formData);
				req.send(formData);

				req.addEventListener('load', function(){
					window.location = "http://www.wsusuperstudy.com/partner_no_pain";
				});			
			}
			else{
				alert("The name entered for Your Partner's First and Last Name did not match any of the names in our system. Please enter a valid name to continue.");
			}
		});
	}
	else{
		alert("Please enter your name and your partner's name.");
	}
}

$(document).ready(function(){

	/******** Hide/Show function for the referred by dropdown ********/
	$("#referred_by").on('change', function(){
		if ($("#referred_by").val() == "other"){
			$("#referred_hidden").show();
		}
		else{
			$("#referred_hidden").hide();
		}
	});

	/******** Hide/Show function for the future contact dropdown ********/
	$("#future_contact").on('change', function(){
		if ($("#future_contact").val() == "yes"){
			$("#future_contact_hidden").show();
		}
		else{
			$("#future_contact_hidden").hide();
		}
	});

	/******** Hide/Show function for the living together dropdown ********/
	$("#living_together").on('change',function(){
		if ($("#living_together").val() == "yes"){
			$("#living_together_hidden").show();
			$("#living_together_hidden_yrs").show();
			$("#living_together_hidden_mos").show();
		}
		else{
			$("#living_together_hidden").hide();
			$("#living_together_hidden_yrs").hide();
			$("#living_together_hidden_mos").hide();
		}
	});

});

function userLogin(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("pwd").value;

	var formData = {userName: user, userPassword: pass};

	var req = new XMLHttpRequest();
	req.open('POST', 'http://wsusuperstudy.com/authenticate', true);
	req.setRequestHeader("Content-Type", "application/json");

	formData = JSON.stringify(formData);
	req.send(formData);

	req.addEventListener('load', function(){ //listen for a response
			if(req.status == 200){
				window.location = "http://www.wsusuperstudy.com/test";
			}
			else{
				alert("The username/password combination supplied was incorrect.");
			}
		});
}
