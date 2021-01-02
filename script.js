class Deque {

  constructor() {
    this.items = [];
    this.max_capacity=100;
  }

  isEmpty() {
    return (this.items.length==0);
  }

  addFront(item) {
    this.items.unshift(item);
  }

  addRear(item) {
    if(this.size()==this.max_capacity)
    this.removeFront();
    this.items.push(item);
  }

  removeFront() {
    return this.items.shift();
  }

  removeRear() {
    return this.items.pop();
  }

  size() {
    return this.items.length;
  }
}
// timer part
// global object
//There are three timers including the average time counter
let T = [{}, {},{}] ;

T[0].timerDiv = document.querySelector('.watch1 .timer');
T[1].timerDiv = document.querySelector('.watch2 .timer');
DiffWatch = document.querySelector('.watch3 .timer');
watchRunning = [0, 0];
isrunningAverage = false;  //bool variable to indicate whether the average time counter is running or not
runningAverage = 0;
var intervalID;
var intervalIDm;
var intervalID_f;
var intervalID_rst;
var ID = 0;
var IDm = 0;
var ID_f = 0;
var ID_rst = 0;
let loadedCount;

//For pop up messages when the number of problems solved is increased/decreased
//variable declaration for accessing element names 
var pop_min = document.getElementById("minus_modal");
var pop_pls = document.getElementById("plus_modal");
var pop_zero_prb = document.getElementById("zero_prb");
var pop_rst = document.getElementById("pop_rst");

dequeAvgTime=new Deque(); //Stores runningAverage for each click
dequePrevTime=new Deque(); //Store T[2].prevTime values for each click

// Toggle visibility of confirmation
function toggleConfirm(status){
  document.getElementById("backDrop").style.display = status;
  document.getElementById("confirmation").style.display = status;
}

// Make confirmation invisible
toggleConfirm("none");

// Load records if passed GET parameter.
let records = JSON.parse(localStorage.getItem("records"));
if(records === null || records === undefined){
  records = {};
}
let loadedTimer = new URLSearchParams(window.location.search).get("timer");

if(loadedTimer === null || records[loadedTimer] === undefined){ 
  // New timer i.e. not a loaded from saved ones
}

else{ // Loaded timer from saved ones
  
  isrunningAverage = false;
  runningAverage = records[loadedTimer].avg;
  loadedCount = records[loadedTimer].cnt;

  T[0].difference = records[loadedTimer].time_devoted;
  T[1].difference = records[loadedTimer].time_actual;
  updateDifference();
  displayTimer(0,true);
  displayTimer(1,true);

  // Make loaded confirmation
  toggleConfirm("block");
  document.getElementById("confirmMatter").innerHTML = `
    Loaded timer with name <b style="display: inline-block">${records[loadedTimer].name}</b>
    <br/> 
  `;
  document.getElementById("confirmYes").innerHTML = "Yes, continue";
  document.getElementById("confirmNo").innerHTML = "No, restart";
  
  document.getElementById("backDrop").addEventListener("click",() => {
    toggleConfirm("none");
  })
  
  document.getElementById("confirmNo").addEventListener("click",() => {
    window.location.href = "./index.html";
  })
  
  document.getElementById("confirmYes").addEventListener("click",() => {
    toggleConfirm("none");
  })
}

// isInit is an optional argument to this function that tells whether the timer is being loaded first or not, by default it is false
function displayTimer(id, isInit = false) {
  // initilized all local variables:
  var hours = '00', minutes = '00',
    miliseconds = 0, seconds = '00',
    time = '',
    timeNow = new Date().getTime(); // timestamp (miliseconds)
  if(!isInit){
    T[id].difference = timeNow - T[id].timerStarted;
  }

  // milliseconds
  if (T[id].difference > 10) {
    miliseconds = Math.floor((T[id].difference % 1000) / 10);
    if (miliseconds < 10) {
      miliseconds = '0' + String(miliseconds);
    }
  }
  // seconds
  if (T[id].difference > 1000) {
    seconds = Math.floor(T[id].difference / 1000);
    if (seconds >= 60) {
      seconds = seconds % 60;
    }
    if (seconds < 10) {
      seconds = '0' + String(seconds);
    }
  }

  // minutes
  if (T[id].difference > 60000) {
    minutes = Math.floor(T[id].difference / 60000);
    if (minutes >= 60) {
      minutes = minutes % 60;
    }
    if (minutes < 10) {
      minutes = '0' + String(minutes);
    }
  }

  // hours
  if (T[id].difference > 3600000) {
    hours = Math.floor(T[id].difference / 3600000);
    // if (hours > 24) {
    //  hours = hours % 24;
    // }
    if (hours < 10) {
      hours = '0' + String(hours);
    }
  }

  time = hours + ':'
  time += minutes + ':'
  time += seconds + ':'
  time += miliseconds;

  T[id].timerDiv.innerHTML = time;
}


function updateDifference() {
  // initilized all local variables:
  var hours = '00', minutes = '00',
    miliseconds = 0, seconds = '00',
    time = '';

  var difference = (T[0].difference - T[1].difference); //Stores time difference between two watches

  if (difference < 10) {
    miliseconds = '0' + String(miliseconds);
  }
  // milliseconds
  if (difference > 10) {
    miliseconds = Math.floor((difference % 1000) / 10);
    if (miliseconds < 10) {
      miliseconds = '0' + String(miliseconds);
    }
  }
  // seconds
  if (difference > 1000) {
    seconds = Math.floor(difference / 1000);
    if (seconds >= 60) {
      seconds = seconds % 60;
    }
    if (seconds < 10) {
      seconds = '0' + String(seconds);
    }
  }

  // minutes
  if (difference > 60000) {
    minutes = Math.floor(difference / 60000);
    if (minutes >= 60) {
      minutes = minutes % 60;
    }
    if (minutes < 10) {
      minutes = '0' + String(minutes);
    }
  }

  // hours
  if (difference > 3600000) {
    hours = Math.floor(difference / 3600000);
    // if (hours > 24) {
    //  hours = hours % 24;
    // }
    if (hours < 10) {
      hours = '0' + String(hours);
    }
  }

  time = hours + ':'
  time += minutes + ':'
  time += seconds + ':'
  time += miliseconds;

  DiffWatch.innerHTML = time;
}


function startTimer(id) {

  // Do not start the timer only when it is already running
  // Else it make re-assignment to the variable timerInterval and makes the
  // Previous interval unavailable; to clear it later
  if (watchRunning[id] == 1) {
    return
  }

  // Do not start second timer when the first one is stopped
  if (id == 1 && watchRunning[0] == 0) {
    return
  }

  // save start time
  T[id].timerStarted = new Date().getTime()
  console.log('T[' + String(id) + '].timerStarted: ' + T[id].timerStarted)
  watchRunning[id] = 1;

  if (T[id].difference > 0) {
    T[id].timerStarted = T[id].timerStarted - T[id].difference
  }
  // update timer periodically
  T[id].timerInterval = setInterval(function () {
    displayTimer(id);

    //Update Difference Watch only when exactly one Timer is running
    if (watchRunning[0] ^ watchRunning[1] === 1) //XOR will be 1 only when exactly one watch is running
      updateDifference();
  }, 10);

  // show / hide the relevant buttons:
  document.querySelectorAll('.watch' + String(id + 1) + ' #go')[0].style.display = "none";
  document.querySelectorAll('.watch' + String(id + 1) + ' #stop')[0].style.display = "inline";
  document.querySelectorAll('.watch' + String(id + 1) + ' #clear')[0].style.display = "none";
}

function stopTimer(id) {
  clearInterval(T[id].timerInterval); // stop updating the timer
  watchRunning[id] = 0;

  document.querySelectorAll('.watch' + String(id + 1) + ' #stop')[0].style.display = "none";
  document.querySelectorAll('.watch' + String(id + 1) + ' #go')[0].style.display = "inline";
  document.querySelectorAll('.watch' + String(id + 1) + ' #clear')[0].style.display = "inline";
}

function clearTimer(id) {
  clearInterval(T[id].timerInterval);
  T[id].timerDiv.innerHTML = "00:00:00:00"; // reset timer to all zeros
  T[id].difference = 0;
  updateDifference();

  document.querySelectorAll('.watch' + String(id + 1) + ' #stop')[0].style.display = "none";
  document.querySelectorAll('.watch' + String(id + 1) + ' #go')[0].style.display = "inline";
  document.querySelectorAll('.watch' + String(id + 1) + ' #clear')[0].style.display = "none";
}

// counter part
//function to be called when +1 is clicked 
function prb_plus()
{
  //for increment in the number of problem solved
  var x = document.getElementById('prb_count').innerHTML.split(": ");
  var cnt=Number(x[x.length-1])+1;
  document.getElementById('prb_count').innerHTML="Problems Count: "+cnt.toString();
  if(isrunningAverage) {
    dequePrevTime.addRear(T[2].prevtime);
    timeNow = new Date().getTime();
    temp =timeNow-T[2].prevtime;  //Updating the runningAverage using "current_timestamp - previous timestamp(T[2].prevtime)"
    Totaltime = runningAverage * (cnt-1);   
    Totaltime +=temp;
    runningAverage = Totaltime/(cnt);
    T[2].prevtime =timeNow;
    dequeAvgTime.addRear(runningAverage);
    updateAverage(cnt);
  }  
  //for display of pop-up messgae
  if(pop_min.style.display==="block"){pop_min.style.display="none";}
  if(pop_zero_prb.style.display==="block"){pop_zero_prb.style.display="none";}
  if(pop_rst.style.display==="block"){pop_rst.style.display="none";}
  pop_pls.style.opacity=1;
  pop_pls.style.display="block";
  if(pop_pls.style.opacity!=0 ){
    clearInterval(intervalID);
    window.clearTimeout(ID);
    pop_pls.style.opacity=1;
    ID=window.setTimeout(fade_out_plus,5000);
    
  }
  else{
    if(intervalID!==undefined){
      clearInterval(intervalID);
      window.clearTimeout(ID);
    }
  
  //setting a timer to call the function for automatic fade off after 3.5sec
  ID=window.setTimeout(fade_out_plus,3500);
   }
}

function fade_out_plus() {
  // introducing a function to reduce opacity by 0.1 with every 100ms.
  intervalID = setInterval(function () {
    if (pop_pls.style.opacity > 0) {
      if (pop_pls.style.opacity == 0.1) {
        pop_pls.style.opacity = pop_pls.style.opacity - 0.1;
        pop_pls.style.display = "none";
      }
      else { pop_pls.style.opacity = pop_pls.style.opacity - 0.1; }
      //                                 console.log(pop_pls.style.opacity);
    }

    else { clearInterval(intervalID); }
  }, 100);
}


//updating average when plus or minus  button is pressed
  function updateAverage(cnt, isInit = false){
  var minutes = '00', seconds = '00', time = '';
  if (cnt == 0) {
    runningAverage = 0;
    document.getElementById('Average time').innerHTML = "Average time/problem: 0 mins";
  }
  else {
    // seconds
    if (runningAverage > 1000) {
      seconds = Math.floor(runningAverage / 1000);
      if (seconds >= 60) {
        seconds = seconds % 60;
      }
      if (seconds < 10) {
        seconds = '0' + String(seconds);
      }
    }

    // minutes
    if (runningAverage > 60000) {
      minutes = Math.floor(runningAverage / 60000);
      if (minutes < 10) {
        minutes = '0' + String(minutes);
      }
    }

    time = minutes + ':';
    time += seconds;
    document.getElementById('Average time').innerHTML = "Average time/problem: " + time + " mins";
  }

}

if(loadedTimer === null || records[loadedTimer] === undefined){ 
  // New timer i.e. not a loaded from saved ones
}
else{ // Loaded timer from saved ones
  document.getElementById('prb_count').innerHTML="Problems Count: " + loadedCount.toString();
  updateAverage(loadedCount, isInit=true);
}

//function t be called when -1 is clicked
function prb_minus()
{
  //decreasing the problem count 
  var x = document.getElementById('prb_count').innerHTML.split(": ");
  var cnt=Number(x[x.length-1])-1;
  
  //for pop up messgae to appear when the problem count is decreased
  if(cnt>=0)
  {
    if (isrunningAverage) { 
      T[2].prevtime=dequePrevTime.items[dequePrevTime.size()-1];
      dequeAvgTime.removeRear();
      dequePrevTime.removeRear();
      runningAverage = dequeAvgTime.items[dequeAvgTime.size()-1];
      
    }
    if(pop_pls.style.display==="block"||pop_rst.style.display==="block")
    {
    pop_pls.style.display="none";
    pop_rst.style.display="none";
    }
    pop_min.style.opacity=1;
    pop_min.style.display="block";
    if(pop_min.style.opacity!=0 ){
      clearInterval(intervalIDm);
      window.clearTimeout(IDm);
      pop_min.style.opacity=1;
       //setting a timer to call the function for automatic fade off after 4sec when opacity was non-0
      IDm=window.setTimeout(fade_out_minus,4000);
    }
  else{
    if(intervalIDm!==undefined){
      clearInterval(intervalIDm);
      window.clearTimeout(IDm);
    }
    

  //setting a timer to call the function for automatic fade off after 3.5sec when opacity was 0
    IDm=window.setTimeout(fade_out_minus,3500);
   }
  }

  //for pop up message to appear when problem count is zero and
  //the user is still clicking -1
  else{
    if(pop_min.style.display==="block"){pop_min.style.display="none";}
    if(pop_pls.style.display==="block"){pop_pls.style.display="none";}
    if(pop_rst.style.display==="block"){pop_rst.style.display="none";}
    pop_zero_prb.style.opacity=1;
    pop_zero_prb.style.display="block";
    if(pop_zero_prb.style.opacity!=0 )
    {
      clearInterval(intervalID_f);
      window.clearTimeout(ID_f);
      pop_zero_prb.style.opacity=1;
      //setting a timer to call the function for automatic fade off after 4sec when opacity was non-zero
      ID_f=window.setTimeout(fade_zero_prb,4000);
    }
    else
    {
      if(intervalID_f!==undefined){
      clearInterval(intervalID_f);
      window.clearTimeout(ID_f);
      }
     

  //setting a timer to call the function for automatic fade off after 3.5sec when opacity was 0
      ID_f=window.setTimeout(fade_zero_prb,3500);
    }
  }
  if(cnt<0) cnt=0;
  document.getElementById('prb_count').innerHTML="Problems Count: "+cnt.toString();
  updateAverage(cnt);
}
function record() {
  if (document.querySelector('#record').style.backgroundColor == "blue") {
    document.querySelector('#record').style.backgroundColor = 'purple';    //Color introduced so user can realise that the timer is running
    document.querySelector('#record').style.color = ' pink';
  }
  else{
    document.querySelector('#record').style.backgroundColor = 'blue';    //Color introduced so user can realise that the timer is running
    document.querySelector('#record').style.color = ' white';
      }
      
  if (!isrunningAverage) {        //Averagetime counter is turned on we update previous timestamp,along with the difference from previous session"
    T[2].prevtime = new Date().getTime();
    if (T[2].delta > 0) T[2].prevtime = T[2].prevtime - T[2].delta;
    


  }
  else {        //Average time counter turned off 
    T[2].delta = new Date().getTime() - T[2].prevtime;
  }
  isrunningAverage ^= true;    //switching the bool variable to indicate whether timer is running or not
}

function rst() {
  document.getElementById('record').style.color = "pink";
  document.getElementById('record').style.backgroundColor = "purple";

  document.getElementById('prb_count').innerHTML = "Problems Count: 0";
  document.getElementById('Average time').innerHTML = "Average time/problem: 0 mins";
  isrunningAverage = false;
  T[2].delta = 0;
  runningAverage = 0;
  dequePrevTime.items=[]; //Clearing the Deque
  dequeAvgTime.items=[];
  if(pop_min.style.display==="block"||pop_pls.style.display==="block"||pop_zero_prb.style.display==="block"){
    pop_min.style.display="none";
    pop_pls.style.display="none";
    pop_zero_prb.style.display="none";
    }
    pop_rst.style.opacity=1;
    pop_rst.style.display="block";

  if(pop_rst.style.opacity!=0 ){
    clearInterval(intervalID_rst);
    window.clearTimeout(ID_rst);
    pop_rst.style.opacity=1;
     //setting a timer to call the function for automatic fade off after 3sec when opacity was non-0
    ID_rst=window.setTimeout(fade_pop_rst,3000);
  }
  else
  {
    if(intervalID_rst!==undefined){
      clearInterval(intervalID_rst);
      window.clearTimeout(ID_rst);
    }
    
  //setting a timer to call the function for automatic fade off after 2.5sec when opacity was 0
    ID_rst=window.setTimeout(fade_pop_rst,2500);
  }
 
}

//function for the fading off of pop up messgae(for -1)
function fade_out_minus() {
  intervalIDm = setInterval(function () {

    if (pop_min.style.opacity > 0) {
      if (pop_min.style.opacity == 0.1) {
        pop_min.style.opacity = pop_min.style.opacity - 0.1;
        pop_min.style.display = "none";
      }
      else {
        pop_min.style.opacity = pop_min.style.opacity - 0.1;
      }
    }

    else {
      clearInterval(intervalIDm);

    }
  }, 100);
}
//funtion to be called when reset button is clicked 



//functions to be called when cross button ic clicked 
//for pop up message of decrement
function vanish_minus() {
  pop_min.style.display = "none";
}
//for pop up message of increment
function vanish_plus() {
  pop_pls.style.display = "none";
}
//for pop up message of clicking at -1 when problem count is already 0 
function vanish_zero_prb() {
  pop_zero_prb.style.display = "none";
}
//for pop up message of reset button click
function vanish_rst() {
  pop_rst.style.display = "none";
}



// introducing a function to reduce opacity by 0.05 with every 100ms.
function fade_zero_prb() {
  intervalID_f = setInterval(function () {

    if (pop_zero_prb.style.opacity > 0) {
      if (pop_zero_prb.style.opacity == 0.1) {
        pop_zero_prb.style.opacity = pop_zero_prb.style.opacity - 0.1;
        pop_zero_prb.style.display = "none";
      }
      else {
        pop_zero_prb.style.opacity = pop_zero_prb.style.opacity - 0.1;
      }
    }

    else {
      clearInterval(intervalID_f);

    }
  }, 100);
}


// introducing a function to reduce opacity by 0.05 with every 100ms.
function fade_pop_rst() {
  intervalID_rst = setInterval(function () {

    if (pop_rst.style.opacity > 0) {
      if (pop_rst.style.opacity == 0.1) {
        pop_rst.style.opacity = pop_rst.style.opacity - 0.1;
        pop_rst.style.display = "none";
      }
      else {
        pop_rst.style.opacity = pop_rst.style.opacity - 0.1;
      }
    }

    else {
      clearInterval(intervalID_rst);


    }
  }, 100);
}

function save(){

  let date = new Date();
  let secns = date.getTime();
  let new_records = {};

  if(loadedTimer === null || records[loadedTimer] === undefined){ // New timer i.e. not a loaded from saved ones or that record cannot be found
    new_records.first_save_time = date.toString();
    new_records.id = secns.toString();
  }
  else{ // Loaded timer from saved ones
    new_records = records[loadedTimer]
  }

  new_records.last_save_time = date.toString();
  new_records.name = 
    document.getElementById("nameRecord").value === "" 
    ? 
    date.toDateString() + "  " + date.toLocaleTimeString() 
    : 
    document.getElementById("nameRecord").value;
  new_records.time_devoted = T[0].difference !== undefined ? T[0].difference : 0;
  new_records.time_actual = T[1].difference !== undefined ? T[1].difference : 0;
  new_records.time_wasted = new_records.time_devoted - new_records.time_actual;
  new_records.id = new_records.id;
  
  new_records.todos = [];

  let todosArrayHTML = document.getElementsByClassName("taskName");
  for (let i of todosArrayHTML){
    if(i.value === "")
      continue;
    let newTodo = {};
    newTodo.name = i.value;
    newTodo.completed = i.readOnly;
    console.log(newTodo)
    new_records.todos.push(newTodo);
  }

  new_records.avg = runningAverage;
  let x = document.getElementById('prb_count').innerHTML.split(": ");
  let cnt=Number(x[x.length-1]);
  new_records.cnt = cnt;

  records[new_records.id] = new_records;
  localStorage.setItem("records",JSON.stringify(records));
  toggleConfirm("none")
  window.location.href = "./history.html#record" + new_records.id;
}

function save_click(){
  stopTimer(0);
  stopTimer(1);
  toggleConfirm("block");
  document.getElementById("confirmMatter").innerHTML = `
    Do you want to save? 
    <br/> 
    Enter the name of the record for reference:
    <br/> 
    <input type="text" id="nameRecord" name="nameRecord" />
  `;
  document.getElementById("confirmYes").innerHTML = "Yes, save";
  document.getElementById("confirmNo").innerHTML = "No, cancel";

  if(loadedTimer === null || records[loadedTimer] === undefined){ // New timer i.e. not a loaded from saved ones
  }
  else{ // Loaded timer from saved ones
    document.getElementById("nameRecord").value = records[loadedTimer].name;
  }
  
  document.getElementById("backDrop").addEventListener("click",() => {
    toggleConfirm("none");
  })

  document.getElementById("confirmNo").addEventListener("click",() => {
    toggleConfirm("none");
  })

  document.getElementById("confirmYes").addEventListener("click",save)

}