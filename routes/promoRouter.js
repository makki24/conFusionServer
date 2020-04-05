const express = require('express');
const bodyParser= require('body-parser');
const authenticate =require('../authenticate');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
const promotions= require('../models/promotion');
const cors= require('./cors');


promoRouter.route('/')
.options(cors.corsWithOptions,(req,res)=> res.statusCode=200)
.get(cors.cors,(req,res,next) =>
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
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
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
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode=403;
    res.end('PUT method is not supported');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
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
    .options(cors.corsWithOptions,(req,res)=> res.statusCode=200)
.get(cors.cors,(req,res,next) =>
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
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    res.statusCode=403
    res.end('post operation not supported '+ req.params.promoId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    promotions.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true})
        .then((promotion) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion);
        })
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
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