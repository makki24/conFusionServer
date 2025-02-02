const express = require('express');
const bodyParser= require('body-parser');
var authenticate =require('../authenticate');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());
const leaders = require('../models/leaders');
const cors= require('./cors');

leaderRouter.route('/')
.options(cors.corsWithOptions,(req,res)=> res.statusCode=200)
.get(cors.cors,(req,res,next) =>
{
    leaders.find({})
        .then((leaders) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        },(err)=>next(err))
        .catch(err=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    leaders.create(req.body)
        .then((leader) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
            console.log('Leader created ',leader);
        },(err)=>next(err))
        .catch((err)=>next(err));
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    res.statusCode=403;
    res.end('PUT method is not supported');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    leaders.remove({})
        .then((resp)=>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
            console.log('Response is ',resp);
        },(err)=>next(err))
        .catch((err)=>next(err));
});

leaderRouter.route('/:leaderId/')
    .options(cors.corsWithOptions,(req,res)=> res.statusCode=200)
.get(cors.cors,(req,res,next) =>
{
    leaders.findById(req.params.leaderId,)
        .then((leader) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err)=>next(err))
        .catch((err)=>next(err));
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    res.statusCode=403
    res.end('post operation not supported '+ req.params.leaderId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
   leaders.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true})
       .then((leader)=>
       {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err)=>next(err))
        .catch((err)=>next(err));
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
{
    leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) =>
        {
            res.statusCode=200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
            console.log('Response is ',resp);
        },(err)=>next(err))
        .catch((err)=>next(err));
});

module.exports=leaderRouter;