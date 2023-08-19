//Object that holds gameplay elements:
//  - Username, and its setters and getters
//  - playGame, initializes the game board and creates the ships
//  - isGameOver, checks if the game is over and if it is sends a message
//  - reset, resets the game when called
var gamePlay = {
    Username: '',

    //Setter for the username input
    setUsername: function() {
        let params = new URLSearchParams(location.search);
        this.Username = params.get('username');
    },

    //Getter for the username that was input
    getUsername: function () {return this.Username;},

    playGame: function () {
        battleship.initialize();
        battleship.createShips();
    },

    //Check function if the game is over, if it is add a message that the game has ended
    isGameOver: function () {
        let sunk = 0;   //count variable to add all ships that have been sunk
        for(let i = 0; i < ship.myBoats.length; i++){
            if(ship.myBoats[i].getHits() === ship.myBoats[i].getLength()){
                sunk += 1;
            }
        }
        //Checker to see if all ships have been sunk
        if(sunk >= ship.myBoats.length){
            addMessage(", Game Over!");
            return true;
        }

        return false;
    },

    //function to reset the game and start again
    reset: function () {
        clearMessages();
        addMessage("Game reset");
        this.playGame();
    },

    //adds an error message to the message div when called
    errorMessage: function(){
        clearMessages();
        addMessage("There was an error, please try again");
    }
};

