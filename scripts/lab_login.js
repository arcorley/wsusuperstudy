var path = "https://www.wsusuperstudy.com/";

function userLogin(){
	var user = document.getElementById("username").value;
	var pass = document.getElementById("pwd").value;

	var formData = {userName: user, userPassword: pass};

	var req = new XMLHttpRequest();
	req.open('POST', path + 'authenticate', true);
	req.setRequestHeader("Content-Type", "application/json");
	req.setRequestHeader("X-Forwarded-Proto", "https");

	formData = JSON.stringify(formData);
	req.send(formData);

	req.addEventListener('load', function(){ //listen for a response
			if(req.status == 200){
				window.location = path + "participants_in_progress";
			}
			else{
				alert("The username/password combination supplied was incorrect.");
			}
		});
}