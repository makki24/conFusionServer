const express = require('express');
const bodyParser= require('body-parser');
const authenticate =require('../authenticate');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
const promotions= require('../models/promotion');


promoRouter.route('/')
.get((req,res,next) =>
{
    promotions.find({})
        .then((promotions) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promotions);
        },(err)=>next(err))
        .catch(err=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
   promotions.create(req.body)
       .then((promotion) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        },(err)=>next(err))
        .catch(err=>next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode=403;
    res.end('PUT method is not supported');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    promotions.remove({})
        .then((resp) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },(err)=>next(err))
        .catch(err=>next(err));
});

promoRouter.route('/:promoId/')
.get((req,res,next) =>
{
    promotions.findById(req.params.promoId)
        .then((promotion) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        },(err)=>next(err))
        .catch(err=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    res.statusCode=403
    res.end('post operation not supported '+ req.params.promoId);
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    promotions.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true})
        .then((promotion) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        })
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    promotions.findByIdAndRemove(req.params.promoId)
        .then((resp) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
            console.log('Response is ',resp);
        },(err)=>next(err))
        .catch((err)=>next(err));
});

module.exports=promoRouter;