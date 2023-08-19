//addClass(element, className) – adds a given class to an element if it does not have the class. Does nothing otherwise.
//removeClass(element, className) – removes a given class from an element if the class has it. Does nothing otherwise.
//addMessage(msg) – adds a given text (msg) to the message div.
//clearMessages – Removes all messages from the message div.
//markBox(mark) – Adds a mark message to a given game board box

//Adds a given to a given element
function addClass(element, className) {
	if (element.classList) {
		element.classList.add(className);

	} else if (!hasClass(element, className)) element.className += " " + className
}

//Removes a class from a given element
function removeClass(element, className) {
	if(element.classList) {
		element.classList.remove(className);
	}
}

//Adds a message to the message box
function addMessage(msg) {
	const msg_div = document.getElementById('message');
	const txt = document.createTextNode(msg+"\n");
	msg_div.appendChild(txt);
}

//Clears all messages from the message box
function clearMessages() {
	const clear = document.getElementById('message');
	if(clear !== null){
		clear.replaceChildren();
	}
}

//Marks the box with the right notations then uses addClass to mark each box with the right content
function markBox(element, mark) {
	changeText(element, mark);
	const [x,y] = [element.cellIndex, element.parentElement.rowIndex];
	if(battleship.Board[x][y-1] === 'e'){		//if a space is empty
		addClass(element, "missed");
	}else if(battleship.Board[x][y-1] === 'C'){	//if a space has a cruiser
		addClass(element, "vessel");
		addClass(element, "cruiser");
	}else if(battleship.Board[x][y-1] === 'S'){	//if a space has a submarine
		addClass(element, "vessel");
		addClass(element, "submarine");
	}else if(battleship.Board[x][y-1] === 'D'){	//if a space has a destroyer
		addClass(element, "vessel");
		addClass(element, "destroyer");
	}else if(battleship.Board[x][y-1] === 'B'){	//if a space has a battleship
		addClass(element, "vessel");
		addClass(element, "battleship");
	}
}

//function to help with table headers turning numbers to int
function intToChar(int){
	const code = 'a'.charCodeAt(0);
	return String.fromCharCode(code + int);
}

//changesthe text of a specified element
function changeText(element, msg) {
	if (element !== null)
		element.innerHTML = msg;
}