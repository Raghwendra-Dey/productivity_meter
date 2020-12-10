// timer part
// global object
//There are three timers including the average time counter
T = [{}, {},{}] ;
T[0].timerDiv = document.querySelectorAll('.watch1 #timer')[0];
T[1].timerDiv = document.querySelectorAll('.watch2 #timer')[0];
DiffWatch = document.querySelectorAll('.watch3 #timer')[0];
watchRunning = [0, 0];
isrunningAverage = false;  //bool variable to indicate whether the average time counter is running or not
runningAverage=0;  

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
    if (seconds >= 60) {   
      seconds = seconds % 60;
    }
    if(seconds < 10) {
      seconds = '0'+String(seconds);
    }
  }

  // minutes
  if(T[id].difference > 60000) {
    minutes = Math.floor(T[id].difference/60000);
    if (minutes >= 60) {
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
    if (seconds >= 60) {
      seconds = seconds % 60;
    }
    if(seconds < 10) {
      seconds = '0'+String(seconds);
    }
  }

  // minutes
  if(difference > 60000) {
    minutes = Math.floor(difference/60000);
    if (minutes >= 60) {
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

  // Do not start the timer only when it is already running
  // Else it make re-assignment to the variable timerInterval and makes the
  // Previous interval unavailable; to clear it later
  if( watchRunning[id] == 1 ){
    return
  }

  // Do not start second timer when the first one is stopped
  if( id == 1 && watchRunning[0] == 0 ){
    return
  } 

  // save start time
  T[id].timerStarted = new Date().getTime()
  console.log('T['+String(id)+'].timerStarted: '+T[id].timerStarted)
  watchRunning[id]=1;

  if (T[id].difference > 0) {
    T[id].timerStarted = T[id].timerStarted - T[id].difference
  }
  // update timer periodically
  T[id].timerInterval = setInterval(function() {
    displayTimer(id);

    //Update Difference Watch only when exactly one Timer is running
    if(watchRunning[0]^watchRunning[1] === 1) //XOR will be 1 only when exactly one watch is running
      updateDifference();
  }, 10);

  // show / hide the relevant buttons:
  document.querySelectorAll('.watch'+String(id+1)+' #go')[0].style.display="none";
  document.querySelectorAll('.watch'+String(id+1)+' #stop')[0].style.display="inline";
  document.querySelectorAll('.watch'+String(id+1)+' #clear')[0].style.display="none";
}

function stopTimer(id) {
  clearInterval(T[id].timerInterval); // stop updating the timer
  watchRunning[id] = 0;

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
  updateAverage(cnt);        
}

//updating average when plus or minus  button is pressed
function updateAverage(cnt){
  var minutes='00',seconds='00',time='';
  if(cnt==0){
    runningAverage=0;
    document.getElementById('Average time').innerHTML="Average time/per problem(in minutes): 0";
  }
  else{
    timeNow = new Date().getTime();
    difference =timeNow-T[2].timerStarted;  //Updating the runningAverage using "current_timestamp - previous timestamp(T[2].timerStarted)"
    Totaltime = runningAverage * (cnt-1);   
    Totaltime +=difference;
    runningAverage = Totaltime/(cnt);
    T[2].timerStarted =timeNow;
    // seconds
    if(runningAverage > 1000) {
      seconds = Math.floor(runningAverage / 1000);
      if (seconds >= 60) {
        seconds = seconds % 60;
      }
      if(seconds < 10) {
        seconds = '0'+String(seconds);
      }
    }
    
    // minutes
    if(runningAverage > 60000) {
      minutes = Math.floor(runningAverage/60000);
      if(minutes < 10) {
        minutes = '0'+String(minutes);
      }
    }

    time=minutes+':';
    time+=seconds;
    document.getElementById('Average time').innerHTML="Average time/per problem(in minutes): "+time;
  }

}

function prb_minus()
{
  var x = document.getElementById('prb_count').innerHTML.split(": ");
  var cnt=Number(x[x.length-1])-1;
  if(cnt<0) cnt=0;
  document.getElementById('prb_count').innerHTML="Problems Count: "+cnt.toString();
}

function record()
{
  if(!isrunningAverage){        //Averagetime counter is turned on we update previous timestamp,along with the difference from previous session"
    T[2].timerStarted= new Date().getTime();
    if(T[2].difference>0)T[2].timerStarted=T[2].timerStarted-T[2].difference;
    document.getElementById('record').style.background='blue';    //Color introduced so user can realise that the timer is running
  }
  else{        //Average time counter turned off 
    T[2].difference = new Date().getTime() - T[2].timerStarted;
    document.getElementById('record').style.background='white';
  }
  isrunningAverage ^= true;    //switching the bool variable to indicate whether timer is running or not
}

function rst()
{
  document.getElementById('prb_count').innerHTML="Problems Count: 0";
  document.getElementById('Average time').innerHTML="Average time/per problem(in minutes): 0";
  isrunningAverage =false;
  T[2].difference =0;
  runningAverage =0;
  document.getElementById('record').style.background='white';
}
