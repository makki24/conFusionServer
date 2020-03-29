const express = require('express');
const bodyParser= require('body-parser');

const promoRouter=express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will give you details of Promotions');
})
.post((req,res,next) =>{
    res.end('will update the promotino with name '+ req.body.name+' and details '+req.body.description);
})
.put((req,res,next) =>{
    res.statusCode=403;
    res.end('PUT method is not supported');
})
.delete((req,res,next) =>{
    res.end('deleting all the promotions');
});

promoRouter.route('/:promoId/')
.all((req,res,next)=>
{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send you details of promotions with '+ req.params.promoId +'to you');
})
.post((req,res,next) =>{
    res.statusCode=403
    res.end('post operation not supported '+ req.params.promoId);
})
.put((req,res,next) =>{
    res.write('updating the promotions with id : '+req.params.promoId+'\n');
    res.end('will update the promotions with '+ req.body.name +' and description    '+req.body.description);
})
.delete((req,res,next) =>{
    res.end('deleting promotions with Id '+ req.params.promoId);
});

module.exports=promoRouter;