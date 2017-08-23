var path = "https://www.wsusuperstudy.com/";

function inProgress(){
	window.location = path + "participants_in_progress";
}

function contactLog(){
	window.location = path + "contact_log";
}

function allParticipants(){
	window.location = path + "all_participants";
}

function allParticipantsDetail(x){
	window.location = path + "all_participants_detail?ppt_id=" + x;
}