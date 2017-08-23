var path = "https://www.wsusuperstudy.com/";

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

	/******** Hide/Show function for the ineligible no full screen reason dropdown ********/
	$("#ineligible_no_full_screen").on('change',function(){
		if ($("#ineligible_no_full_screen").val() == "yes"){
			$("#ineligible_screen_hidden").show();
		}
		else{
			$("#ineligible_screen_hidden").hide();
			$("#ineligible_no_full_screen_reason").val('none');
		}
	});	

	/******** Hide/Show function for the disinterest reason dropdown ********/
	$("#disinterest").on('change',function(){
		if ($("#disinterest").val() == "yes"){
			$("#disinterest_reason_hidden").show();
		}
		else{
			$("#disinterest_reason_hidden").hide();
			$("#disinterest_reason").val('none');
		}
	});


	/******** Eligibility function ********/
	$(".eligibility_field").on('change',function(){
		//declare variables for calculations
		var pptAge = parseInt($("#ppt_age").val(),10);
		var partnerAge = parseInt($("#partner_age").val(),10);
		var relLength = parseInt($("#rel_length_yrs").val(),10);
		var married = $("#married_flag").val();
		var livingTogetherYrs = parseInt($("#living_together_yrs").val(),10);
		var livingTogetherMos = parseInt($("#living_together_mos").val(),10);
		var livingTogetherLength = (livingTogetherYrs * 12) + livingTogetherMos;
		var completedScreen = $("#completed_screen").val();
		var ineligibleReason = '';
		var ineligibleScreen = $("#ineligible_no_full_screen").val();
		var disinterest = $("#disinterest").val();		

		/*****Assign Participant Pain Level*****/
		var pptDailyPain = $("#ppt_daily_pain").val();
		var pptPainLevel = parseInt($("#ppt_pain_level").val(),10);
		var pptPainInterference = parseInt($("#ppt_pain_interference").val(),10);
		var pptPainYrs = parseInt($("#ppt_pain_length_yrs").val(),10);
		var pptPainMos = parseInt($("#ppt_pain_length_mos").val(),10);
		var pptPainLength = (pptPainYrs * 12) + pptPainMos;
		var pptPainType = $("#ppt_pain_type").val();
		var pptPainStatus = '';

		console.log("Ppt daily pain: " + pptDailyPain);
		console.log("Ppt pain length: " + pptPainLength);
		console.log("Ppt pain level: " + pptPainLevel);
		console.log("Ppt pain interference: " + pptPainInterference);
		console.log("Ppt pain type: " + pptPainType);

		if (pptDailyPain == 'yes' && pptPainType == 'body_pain' && pptPainLevel >= 3 && pptPainInterference >=3 && pptPainLength >=3){
			pptPainStatus='Chronic';
		}
		else if (pptDailyPain == 'yes' && pptPainLevel >=3 && pptPainInterference <3 && pptPainLength >=3){
			pptPainStatus='Significant';
		}
		else if (pptDailyPain == 'yes' && pptPainLevel <3 && pptPainInterference >=3 && pptPainLength >=3){
			pptPainStatus='Significant';
		}
		else if (pptDailyPain == 'yes' && pptPainType != 'body_pain' && pptPainLevel >= 3 && pptPainInterference >=3 && pptPainLength >=3){
			pptPainStatus='Significant';
		}		
		else{
			pptPainStatus='Not Significant';
		}

		console.log("Ppt pain status: " + pptPainStatus);

		/*****Assign Partner Pain Level*****/
		var partnerDailyPain = $("#partner_daily_pain").val();
		var partnerPainLevel = parseInt($("#partner_pain_level").val(),10);
		var partnerPainInterference = parseInt($("#partner_pain_interference").val(),10);
		var partnerPainYrs = parseInt($("#partner_pain_length_yrs").val(),10);
		var partnerPainMos = parseInt($("#partner_pain_length_mos").val(),10);
		var partnerPainLength = (partnerPainYrs * 12) + partnerPainMos;
		var partnerPainType = $("#partner_pain_type").val();
		var englishCheck = $("#english_check").val();
		var partnerPainStatus = '';

		if (partnerDailyPain == 'yes' && partnerPainType == 'body_pain' && partnerPainLevel >= 3 && partnerPainInterference >=3 && partnerPainLength >=3){
			partnerPainStatus='Chronic';
		}
		else if (partnerDailyPain == 'yes' && partnerPainLevel >=3 && partnerPainInterference <3 && partnerPainLength >=3){
			partnerPainStatus='Significant';
		}
		else if (partnerDailyPain == 'yes' && partnerPainLevel <3 && partnerPainInterference >=3 && partnerPainLength >=3){
			partnerPainStatus='Significant';
		}
		else if (partnerDailyPain == 'yes' && partnerPainLevel >=3 && partnerPainInterference >=3 && partnerPainLength >=3 && partnerPainType != 'body_pain'){
			partnerPainStatus='Significant';
		}
		else{
			partnerPainStatus='Not Significant';
		}

		/*****Age Check*****/
		if (pptAge < 18 || partnerAge <18){
			$("#eligibility_status").val('no'); //change the eligibility dropdown to no
			ineligibleReason = 'At least one partner is under 18'; //save the ineligible reason. will eventually put this into the form
			console.log(ineligibleReason);
			return;
		}

		/*****Relationship Check*****/
		if (relLength <2 && married == 'no' && livingTogetherLength < 6){
			$("#eligibility_status").val('no'); //change the eligibility dropdown to no
			ineligibleReason = 'Relationship length';
			console.log(ineligibleReason);
			return;
		}

		/*****Completed Screen Check*****/
		if (completedScreen == 'no'){
			$("#eligibility_status").val('no'); //change the eligibility dropdown to no
			ineligibleReason = "Didn't complete screen"; //save the ineligible reason. will eventually put this into the form
			console.log(ineligibleReason);
			return;
		}

		/*****English Check*****/
		if (englishCheck == 'no'){
			$("#eligibility_status").val('no'); //change the eligibility dropdown to no
			ineligibleReason = "Both partners don't read and write in English"; //save the ineligible reason. will eventually put this into the form
			console.log(ineligibleReason);
			return;
		}

		/*****Pain Status Check*****/
		if (ineligibleScreen == 'yes'){
			$("#eligibility_status").val('no');
			ineligibleReason = 'Participant is ineligible without full screen';
		}
		else if (disinterest == 'yes'){
			$("#eligibility_status").val('no');
			ineligibleReason = 'Participant is not interested';
		}
		else if (pptPainStatus != 'Not Significant' && partnerPainStatus != 'Not Significant'){
			$("#eligibility_status").val('no');
			ineligibleReason = 'Both partners have significant or chronic pain';
			console.log(ineligibleReason);
			return;
		}
		else if (pptPainStatus == 'Not Significant' && partnerPainStatus == 'Not Significant'){
			$("#eligibility_status").val('no');
			ineligibleReason = "Both partners don't have significant or chronic pain";
			console.log(ineligibleReason);
			return;			
		}
		else if (pptPainStatus == 'Chronic' && partnerPainStatus == 'Not Significant'){
			$("#eligibility_status").val('yes');
			return;
		} 
		else if (pptPainStatus == 'Not Significant' && partnerPainStatus == 'Chronic'){
			$("#eligibility_status").val('yes');
			return;
		}
		else if (pptPainStatus == 'Significant' && partnerPainStatus == 'Not Significant'){
			$("#eligibility_status").val('no');
			ineligibleReason = "Neither partner has chronic pain";
			return;
		}
		else if (pptPainStatus == 'Not Significant' && partnerPainStatus == 'Significant'){
			$("#eligibility_status").val('no');
			ineligibleReason = "Neither partner has chronic pain";
			return;
		}

		console.log(ineligibleReason);


		$("#eligibility_status").val('yes');
	});

});

function updatePerm(){
	var ppt_id = document.getElementById("ppt_id").value;
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
	var english_check = document.getElementById("english_check").value;
	var partner_email = document.getElementById("partner_email").value;
	var ppt_age = document.getElementById("ppt_age").value;
	var partner_age = document.getElementById("partner_age").value;
	var married_flag = document.getElementById("married_flag").value;
	var rel_length = (document.getElementById("rel_length_mos").value * 1) + (document.getElementById("rel_length_yrs").value * 12);
	var living_together = document.getElementById("living_together").value;
	var living_together_length = (document.getElementById("living_together_mos").value * 1) + (document.getElementById("living_together_yrs").value * 12);
	var ppt_daily_pain = document.getElementById("ppt_daily_pain").value;
	var ppt_pain_length = (document.getElementById("ppt_pain_length_mos").value * 1) + (document.getElementById("ppt_pain_length_yrs").value * 12);
	var ppt_pain_location = document.getElementById("ppt_pain_location").value;
	var ppt_pain_level = document.getElementById("ppt_pain_level").value;
	var ppt_pain_interference = document.getElementById("ppt_pain_interference").value;
	var ppt_pain_type = document.getElementById("ppt_pain_type").value;
	var partner_daily_pain = document.getElementById("partner_daily_pain").value;
	var partner_pain_length = (document.getElementById("partner_pain_length_mos").value * 1) + (document.getElementById("partner_pain_length_yrs").value * 12);
	var partner_pain_location = document.getElementById("partner_pain_location").value;
	var partner_pain_level = document.getElementById("partner_pain_level").value;
	var partner_pain_interference = document.getElementById("partner_pain_interference").value;
	var partner_pain_type = document.getElementById("partner_pain_type").value;
	var completed_screen = document.getElementById("completed_screen").value;
	var num_contacts = document.getElementById("num_contacts").value;
	var ineligible_no_full_screen = document.getElementById("ineligible_no_full_screen").value;
	var ineligible_no_full_screen_reason = document.getElementById("ineligible_no_full_screen_reason").value;
	var disinterest = document.getElementById("disinterest").value;
	var disinterest_reason = document.getElementById("disinterest_reason").value;
	var eligibility_status = document.getElementById("eligibility_status").value;

	var formData = {ppt_id: ppt_id, 
					ppt_first_nm: ppt_first_nm, 
					ppt_last_nm: ppt_last_nm, 
					ppt_cell_phone_no: ppt_cell_phone_no, 
					ppt_home_phone_no: ppt_home_phone_no, 
					ppt_email: ppt_email, 
					addr_line_1: addr_line_1, 
					addr_line_2: addr_line_2, 
					addr_city: addr_city, 
					addr_state: addr_state, 
					addr_zip: addr_zip, 
					referred_by: referred_by, 
					referred_by_other: referred_by_other, 
					future_contact: future_contact, 
					future_contact_method: future_contact_method, 
					partner_interest: partner_interest, 
					partner_first_nm: partner_first_nm, 
					partner_last_nm: partner_last_nm, 
					partner_cell_phone_no: partner_cell_phone_no, 
					partner_home_phone_no: partner_home_phone_no, 
					partner_email: partner_email, 
					english_check: english_check,
					ppt_age: ppt_age, 
					partner_age: partner_age, 
					married_flag: married_flag, 
					rel_length: rel_length, 
					living_together: living_together, 
					living_together_length: living_together_length, 
					ppt_daily_pain: ppt_daily_pain, 
					ppt_pain_length: ppt_pain_length, 
					ppt_pain_location: ppt_pain_location, 
					ppt_pain_level: ppt_pain_level, 
					ppt_pain_interference: ppt_pain_interference, 
					ppt_pain_type: ppt_pain_type, 
					partner_daily_pain: partner_daily_pain, 
					partner_pain_length: partner_pain_length, 
					partner_pain_location: partner_pain_location, 
					partner_pain_level: partner_pain_level, 
					partner_pain_interference: partner_pain_interference, 
					partner_pain_type: partner_pain_type, 
					completed_screen: completed_screen, 
					num_contacts: num_contacts, 
					ineligible_no_full_screen: ineligible_no_full_screen, 
					ineligible_no_full_screen_reason: ineligible_no_full_screen_reason, 
					disinterest: disinterest, 
					disinterest_reason: disinterest_reason, 
					eligibility_status: eligibility_status}

	var req = new XMLHttpRequest();
	req.open('POST', path + 'update_perm', true);
	req.setRequestHeader("Content-Type", "application/json");
	req.setRequestHeader("X-Forwarded-Proto", "https");

	formData = JSON.stringify(formData);
	req.send(formData);

	req.addEventListener('load', function(){
		alert("Participant data updated!");
		window.location = path + "all_participants_detail?ppt_id=" + ppt_id;
	});
}
