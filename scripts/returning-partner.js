var path = "https://www.wsusuperstudy.com/";

function updateReturning(){
	var partner_first_nm = document.getElementById("partner_first_nm").value;
	var partner_last_nm = document.getElementById("partner_last_nm").value;
	var ppt_first_nm = document.getElementById("ppt_first_nm").value;
	var ppt_last_nm = document.getElementById("ppt_last_nm").value;
	var partner_daily_pain = document.getElementById("partner_daily_pain").value;
	var partner_pain_length = (document.getElementById("partner_pain_length_mos").value * 1) + (document.getElementById("partner_pain_length_yrs").value * 12);
	var partner_pain_location = document.getElementById("partner_pain_location").value;	
	var partner_pain_level = document.getElementById("partner_pain_level").value;
	var partner_pain_interference = document.getElementById("partner_pain_interference").value;	

	//only submit a request if the name fields are present
	if (ppt_first_nm && partner_first_nm){
		var idRequestData = {ppt_first_nm: ppt_first_nm, ppt_last_nm: ppt_last_nm}; //prep a JSON object to send in a GET request


		var idReq = new XMLHttpRequest();
		idReq.open('GET', path + 'get-ppt-id?ppt_first_nm=' + ppt_first_nm + '&ppt_last_nm=' + ppt_last_nm, true); //submit the GET request for the ppt id so we know which record to update
		idReq.setRequestHeader("Content-Type", "application/json");
		idReq.setRequestHeader("X-Forwarded-Proto", "https");

		idRequestData = JSON.stringify(idRequestData);

		idReq.send(idRequestData); //send the request

		idReq.addEventListener('load', function(){
			var response = JSON.parse(idReq.responseText); //parse the response

			if (response.length > 0){ //if we got a response, continue.
				var ppt_id = response[0].ppt_id;

				var formData = {partner_first_nm: partner_first_nm, partner_last_nm: partner_last_nm, partner_pain_length: partner_pain_length, partner_daily_pain: partner_daily_pain,
							    partner_pain_location: partner_pain_location, partner_pain_level: partner_pain_level, partner_pain_interference: partner_pain_interference, ppt_id: ppt_id};

				var req = new XMLHttpRequest();
				req.open('POST', path + 'insert_returning_partner', true);
				req.setRequestHeader("Content-Type", "application/json");
				req.setRequestHeader("X-Forwarded-Proto", "https");

				formData = JSON.stringify(formData);
				req.send(formData);

				req.addEventListener('load', function(){
					window.location = path + "partner_no_pain";
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
	$("#partner_daily_pain").on('change', function(){
		if ($("#partner_daily_pain").val() == "yes"){
			$("#pain_length_hidden").show();
			$("#pain_length_yrs_hidden").show();
			$("#pain_length_mos_hidden").show();
			$("#pain_location_hidden").show();
			$("#pain_level_hidden").show();
			$("#pain_interference_hidden").show();
		}
		else{
			$("#pain_length_hidden").hide();
			$("#pain_length_yrs_hidden").hide();
			$("#pain_length_mos_hidden").hide();
			$("#pain_location_hidden").hide();
			$("#pain_level_hidden").hide();
			$("#pain_interference_hidden").hide();
		}
	});
});