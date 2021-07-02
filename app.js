

//
var express     = require('express');
var app         = express();
var http        = require('http').createServer(app);
var io          = require('socket.io')(http);
var path        = require('path');

const request=require('request');
const cheerio=require('cheerio');//web scraping
app.use(express.static(path.join(__dirname, "views")));
//

require('dotenv').config();



app.use('/',require('./routes'));
app.set('view engine','ejs');

const PORT =process.env.PORT;
http.listen(PORT,()=>{
    console.log("app is running");
})


//socket code

var competition=new Array();
var datetime=60;

const url="https://www.imdb.com/chart/top?ref_=nb_mv_3_chttp";
var arrFilm=[];
var question_answered=0;
var point=0;
request(url,function(error,response,html){
var $=cheerio.load(html);//cheerio has kind of jquery syntax





arrFilm = new Array();

$('.titleColumn').each(function(){//use cheerio library to get title and year
   
  var item={};
  item["title"]=$(this).children("a").text();
  item["year"]=$(this).children(".secondaryInfo").text();
 
  arrFilm.push(item);
  
 

})



});

io.on("connection",socket=>{

 connected_user();

   socket.on("update_competition",({point:point},{question:question})=>{
  
    var indexdata=competition.findIndex(search_userid => search_userid.userid === socket.id);
    competition[indexdata]["point"]=point;
    competition[indexdata]["question"]=question;
   // connected_user();
   io.emit("connected_user",competition);
   random_question();
    //random_question();
})

socket.on('disconnect', function () {
   //do stuff
   console.log(socket.id);
   competition.splice(competition.findIndex(del_user => del_user.userid === socket.id), 1);
});


function connected_user(){
   
  if(datetime>1)
  {
    
    var data_item={};
    data_item["userid"]=socket.id;
    
    
    data_item["question"]=question_answered;
    data_item["point"]=point;
     competition.push(data_item);
    
       io.emit("connected_user",competition);
     random_question();
    }
    else{
     
       
       
    }
 
}

function random_question(){
    randomQuestion=arrFilm[Math.floor(Math.random() * arrFilm.length)];//randomly
 
   socket.emit("random_question",randomQuestion);
}

})

function counter_display(datetime)
{
  io.emit("counter_display",datetime);
}
function gameover(){
  io.emit("game_over","Game Over");
}

setInterval(function() {
  datetime=datetime-1;
 
  if(datetime<=0)
  {
    gameover();
   
    datetime=60;
    
    
  }
  else{
    counter_display(datetime);
    
  }
}, 1000);
