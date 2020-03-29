const express = require('express');
const bodyParser= require('body-parser');

const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will give you details of leaders');
})
.post((req,res,next) =>{
    res.end('will update the leader with name '+ req.body.name+' and details '+req.body.description);
})
.put((req,res,next) =>{
    res.statusCode=403;
    res.end('PUT method is not supported');
})
.delete((req,res,next) =>{
    res.end('deleting all the leaders');
});

leaderRouter.route('/:leaderId/')
.all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send you details of leader with '+ req.params.leaderId +'to you');
})
.post((req,res,next) =>{
    res.statusCode=403
    res.end('post operation not supported '+ req.params.leaderId);
})
.put((req,res,next) =>{
    res.write('updating the leader with id : '+req.params.leaderId+'\n');
    res.end('will update the leader with '+ req.body.name +' and description    '+req.body.description);
})
.delete((req,res,next) =>{
    res.end('deleting leader with Id '+ req.params.leaderId);
});

module.exports=leaderRouter;