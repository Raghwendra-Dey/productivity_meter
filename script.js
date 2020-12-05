// timer part
// global object

// Initialising the required variables
T = [{}, {}] ;
T[0].timerDiv = document.querySelectorAll('.watch1 #timer')[0];
T[1].timerDiv = document.querySelectorAll('.watch2 #timer')[0];
DiffWatch = document.querySelectorAll('.watch3 #timer')[0];

// Indicating that the timers are stopped ==> timerInterval is 0
T[0].timerInterval = T[1].timerInterval = 0

function displayTimer(id) {
  // initilized all local variables:
  var hours='00', minutes='00',
  miliseconds=0, seconds='00',
  time = '',
  timeNow = new Date().getTime(); // timestamp (miliseconds)

  T[id].difference = timeNow - T[id].timerStarted;

  // milliseconds
  if(T[id].difference > 10) {
    miliseconds = Math.floor((T[id].difference % 1000) / 10);
    if(miliseconds < 10) {
      miliseconds = '0'+String(miliseconds);
    }
  }
  // seconds
  if(T[id].difference > 1000) {
    seconds = Math.floor(T[id].difference / 1000);
    if (seconds > 60) {
      seconds = seconds % 60;
    }
    if(seconds < 10) {
      seconds = '0'+String(seconds);
    }
  }

  // minutes
  if(T[id].difference > 60000) {
    minutes = Math.floor(T[id].difference/60000);
    if (minutes > 60) {
      minutes = minutes % 60;
    }
    if(minutes < 10) {
      minutes = '0'+String(minutes);
    }
  }

  // hours
  if(T[id].difference > 3600000) {
    hours = Math.floor(T[id].difference/3600000);
    // if (hours > 24) {
    // 	hours = hours % 24;
    // }
    if(hours < 10) {
      hours = '0'+String(hours);
    }
  }

  time  =  hours   + ':'
  time += minutes + ':'
  time += seconds + ':'
  time += miliseconds;

  T[id].timerDiv.innerHTML = time;
}


function updateDifference() {
  // initilized all local variables:
  var hours='00', minutes='00',
  miliseconds=0, seconds='00',
  time = '';

  var difference = (T[0].difference-T[1].difference); //Stores time difference between two watches

  if(difference < 10){
    miliseconds = '0'+String(miliseconds);
  }
  // milliseconds
  if(difference > 10) {
    miliseconds = Math.floor((difference % 1000) / 10);
    if(miliseconds < 10) {
      miliseconds = '0'+String(miliseconds);
    }
  }
  // seconds
  if(difference > 1000) {
    seconds = Math.floor(difference / 1000);
    if (seconds > 60) {
      seconds = seconds % 60;
    }
    if(seconds < 10) {
      seconds = '0'+String(seconds);
    }
  }

  // minutes
  if(difference > 60000) {
    minutes = Math.floor(difference/60000);
    if (minutes > 60) {
      minutes = minutes % 60;
    }
    if(minutes < 10) {
      minutes = '0'+String(minutes);
    }
  }

  // hours
  if(difference > 3600000) {
    hours = Math.floor(difference/3600000);
    // if (hours > 24) {
    // 	hours = hours % 24;
    // }
    if(hours < 10) {
      hours = '0'+String(hours);
    }
  }

  time  =  hours   + ':'
  time += minutes + ':'
  time += seconds + ':'
  time += miliseconds;

  DiffWatch.innerHTML = time;
}


function startTimer(id) {
  // save start time
  T[id].timerStarted = new Date().getTime()
  console.log('T['+String(id)+'].timerStarted: '+T[id].timerStarted)

  if (T[id].difference > 0) {
    T[id].timerStarted = T[id].timerStarted - T[id].difference
  }
  // update timer periodically
  T[id].timerInterval = setInterval(function() {
    displayTimer(id);
    updateDifference();
  }, 10);

  // show / hide the relevant buttons:
  document.querySelectorAll('.watch'+String(id+1)+' #go')[0].style.display="none";
  document.querySelectorAll('.watch'+String(id+1)+' #stop')[0].style.display="inline";
  document.querySelectorAll('.watch'+String(id+1)+' #clear')[0].style.display="none";
}

function stopTimer(id) {

  clearInterval(T[id].timerInterval); // stop updating the timer
  T[id].timerInterval = 0; // Again indicating that the timer is stopped

  document.querySelectorAll('.watch'+String(id+1)+' #stop')[0].style.display="none";
  document.querySelectorAll('.watch'+String(id+1)+' #go')[0].style.display="inline";
  document.querySelectorAll('.watch'+String(id+1)+' #clear')[0].style.display="inline";
}

function clearTimer(id) {
  clearInterval(T[id].timerInterval);
  T[id].timerDiv.innerHTML = "00:00:00:00"; // reset timer to all zeros
  T[id].difference = 0;
  updateDifference();

  document.querySelectorAll('.watch'+String(id+1)+' #stop')[0].style.display="none";
  document.querySelectorAll('.watch'+String(id+1)+' #go')[0].style.display="inline";
  document.querySelectorAll('.watch'+String(id+1)+' #clear')[0].style.display="none";
}

// counter part
function prb_plus()
{
  var x = document.getElementById('prb_count').innerHTML.split(": ");
  var cnt=Number(x[x.length-1])+1;
  document.getElementById('prb_count').innerHTML="Problems Count: "+cnt.toString();
}

function prb_minus()
{
  var x = document.getElementById('prb_count').innerHTML.split(": ");
  var cnt=Number(x[x.length-1])-1;
  if(cnt<0) cnt=0;
  document.getElementById('prb_count').innerHTML="Problems Count: "+cnt.toString();
}

function rst()
{
  document.getElementById('prb_count').innerHTML="Problems Count: 0";
}
