//use addEventListeners to listen for 
//   ◦ user clicks on the game board and then take the appropriate actions.
//   ◦ restart button clicks to restart the game.

window.addEventListener('load', (event) => {
	gamePlay.setUsername();
	document.getElementById("username-info").innerHTML = "Welcome " + gamePlay.getUsername() + ", let the battle commence!";
	gamePlay.playGame();
});

//Restart button clears the board and resets the game
document.getElementById("reset").addEventListener('click', e =>{
	gamePlay.reset();
});

//Handler for when the game board is clicked in playable spaces
document.getElementById("tbody").addEventListener('click', e => {
	console.log("table clicked");
	const tableElement = e.target;
	const [x,y] = [e.target.cellIndex, e.target.parentElement.rowIndex];
	if ((tableElement !== null) && (tableElement.tagName.toLowerCase() == "td")) {
		p_x = x.toString();
		p_y = (y-1).toString();
		coords = p_x+" "+p_y;
		battleship.makeMove(coords, tableElement);
	}
});

//uses XHR get method to get a coordinate from the server URL stored in models
$("#XHR").on('click', e =>{
	console.log("XHR clicked");
	const req = new XMLHttpRequest();
	req.open("GET", server_url, true);
	req.onreadystatechange = function(){
		//if Ok then proceed with the move
		if(this.readyState === 4 && this.status === 200){
			battleship.getRemoteMove(JSON.parse(this.responseText));	//pass JSON data into model function
		//if status is not ok then tell the user to try again
		}else if(this.status !== 200){
			console.log("there was an error");
			gamePlay.errorMessage();
			return;
		};
	}
	req.send();
});

//uses jQuery get method to get a coordinate from the server  URL stored in Models
$("#jQuery").on('click', e =>{
	console.log("jQuery clicked");
	//if OK proceed with the move
	$.get(server_url, function(responseText){
		battleship.getRemoteMove(responseText);		//pass JSON data into model function
	//if not then  tell the user to try again
	}).fail(function(err, status){
		console.log("There was an error: ",status);
		gamePlay.errorMessage();
	});
});

//uses the fetch API to get a coordinate from the server URL stored in Models
$("#rmove").on('click', e =>{
	console.log("Fetch  Clicked");
	fetch(server_url)
	.then(function(response){
		//if Ok proceed with the move
		if(response.readyState !== 4 && response.status !== 200){
			console.log("There was a problem. Status code: " + response.status);
			gamePlay.errorMessage();
			return;
		//if not then tell the user to try again
		}else{
			response.json().then((data) => {
				console.log(data);
				battleship.getRemoteMove(data);		//pass JSON data into model function
			});
		}
	});
});