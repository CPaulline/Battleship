//Create ship and battleship objects for the game
var board_x = 10, board_y = 10;
var server_url = "http://127.0.0.1:3000/" //  s "http://ncnwanze.faculty.noctrl.edu/battleshipcoord.php";
var boats = [["Cruiser", 2], ["Submarine", 3], ["Destroyer", 4], ["Battleship", 5]]
var ship = {
    Name: "",       //boat name
    Length: 0,      //boat length
    Orientation: "",//boat orientation
    Hits: 0,        //boat hits
    myBoats: [],
    
    //Set the name of the ship
    setName: function (name) {this.Name = name;},

    //Get the name of the ship
    getName: function () {return this.Name;},

    //Set the length of the ship
    setLength: function (length) {this.Length = length;},

    //Get the length of the ship
    getLength: function () {return this.Length;},

    //Set the orientation of the ship
    setOrientation: function (orientation) {this.Orientation = orientation;},

    //Get the orientation of the ship
    getOrientation: function () {return this.Orientation;},

    //Set the hits or health of the ship
    setHits: function (hits) {this.Hits = hits},

    //Gets the current health of the ship
    getHits: function () {return this.Hits}
};
var battleship = {
    Board: [],
    not_used: [],
    //Creates empty board of size in variables board_x and board_y
    initialize: function () {
        this.Board = [];
        tbody = document.querySelector("tbody");
        thead = document.querySelector("thead");

        tbody.innerHTML = '';
        thead.innerHTML = '';

        let trow = thead.insertRow(0);
        for(let i = 0; i < board_y; i++){
            this.Board[i] = [];
            let tcell = trow.insertCell(i);
            tcell.innerHTML = intToChar(i).toUpperCase();
            let row = tbody.insertRow();
            for(let j = 0; j < board_x; j++){
                this.Board[i][j] = 'e';
                this.not_used.push([i,j]);
                let cell = row.insertCell();
                let text = document.createTextNode("Click me");
                cell.appendChild(text);
            }
        }
    },

    //Gets a random int, max is the highest value that the function can get so if 3 is input expected output = 0, 1, or 2
    getRandomInt: function () {return this.not_used[Math.floor(Math.random() * this.not_used.length)];},

    //Finds a boat object in the list
    findBoat: function (name) {
        for(let i = 0; i < ship.myBoats.length; i++){
            if(ship.myBoats[i].getName() == name){
                return ship.myBoats[i];
            }
        }
    },

    //Given coordinates, boat size, and boat orientation checks to see if the boat can be placed
    canIPlaceShip: function (coordinates, size, orientation) {
        //takes the coordinates and seperates them into two seperate values
        let coords = coordinates.split(" ");
        let pos_x = parseInt(coords[0]);
        let pos_y = parseInt(coords[1]);
        //Check if orientation is vertical
        if (orientation == 'y'){

            //Check if the ship will be out of bounds based on the coordinates
            if (pos_y + size <= board_y){
                for(let i = pos_y; i < pos_y + size; i++){
                    if(this.Board[pos_x][i] != 'e'){
                        return false;
                    }
                }
            } else {
                return false;
            }
        
        //If not vertical, orientation is horizontal
        } else {

            //Check if the ship will be out of bounds based on the coordinates
            if (pos_x + size <= board_x){
                for(let j = pos_x; j < pos_x + size; j++){
                    if(this.Board[j][pos_y] != 'e'){
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return true;
    },

    //Randomly selects a position to place a ship on the board using the ships orientation and marks coordinates with first letter of ship name
    putShip: function (ship) {
        //Set of variables needed in order to place the ship
        let coord;
        let pos_x;
        let pos_y;
        let coord_string;
        let place_holder = ship.getName()[0];
        let placed = false;

        //Loop to keep iterating while the ship is not placed if there is another ship in the middle of the current position
        while(!placed){

            coord = this.getRandomInt();
            pos_x = coord[0];
            pos_y = coord[1];

            coord_string = pos_x.toString() + " " + pos_y.toString();
            
            //Add check to make sure that the ship when placed will not be out of range of the board
            if(this.canIPlaceShip(coord_string, ship.getLength(), ship.getOrientation())){
                if(ship.getOrientation() == 'y'){
                    for (let i = pos_y; i < pos_y + ship.getLength(); i++){
                        this.Board[pos_x][i] = place_holder;
                        this.not_used.splice(this.not_used.indexOf([pos_x,i]), 1);
                    }
                    return placed = true;
                } else {
                    for (let j = pos_x; j < pos_x + ship.getLength(); j++){
                        this.Board[j][pos_y] = place_holder;
                        this.not_used.splice(this.not_used.indexOf([j,pos_y]), 1);
                    }
                    return placed = true;
                }
            }
            //placed = true;
        }
    },

    //Generates all ship objects with random orientations, then calls putShip to put them on the board
    createShips: function () {
        //Loop through the boats list
        for (let i = 0; i < boats.length; i++){
            //Create new boat
            let newBoat = Object.create(ship);

            //Set name
            newBoat.setName(boats[i][0]);

            //Set length
            newBoat.setLength(boats[i][1]);

            //Set random orientation
            if(Math.random() <= .5){
                newBoat.setOrientation('x');
            }else{
                newBoat.setOrientation('y');
            }

            //Set times hit
            newBoat.setHits(0);

            //Places boat on the board
            this.putShip(newBoat);
            ship.myBoats[i] = newBoat;
        }
    },

    //Takes coordinate, with following options
    //  - "Missed" - If no ship is at the coordinate, it adds "Missed" to the message div, marks the board with an
    //    'M' and changes the background color of the clicked game board box
    //  - "Hit" - If a ship is at the coordinate, it changes the background to use the included image for the
    //    appropriate ship name. And adds "Hit [ship name]" to the message div
    //  - "Sunk" - If all of the ship pieces have been marked, add "You sunk the[ship name]" to the message div

    //Function for all hit boats to ge though, checks to see if it has sunk a ship then checks if the user won the game
    boatAction: function (cur_boat) {
        clearMessages();
        addMessage("Hit " + cur_boat.getName() + "!");
        cur_boat.setHits(cur_boat.getHits() + 1);
        if(cur_boat.getHits() == cur_boat.getLength()){
            clearMessages();
            addMessage("You sunk the " + cur_boat.getName() + "!");
            if(gamePlay.isGameOver()){
                alert("You've won!");
            }
        }
    },

    makeMove: function(coordinates, element) {
        coords = coordinates.split(' ');
        let pos_x = parseInt(coords[0]);
        let pos_y = parseInt(coords[1]);
        //If there is nothing in this space mark it with an M
        if (this.Board[pos_x][pos_y] == 'e') {
            markBox(element, "Missed");
            this.Board[pos_x][pos_y] = 'M';
            clearMessages();
            addMessage("Missed!");
            return;
        }

        //If there is a ship at this position mark either hit or sunk
        for(let i = 0; i < boats.length; i++){
            if(this.Board[pos_x][pos_y] == boats[i][0][0]){
                markBox(element, "Hit");
                this.Board[pos_x][pos_y] = 'H';
                this.boatAction(this.findBoat(boats[i][0]));
                return;
            }
        }

        //if the position has already been marked then print it has already been tried
       clearMessages();
       addMessage("Already Tried");
    },

    //when a remote move is recieved then change the coordinates to work with how the board is designed then call makeMove()
    getRemoteMove: function(data) {
        let coordinates = data.content.coordinates;
        let cstring = coordinates[0] + " " + coordinates[1];
        let x = coordinates[0].charCodeAt(0) - 65;  //change the first letter coordinate to a number and subtract 65 since that is the code for the letter A
        let y = coordinates[1] - 1;                 //subtract y coordinate by one since board is from 0-9 and not 1-10
        let coords = x + " " + y;                   //add both coordinates and make into a string since the make move takes coordinates as strings

        let element = document.getElementById("tbody").rows[y].cells[x];
        this.makeMove(coords, element);
        addMessage("Played: " + cstring);
    }
};
