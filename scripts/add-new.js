var path = "https://www.wsusuperstudy.com/";

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
	var rel_length = (document.getElementById("rel_length_mos").value * 1) + (document.getElementById("rel_length_yrs").value * 12);
	var living_together = document.getElementById("living_together").value;
	var living_together_length = (document.getElementById("living_together_yrs").value * 12) + (document.getElementById("living_together_mos").value * 1);
	var ppt_daily_pain = document.getElementById("ppt_daily_pain").value;
	var ppt_pain_length = (document.getElementById("ppt_pain_length_mos").value * 1) + (document.getElementById("ppt_pain_length_yrs").value * 12);
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
					ppt_pain_location: ppt_pain_location, ppt_pain_level: ppt_pain_level, ppt_pain_interference: ppt_pain_interference, partner_daily_pain: partner_daily_pain, completed_screen: "no", num_contacts: 0,
					ineligible_no_full_screen: "no", disinterest: "no", eligibility_status: "no"};

	var req = new XMLHttpRequest();
	req.open('POST', path + 'insert-ppt', true);
	req.setRequestHeader("Content-Type", "application/json");
	req.setRequestHeader("X-Forwarded-Proto", "https");

	formData = JSON.stringify(formData);
	req.send(formData);

	req.addEventListener('load', function(){
		if (partner_daily_pain == "yes"){
			window.location = path + "partner_pain";
		}
		else{
			window.location = path + "partner_no_pain";
		}
	});
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
			$("#living_together_yrs").val('0');
			$("#living_together_mos").val('0');
		}
	});
});