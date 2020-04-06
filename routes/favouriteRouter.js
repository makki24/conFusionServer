const express = require('express');
const router =  express.Router();
const bodyParser =require('body-parser');
router.use(bodyParser.json());
const authenticate = require('../authenticate');
const faviourate =require('../models/favourite');
const Dishes =require('../models/dishes');

router.route('/')
    .all(authenticate.verifyUser)
    .get((req,res,next)=>
    {
        faviourate.findOne({user:req.user._id},(err,favi) =>
        {
            if(err)
                next(err);
            else
            {
                if(favi!==null)
                {
                    faviourate.findById(favi._id)
                        .populate('dishes')
                        .populate('user')
                        .then((favi) =>
                        {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favi)
                        });
                }
                else
                {
                     res.statusCode = 200;
                     res.setHeader('Content-Type', 'application/json');
                     res.json(null)
                }
            }
        });
    })
    .post((req,res,next) =>
    {
        faviourate.findOne({user:req.user._id},(err,favi) =>
        {
            if(favi===null)
            {
                var response={};
                response.user=req.user._id;
                var array =[];
                req.body.map((obj)=>
                {
                    array.push(obj._id);
                });
                response.dishes=array;
                faviourate.create(response)
                    .then((favs) =>
                    {
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(response);
                    },err=>next(err))
                    .catch(err=>next(err));
            }
            else
            {
                req.body.map((obj) =>
                {
                    if(!favi.dishes.some((item) => item.equals(obj._id)))
                        favi.dishes.push(obj._id);
                });
                favi.save()
                    .then((faviourate)=>
                    {
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(faviourate);
                    },err=>next(err))
                    .catch(err=>next(err));
            }
        });
    })
    .delete((req,res,next) =>
    {
        faviourate.findOne({user:req.user._id},(err,favi) =>
        {
            if(favi!==null)
            {
                faviourate.findByIdAndRemove(favi._id)
                    .then((resp) =>
                    {
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(resp);
                    })
            }
            else
            {
                var err =new Error("user doesn't have any faviourate")
                err.status=404;
                next(err);
            }
        });
    })

router.route('/:dishId')
    .all(authenticate.verifyUser)
    .post((req,res,next) =>
    {
        Dishes.findById(req.params.dishId)
            .then((dish) =>
            {
                if(dish!==null)
                {
                    faviourate.findOne({user:req.user._id})
                        .then((fav) =>
                        {
                            if(fav===null)
                            {
                                var response={};
                                response.user=req.user._id;
                                response.dishes=[];
                                response.dishes.push(req.params.dishId);
                                faviourate.create(response)
                                .then((favs) =>
                                {
                                    res.statusCode=200;
                                    res.setHeader('Content-Type','application/json');
                                    res.json(response);
                                },err=>next(err))
                                .catch(err=>next(err));
                            }
                            else if (!fav.dishes.some((item) => item.equals(req.params.dishId)))
                                fav.dishes.push(req.params.dishId);
                            if(fav!==null)
                            {
                                fav.save()
                                    .then((favi) =>
                                    {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favi);
                                    }, err => next(err))
                                    .catch(err => next(err));
                            }
                        },err=>next(err))
                            .catch(err=>next(err));
                }
                else
                {
                    var err=new Error('Dish not found');
                    err.status=404;
                    next(err);
                }
            },err=>next(err))
            .catch(err=>next(err));
    })
    .delete((req,res,next) =>
    {
        faviourate.findOne({user:req.user._id})
            .then((favi) =>
            {
                for(var i=0;i<favi.dishes.length;i++)
                    if(favi.dishes[i].equals(req.params.dishId))
                        favi.dishes.splice(i,1);

                favi.save()
                    .then((favi) =>
                    {
                        res.statusCode=200;
                        res.setHeader('Content-Type','application/json');
                        res.json(favi);
                    },err=>next(err))
            .catch(err=>next(err));
            },err=>next(err))
            .catch(err=>next(err));
    })

module.exports =router;