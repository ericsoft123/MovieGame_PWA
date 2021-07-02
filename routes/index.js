const express=require('express');

Router=express.Router();
GameController=require("../Controllers/GameControllers");

Router.get('/',GameController.GameController);
module.exports=Router;