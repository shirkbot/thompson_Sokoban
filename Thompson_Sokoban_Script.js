"use strict"

/*
    Symbol Key:
          - Floor space
        # - Wall
        @ - Player
        $ - Box
        . - Switch
*/

var levelMaps = [                    
            [    
                "#########",
                "#       #",
                "#       #",
                "#       #",
                "# @ $ . #",
                "#       #",
                "#       #",
                "#       #",
                "#########"
            ],
            [    
                "#########",
                "#@  #.  #",
                "#   # $ #",
                "#   $   #",
                "#   #.###",
                "###$ #  #",
                "#       #",
                "#   .   #",
                "#########"
            ],
            [
                " #####  ",
                " #@  ## ",
                " # $  # ",
                "### # ##",
                "#.# #  #",
                "#.$  # #",
                "#.   $ #",
                "########"
            ]];        
                   
var psudoTable = [];                     

var currentLevel = 0;  
var Stages = 0;
var playerX = 0;
var playerY = 0;

var boxWidth = 56;
var boxHeight = 56;                             

//Initialize everything                    
function Initialize(){            
    Stages = levelMaps.length;
    loadNextLevel();
    loadEventHandler();
}     

//Clear divs to clear the map
function clearPrevious(){

    var BoardDiv = document.getElementById("Board");            

    for (var i = 0; i < psudoTable.length; i++) 
        for (var j = 0; j < psudoTable[i].length; j++) 

            BoardDiv.removeChild(psudoTable[i][j]);

}

//Modify size/position based on root images
function defineBoard(){

    var boardHeight = boxHeight * levelMaps[currentLevel].length;
    var boardWidth = boxWidth * levelMaps[currentLevel][0].length;

    var BoardDiv = document.getElementById("Board");

    BoardDiv.style.width = boardWidth + "px";
    BoardDiv.style.height = boardHeight + "px";
}

//Generate a psudo-table made of divs
function loadNextLevel(){

    defineBoard();

    var BoardDiv = document.getElementById("Board");

    psudoTable = [];

    for (var i = 0; i < levelMaps[currentLevel].length; i++){
        
        psudoTable[i] = [];

        for (var j = 0; j < levelMaps[currentLevel][i].length; j++){                
           var elementDiv = generateElementDiv(levelMaps[currentLevel][i][j]);

            psudoTable[i].push(elementDiv);
            BoardDiv.appendChild(elementDiv);                    

            if (levelMaps[currentLevel][i][j] == "@" || levelMaps[currentLevel][i][j] == "+") //Initial position of the Player
            {
                playerX = j;
                playerY = i;
            }

        }

    }            
                        
}      


//Key Input handler
function loadEventHandler(){

    var updateX = 0;
    var updateY = 0;
    var currentCell, nextCell, nextBoxCell;

    var Listener = function(input){
        
        if (input.keyCode == 37){
            updateX=-1; //Left
            updateY=0;
        
        }else if (input.keyCode == 39){
            updateX=1; //Right
            updateY=0;
        
        }else if (input.keyCode == 40){
            updateX=0;
            updateY=1; //Up
        
        }else if (input.keyCode == 38){
            updateX=0;
            updateY=-1; //Down
        
        }else{ 
            return;
        }

        currentCell = psudoTable[playerY][playerX];
        nextCell = psudoTable[playerY+updateY][playerX+updateX];

        if (wallCheck(nextCell.className))
            return;

        if (boxCheck(nextCell.className)) 
        {
            nextBoxCell = psudoTable[playerY + updateY + updateY][playerX + updateX + updateX]; //The next cell after the box in same direction of travel

            if (wallCheck(nextBoxCell.className) || boxCheck(nextBoxCell.className))
                return;
                
            nextBoxCell.className = updateBoxCellName(nextBoxCell.className);
            nextCell.className = pushRefresh(nextCell.className);

        }
        
        //Update the div classes according to player movement.
        currentCell.className=pushRefresh(currentCell.className);
        nextCell.className=playerFloorYN(nextCell.className);

        //Update present position of the player
        playerX = playerX + updateX;
        playerY = playerY + updateY;

        if (isLevelDone()){
            currentLevel++;
            
            if (currentLevel < Stages){
                clearPrevious();
                loadNextLevel();
            
            }else{
                alert("You Win!");
            }
        }
    }

    //Add the key event listener
    window.addEventListener("keydown", Listener);            
}

//Update cell information when the player pushes a box
function updateBoxCellName(prevName){

    if (prevName == "floorSwitch"){
        return "boxOnSwitch";
    }else{
        return "boxOnFloor";
    }
}

function pushRefresh(prevName){

    if (prevName == "boxOnSwitch" || prevName == "playerOnSwitch"){
        return "floorSwitch";
    }else{
        return "floor";
    }
}

//Identify player"s surface
function playerFloorYN(prevName){

    if( prevName == "floorSwitch"){
        return "playerOnSwitch";
    }else{
        return "playerOnFloor";
    }
}         

//Is the div a wall?        
function wallCheck(className){

    if (className == "wall")
        return true;

    return false;
}

//Is the div a box?
function boxCheck(className){

    if (className == "boxOnFloor" || className == "boxOnSwitch")
        return true;

    return false;
}

//Assign correct CSS to characters from levelMaps
function setClassName(ch)
{
    switch(ch)
    {
        case " ":
            return "floor";
        case "#":
            return "wall"; 
        case "$":
            return "boxOnFloor";
        case ".":
            return "floorSwitch";
        case "*":
            return "boxOnSwitch";
        case "@":
            return "playerOnFloor";
        case "+":
            return "playerOnSwitch";
    }
}                  

//Sets up the element divs to be added to the board
function generateElementDiv(data)
{
    var elementDiv = document.createElement("div")
    elementDiv.className = setClassName(data);

    elementDiv.style.width = boxWidth + "px"; //ImageWidth
    elementDiv.style.height = boxHeight + "px"; //ImageHeight

    return elementDiv;            
}           

//Check whether the level is finished.
function isLevelDone(){
    for (var i = 0; i < psudoTable.length; i++) 
        for (var j = 0; j < psudoTable[i].length; j++) 

            if (psudoTable[i][j].className  ==  "boxOnFloor") 
                return false;

    return true;
}