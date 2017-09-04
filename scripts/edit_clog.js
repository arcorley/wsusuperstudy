var path = "https://www.wsusuperstudy.com/";

function formatDate(date){
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + (d.getDate() + 1),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

function updateClog(){
	var ppt_id = document.getElementById("ppt_id").value;
	var ppt_clog_id = document.getElementById("ppt_clog_id").value;
	var contact_date_pre = document.getElementById("contact_date").value;
	var contact_date = formatDate(contact_date_pre);
	var contact_method = $("#contact_method :selected").text();
	var ra = $("#ra :selected").text();
	var outcome = $("#outcome :selected").text();
	var notes = document.getElementById("notes").value;

	var formData = {ppt_id: ppt_id,
					ppt_clog_id: ppt_clog_id, 
					contact_date: contact_date, 
					contact_method: contact_method, 
					ra: ra, 
					outcome: outcome, 
					notes: notes}

	var req = new XMLHttpRequest();
	req.open('POST', path + 'update_clog', true);
	req.setRequestHeader("Content-Type", "application/json");
	req.setRequestHeader("X-Forwarded-Proto", "https");

	formData = JSON.stringify(formData);
	req.send(formData);

	req.addEventListener('load', function(){
		alert("Contact data updated!");
		if (req.status == 201)
			window.location = path + "in_progress_detail?ppt_id=" + ppt_id;
		else if (req.status == 202)
			window.location = path + "all_participants_detail?ppt_id=" + ppt_id;
	});
}

function inProgress(){
	window.location = path + "participants_in_progress";
}

function allParticipants(){
	window.location = path + "all_participants";
}