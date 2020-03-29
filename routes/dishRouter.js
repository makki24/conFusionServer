const express= require('express');
const bodyParser=require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());



dishRouter.route('/')
.all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will give you details of dishes');
})
.post((req,res,next) =>{
    res.end('will update the dish with'+ req.body.name+'and '+req.body.description);
})
.put((req,res,next) =>{
    res.statusCode=403;
    res.end('PUT method is not supported');
})
.delete((req,res,next) =>{
    res.end('deleting all the dishes');
});

dishRouter.route('/:dishId/')
.all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send you details of dishes '+ req.params.dishId +'to you');
})
.post((req,res,next) =>{
    res.statusCode=403
    res.end('post operation not supported '+ req.params.dishId);
})
.put((req,res,next) =>{
    res.write('updating the dish:'+req.params.dishId);
    res.end('will update the dish with '+ req.body.name +' and description'+req.body.description);
})
.delete((req,res,next) =>{
    res.end('deleting dish with Id '+ req.params.dishId);
});
module.exports =dishRouter;