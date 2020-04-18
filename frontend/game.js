var grid = document.getElementById("grid");
var gameOver=false;
var testMode=true;
var d = new Date();
var t1= d.getTime();


// Ucitaj username korisnika
function loadUsername() {
    let person = prompt("Please enter your name", "Harry Potter");
    let username = "";

    if (person == null || person == "") {
        username = "Unknown";
    } else {
        username = person;
    }
    
    return username;
};

initialize();

function initialize() {
  grid.innerHTML="";
  for (var i=0; i<10; i++) {
    row = grid.insertRow(i);
    for (var j=0; j<10; j++) {
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      var mine = document.createAttribute("data-mine","false");      
      mine.value = "false";             
      cell.setAttributeNode(mine);
    }
  }
  mines();
}

//Funkcija koja nasumicno postavlja mine
function mines() {
  for (var i=0; i<20; i++) {
    var r = Math.floor(Math.random() * 10);
    var c = Math.floor(Math.random() * 10);
    var cell = grid.rows[r].cells[c];
    cell.setAttribute("data-mine","true");
    if (testMode) cell.innerHTML="X";
  }
}

function revealMines() {
    //Pokazujemo gde su se nalazile mine, bojimo ih u crveno
    for (var i=0; i<10; i++) {
      for(var j=0; j<10; j++) {
        var cell = grid.rows[i].cells[j];
        if (cell.getAttribute("data-mine")=="true") cell.className="mine";
      }
    }
}

function checkLevelCompletion() {
  var levelComplete = true;
    for (var i=0; i<10; i++) {
      for(var j=0; j<10; j++) {
        if ((grid.rows[i].cells[j].getAttribute("data-mine")=="false") &&
           (grid.rows[i].cells[j].innerHTML==""))
            levelComplete=false;
      }
  }
  if (levelComplete) {
    alert("You Win!");
    let user = loadUsername();
    d = new Date();
    var t2= d.getTime();
    sendResult(user, 360-((t2-t1)/10000));
    //getResult();
    revealMines();
  }
}

function clickCell(cell) {
  //Ukoliko je proslo vise od sat vremena od pocetka resavanja, korisnik gubi
  d=new Date();
  if((d.getTime()-t1)/1000 > 3600){
    revealMines();
    gameOver=true;
    alert("Game Over");
  }
  if(gameOver==false){
    if (cell.getAttribute("data-mine")=="true") {
      revealMines();
      gameOver=true;
      alert("Game Over");
    } else {
      cell.className="clicked";
      //Oredjujemo broj susednih polja koji su mine
      var around=0;
      var cellRow = cell.parentNode.rowIndex;
      var cellCol = cell.cellIndex;
      for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,9); i++) {
        for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,9); j++) {
          if (grid.rows[i].cells[j].getAttribute("data-mine")=="true") around++;
        }
      }
      cell.innerHTML=around;
      
      checkLevelCompletion();
    }
  }
  
}



// posalji rezultate
const sendResult = async (username, result) => {
    try { 
        const URL = 'http://localhost:3002/';
        const response = await fetch(URL, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            mode : 'cors',
            body : JSON.stringify({
                name : username,
                score : result
            })
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        elCl
    } catch (err) {
        console.error(err);
    }
}

// pokupi rezultate
const getResult = async () => {
    try {
        const URL = 'http://localhost:3002/';
        const response = await fetch(URL, {
            method : 'GET',
            headers : {
                'Content-Type': 'application/json'
            }
        });
        const jsonResponse = await response.json();
        console.log(jsonResponse);   
             
    } catch (err) {
        console.log(err);
    }
};
