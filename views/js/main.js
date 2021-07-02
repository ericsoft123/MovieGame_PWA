var movie_Qanswer;
var point=0;
var question=0;

var game_round=8;
const socket=io(`http://localhost:${Port}`);
socket.on("connected_user",data=>{//connected_user is event declared from backend, data is data linked to connected_user on backend
  
    var mydata_copy=[...data];//keep copy of my data
    
 
     mydata_copy.sort((a, b) => (a.point > b.point) ? -1 : 1);//sorting ascending order
   // mydata_copy.splice(mydata_copy.findIndex(data_del => data_del.userid === socket.id), 1);//this is to delete only this user to show other connected users
    var getconnected="";
    for(var i=0;i<mydata_copy.length;i++)
    {
        var isconnected=mydata_copy[i].userid===socket.id?'My Account':mydata_copy[i].userid+" Connected users";//check if user is owner then give him a name as My Account
        getconnected+=`<div class="form-group">
      

        <ul class="list-group">
  <li class="list-group-item active winnerlist">${isconnected} <span class="text-danger"></span></li>
  <li class="list-group-item text-success">Point:${mydata_copy[i].point}</li>
  <li class="list-group-item text-danger">Question Answered:${mydata_copy[i].question}</li>
 
</ul>
        </div>`;

    }
   

document.querySelector("#append_data").innerHTML=`${getconnected}`;



})
socket.on("counter_display",data=>{//display Time
    document.querySelector('.counter_display').innerText=data;
})
socket.on("game_over",data=>{//Display Result of the Game
    
document.querySelector('#append_data > div:nth-child(1) > ul > li.list-group-item.active > span').innerText="Winner";
document.querySelector('#append_data > div:nth-child(1) > ul > li.list-group-item.active.winnerlist').classList.add('winner-style');

document.getElementById('game_over').play();
document.querySelector('.counter_display').classList.add('d-none');
document.querySelector('#random_question').innerText='Game is Over !';
document.querySelector("#random_question").classList.add('text-danger');
document.querySelector('.play_again').classList.remove('d-none');//hide Question Forms
document.querySelector('.myrand_form_answer').classList.add('d-none');
})
socket.on("random_question",data=>{//event to Display Random Question
    if(question===game_round)// to check if round is 8, by default game_round is 8
    {
        //$("#random_question").text("game is over");//jquery version
        document.querySelector("#random_question").innerText="Game is over please wait Counter to be able to see The Winner";
        document.querySelector("#random_question").classList.add('game_over_font');
        document.querySelector('.guess_question').classList.add('d-none');//hide Question Forms
        document.querySelector('.myrand_form_answer').classList.add('d-none');//hide Question Forms
        
    }
    else{
//
try {
    document.querySelector("#random_question").innerText=data["title"];
   
    movie_Qanswer=data;
 

   randomize_year_form();
 } catch (error) {
     console.log(error);
 }
//
    }

 
})

 
function shufflearr() 
{
    var array=["(1994)", "(1972)", "(1974)", "(2008)", "(1957)", "(1993)", "(2003)", "(1966)", "(2001)", "(1999)", "(2010)", "(2002)", "(1980)", "(1990)", "(1975)", "(1954)", "(1995)", "(1997)", "(1991)", "(1946)", "(1977)", "(1998)", "(2019)", "(2014)", "(1962)", "(1985)", "(1936)", "(1960)", "(2000)", "(2020)", "(1931)", "(2006)", "(2011)", "(1988)", "(1968)", "(1942)", "(1979)", "(1981)", "(1940)", "(2012)", "(2018)", "(1950)", "(1964)", "(1984)", "(1986)", "(2016)", "(2017)", "(2009)", "(1963)", "(2007)", "(1983)", "(1992)", "(1958)", "(2004)", "(1941)", "(1987)", "(1948)"];

    var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
function randomize_year_form(){
    var arr = [3,2,4];
var year=shufflearr();
var newarr=[];
var year_random=[];

for (var i=0;i<arr[Math.floor(Math.random() * arr.length)]+1; i++) {
  
  newarr.push(year[arr[Math.floor(Math.random() * arr.length)]]);
  year_random.push(i);

}

qyear_append(newarr,year_random);
}
function qyear_append(newarr,year_random)
{
    newarr.splice(year_random[Math.floor(Math.random() * year_random.length)], 0,movie_Qanswer["year"]);


remove_duplicatearr_display(newarr);
    
}
function remove_duplicatearr_display(newarr){
   

var uniqueArray =[...new Set(newarr)];//pure javascript
console.log(uniqueArray);
var getdata="";
for(i=0;i<uniqueArray.length;i++)
{
    getdata+=`<div class="form-check">
    <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" onclick="return sendform('${uniqueArray[i]}')">
    <label class="form-check-label" for="exampleRadios2">
      ${uniqueArray[i]}
    </label>
    </div>`;
}


document.querySelector('.myrand_form_answer').innerHTML=getdata;


}

function sendform(answer){
  

//console.log(movie_Qanswer);
if(movie_Qanswer["year"]===answer)//Answering Question then win point
{
    point=point+5;
    
    question=question+1;
   
   
    socket.emit("update_competition",{"point":point},{"question":question});
    document.getElementById('win').play();//play Audio win
         
}
else{// loose point
    point=point-3;
   
    question=question+1;
    
    socket.emit("update_competition",{"point":point},{"question":question});
    console.log(point);
    document.getElementById('failure').play();//play Audio Failure
   
}

return false;
//
    
   
   
}
function play_again()
{
    window.location.reload();
}