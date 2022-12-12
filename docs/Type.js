if(!localStorage.getItem('uname')) window.location.href = './SignUp/';

const material = document.getElementById("textAndInput");
const greeting = document.getElementById("greeting");
const player = document.getElementById("playerContainer");
const playerBot = document.getElementById("playerContainerBot");
const completed = document.getElementById("completed");
const completedBot = document.getElementById("completedBot");
const playerWPM = document.getElementById("wpm");
const playerWPMBot = document.getElementById("wpmBot");
const raceInput = document.getElementById("inputBox");
const results = document.getElementById("resultDiv");
const font = document.getElementById("font");
const actualText = document.getElementById("actualText");
const characterElem = document.getElementById("currentChar");
const myName = localStorage.getItem("uname");
const firstName = myName?.slice(0, myName.indexOf(" ")!==-1?myName.indexOf(' '):myName.length);

let startMoments=4, haveMistaken=false, rank=1, minutes=1;
let allSeconds=0, slice="", isCompletedBot, fontIndex=0;
let count=0, index, raceInputLen=0, firstIM=0, fontSlice="";
let seconds=59, botAverage=40, isCompletedClient, count2=1;

document.querySelector("#uName").innerHTML = document.querySelector("#name").innerHTML = myName?myName:'User';
document.querySelector("#profPic").innerHTML = `<img src="${localStorage.getItem("picURL")}" height = "100%" width = "100%" alt="Wrong URL specified.">`;

const time = new Date().toLocaleTimeString().toUpperCase();
let hour = new Date().getHours();
if(hour > 12){
  hour-=12;
}
if(time.includes("PM")){
  if(hour < 4 || hour === 12){
    greeting.innerHTML = `Good AfterNoon, ${firstName?firstName:'User'} Sir`;
  }else if(hour < 8){
    greeting.innerHTML = `Good Evening, ${firstName?firstName:'User'} Sir`;
  }else{
    greeting.innerHTML = `Good Night, ${firstName?firstName:'User'} Sir`;
  }
}
if(time.includes("AM")){
  if(hour < 4){
    greeting.innerHTML = `Good Night, ${firstName?firstName:'User'} Sir`;
  }else{
    greeting.innerHTML = `Good Morning, ${firstName?firstName:'User'} Sir`;
  }
}

let averageAArr=[], sum=0, i;
function gettingItems(){
  sum=0
  averageAArr = JSON.parse(localStorage.getItem("everSpeed"));
  for(i=0; i<averageAArr.length; i++){
    sum = averageAArr[i]+sum;
  }
  document.querySelector("#averSpeedA").innerHTML = `${(sum / averageAArr.length).toString().slice(0, 6)} WPM`;
  sum=0;
  for(i=0; i<10; i++){
    if(averageAArr[i]){
      sum = averageAArr[i]+sum;
    }else{
      break;
    }
  }
  document.querySelector("#averSpeedL").innerHTML = `${(sum / i).toString().slice(0, 5)} WPM`;
  raceInput.disabled?botAverage = parseInt(sum / i):0;
  let bestWPM = 0;
  for(i=0; i<averageAArr.length; i++){
    if(averageAArr[i]>bestWPM){
      bestWPM=averageAArr[i];
    }
  }
  document.querySelector("#bestRace").innerHTML = `${bestWPM} WPM`;
  document.querySelector("#pracRaces").innerHTML = `${averageAArr.length}`;
}
if(JSON.parse(localStorage.getItem("everSpeed"))){
  gettingItems();
}

try{
  actualText.insertAdjacentHTML("beforeend", random());
}catch(err){
  location.reload();
}
characterElem.innerHTML = actualText.innerHTML[0];
actualText.innerHTML = actualText.innerHTML.replace(characterElem.innerHTML, "");
index = actualText.innerHTML.indexOf(" ");
fontIndex = font.innerHTML.lastIndexOf(" ");
fontSlice = font.innerHTML.slice(fontIndex+1, font.innerHTML.length)
slice = fontSlice + characterElem.innerHTML + actualText.innerHTML.slice(0, index+1);


const splittedAT = actualText.innerHTML.split(" ");
let maxlength = 0;
for(let i=0; i<splittedAT.length; i++){
  if(maxlength < splittedAT[i].length){
    maxlength = splittedAT[i].length;
  }
}
raceInput.setAttribute("maxlength", maxlength+5);

let mistakes=0, raceWPM, timeTaken, lastWPM, timeInterval, clientInterval, botInterval, botStopper;
function intervalFun(){
  timeInterval = setInterval(() => {
    if(seconds>9) document.querySelector("#timeDiv").innerHTML = `${minutes}:${seconds}`;
    else document.querySelector("#timeDiv").innerHTML = `${minutes}:0${seconds}`;

    seconds--;
    if(!minutes && seconds === -1){
      results.childNodes[1].childNodes[1].childNodes[4].insertAdjacentHTML('beforeend', `* &nbsp;Your score for the current race will not be saved since you haven't finished the race.`)
      clearInterval(timeInterval);
      clearInterval(botInterval);
      raceCompleted(raceWPM, timeTaken, mistakes, false);
    }
    if(seconds===-1){
      minutes--;
      seconds=59;
    }
    allSeconds++;
  }, 1000);

  clientInterval = setInterval(() => {
    raceWPM = Math.round((font.innerHTML.length / 5)/(allSeconds/60));
    playerWPM.innerHTML = `${raceWPM} WPM`;
    const fract = font.innerHTML.length/(font.innerHTML.length+actualText.innerHTML.length+characterElem.innerHTML.length);
    player.style.marginLeft = `calc(${fract*100}% - ${fract*Number(getComputedStyle(player).width.replace('px', ''))}px)`;
  }, 1000);

  botInterval = setInterval(() => {
    let randomWPM = parseInt(Math.random()*10);
    if(randomWPM > 3){
      if(randomWPM >= 5){
        if(randomWPM >= 8){
          randomWPM-=7;
        }else{
          randomWPM-=5;
        }
      }else{
        randomWPM-=2;
      }
    }
    let totWPM = randomWPM+botAverage
    if(lastWPM) (lastWPM-2) > totWPM?totWPM = lastWPM-1:0;
    playerWPMBot.innerHTML = `${totWPM} WPM`;
    const fract = (5*(totWPM)*allSeconds/60)/(font.innerHTML.length+actualText.innerHTML.length+characterElem.innerHTML.length);
    let progress = fract*100;

    try {
      prevProgress<progress?progress=prevProgress:0
    }catch(err){}

    let prevProgress = progress
    playerBot.style.marginLeft = `calc(${progress}% - ${fract*Number(getComputedStyle(playerBot).width.replace('px', ''))}px)`;
    lastWPM = totWPM;
    if(progress >= 89){
      playerBot.style.marginLeft = `calc(100% - ${Number(getComputedStyle(playerBot).width.replace('px', ''))})`;
      clearInterval(botInterval);
      if(rank === 1) completedBot.innerHTML = `1st Place!`;
      else if(rank !== 1){
        completedBot.innerHTML = `2nd Place!`;
        if(parseInt(playerWPMBot.innerHTML) > parseInt(playerWPM.innerHTMl)) playerWPMBot.innerHTML = playerWPM.innerHTML;
      }
      completedBot.style.visibility = "visible";
      rank++;
      isCompletedBot = true;
      if(isCompletedClient && isCompletedBot) clearInterval(timeInterval);
    }
  }, 1000);
}

const updateLocalStorage = () => {
  averageAArr.unshift(raceWPM);
  localStorage.setItem("everSpeed", JSON.stringify(averageAArr));
  gettingItems();
}

const raceCompleted = (wpm, time, typos, isCompleted) => {
  raceInput.removeEventListener("input", listenFun);
  clearInterval(clientInterval);
  if(isCompleted) player.style.marginLeft = `calc(100% - ${Number(getComputedStyle(player).width.replace('px', ''))}px)`;
  material.style.display = "none";
  results.style.display = "flex";
  playerWPM.innerHTML = `${wpm?wpm:0} WPM`;

  results.childNodes[1].childNodes[1].childNodes[1].innerHTML = `Speed: ${wpm?wpm:0} WPM`;
  const fullPercent = parseFloat(((font.innerHTML.length - typos) / font.innerHTML.length) * 100).toString();

  results.childNodes[1].childNodes[1].childNodes[3].innerHTML = `Time: ${time?time:'2:00'} min`;
  results.childNodes[1].childNodes[1].childNodes[2].innerHTML = `Accuracy: ${isNaN(fullPercent)?100:fullPercent.slice(0,4)}%`;

  if(isCompleted) updateLocalStorage();
  if(isCompletedClient && isCompletedBot) clearInterval(timeInterval);
}

const checkMistake = () => {
  if(realSlice === raceInput.value || raceInput.value === "" || raceInput.value === characterElem.innerHTML){
    characterElem.style.backgroundColor = "transparent";
    raceInput.style.backgroundColor = "white";
    characterElem.style.borderRight = "none";
    characterElem.style.borderLeft = "1px solid black";
    firstIM = 0;
    return false;
  }
  return true
}
const checkSpace = (smartened = false) => {
  if(smartened === false) raceInput.value = "";
  index = actualText.innerHTML.indexOf(" ");
  fontIndex = font.innerHTML.lastIndexOf(" ");
  fontSlice = font.innerHTML.slice(fontIndex+1, font.innerHTML.length)
  slice = fontSlice + characterElem.innerHTML + actualText.innerHTML.slice(0, index+1);
  if(index===-1) slice = fontSlice + characterElem.innerHTML + actualText.innerHTML;
}

function listenFun(){
  if(!actualText.innerHTML[0] && count !== 1 && !haveMistaken && raceInput.value[raceInput.value.length-1] === characterElem.innerHTML && raceInput.value === slice){
    if(rank === 1) completed.innerHTML = `1st Place!`
    else if(rank === 2) completed.innerHTML = `2nd Place!`;

    completed.style.visibility = "visible";
    rank++;

    if(59-seconds < 10) timeTaken = `${1-minutes}:0${59-seconds}`;
    else timeTaken = `${1-minutes}:${59-seconds}`;

    raceWPM = Math.round(((font.innerHTML.length+characterElem.innerHTML.length) / 5)/(allSeconds/60));
    isCompletedClient = true;
    raceCompleted(raceWPM, timeTaken, mistakes, true);
  }

  realSlice = slice.slice(0, raceInput.value.length)
  if(raceInput.value.length < raceInputLen){
    if(haveMistaken){
      if(characterElem.innerHTML.length !== 1){
        actualText.insertAdjacentHTML("afterbegin", characterElem.innerHTML[characterElem.innerHTML.length-1]);
        characterElem.innerHTML = characterElem.innerHTML.slice(0, characterElem.innerHTML.length-1);
      }
      if(actualText.innerHTML.indexOf(" ") === -1 && realSlice.length !== raceInput.value.length){
        characterElem.insertAdjacentHTML("beforeend", actualText.innerHTML[actualText.innerHTML.length-1])
        actualText.innerHTML = actualText.innerHTML.slice(0, actualText.innerHTML.length-1)
        count2 = 0
      }else if(count2 === 0){
        characterElem.insertAdjacentHTML("beforeend", actualText.innerHTML[actualText.innerHTML.length-1])
        actualText.innerHTML = actualText.innerHTML.slice(0, actualText.innerHTML.length-1)
        count2=1;
      }
      if((characterElem.innerHTML === raceInput.value) && characterElem.innerHTML.length !== 1){
        font.insertAdjacentHTML("beforeend", characterElem.innerHTML);
        characterElem.innerHTML = actualText.innerHTML[0];
        actualText.innerHTML = actualText.innerHTML.replace(actualText.innerHTML[0], "");
        raceInput.value = raceInput.value.replace(raceInput.value.slice(" ", raceInput.value.lastIndexOf(" "), raceInput.value.length), "");
        raceInput.value = raceInput.value.slice(1, raceInput.value.length);
      }else if((font.innerHTML.slice(fontIndex+1, font.innerHTML.length) + characterElem.innerHTML.slice(0, characterElem.innerHTML.length-1)) === raceInput.value && characterElem.innerHTML.length !== 1){
        font.insertAdjacentHTML("beforeend", characterElem.innerHTML.slice(0, characterElem.innerHTML.length-1))
        actualText.insertAdjacentHTML("afterbegin", characterElem.innerHTML[characterElem.innerHTML.length-1])
        characterElem.innerHTML = actualText.innerHTML[0]
        raceInput.value = raceInput.value.replace(raceInput.value.slice(" ", raceInput.value.lastIndexOf(" "), raceInput.value.length), "");
        raceInput.value = raceInput.value.slice(1,characterElem.innerHTML.length)
      }
      checkSpace(true)
    }else{
      actualText.innerHTML = characterElem.innerHTML + actualText.innerHTML;
      characterElem.innerHTML = font.innerHTML[font.innerHTML.length-1];
      font.innerHTML = font.innerHTML.slice(0, font.innerHTML.length-1);
    }
  }
  if(!actualText.innerHTML[0]) count++;

  realSlice = slice.slice(0, raceInput.value.length)
  haveMistaken = checkMistake()
  if((raceInput.value[raceInput.value.length-1] !== characterElem.innerHTML || haveMistaken)  && raceInput.value.length > raceInputLen){
    characterElem.style.backgroundColor = "rgb(255, 100, 100)";
    raceInput.style.backgroundColor = "rgb(255, 100, 100)";
    characterElem.style.borderRight = "1px solid black";
    characterElem.style.borderLeft = "none";
    if(firstIM && actualText.innerHTML[0]){
      characterElem.insertAdjacentHTML("beforeend", actualText.innerHTML[0]);
      actualText.innerHTML = actualText.innerHTML.replace(actualText.innerHTML[0], "");
    }
    firstIM++;
  }else if(raceInput.value.length > raceInputLen && actualText.innerHTML[0]){
    font.insertAdjacentHTML("beforeend", characterElem.innerHTML);
    characterElem.innerHTML = actualText.innerHTML[0];
    actualText.innerHTML = actualText.innerHTML.replace(actualText.innerHTML[0], "");
  }
  if(firstIM === 1 && haveMistaken) mistakes++;

  if(!haveMistaken && raceInput.value[raceInput.value.length-1] === " ") checkSpace(false)
  raceInputLen = raceInput.value.length;
}

raceInput.addEventListener("input", listenFun);

const startInterval = setInterval(() => {
  if(startMoments === -1){
    clearInterval(startInterval);
    document.querySelector("#startTime").style.display = "none";
    raceInput.disabled = false;
    raceInput.value = "";
    raceInput.focus();
    intervalFun();
  }
  document.querySelector("#actualStartTime").innerHTML = `:${startMoments}`;
  startMoments--;
}, 1000)