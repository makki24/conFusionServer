var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

var users=require('../models/users');
router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next)
{
  res.send('respond with a resource');
});

router.post('/signup',(req,res,next) =>
{
  users.findOne({username:req.body.username})

      .then((user)  =>
      {
        if(user!=null)
        {
          var err =new Error('User already exist');
          err.status=403;
          next(err);
        }
        else
        {
          return(users.create({
            username: req.body.username,
            password: req.body.password
          }));
        }
      })
      .then((user) =>
      {
        res.statusCode=200;
        res.setHeader('content-type','applciation/json');
        res.json({status:'registration successfull',user:user});
      }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login',(req,res,next) =>
{
  if(!req.session.user)
  {
        var authHeader =req.headers.authorization;
        if(!authHeader)
        {
            var err =new Error("You are not authenticated");
            res.setHeader("WWW-Authenticate","Basic");
            err.status=401;
            next(err);
            return;
        }

        var autha = new Buffer.from(authHeader.split(" ")[1],"base64").toString().split(":");

        var username=autha[0],password=autha[1];

        users.findOne({username:username})
            .then((user) =>
            {
                if(username==null)
                {
                  var err =new Error("username "+username+" doesn't exist");
                  res.setHeader("WWW-Authenticate","Basic");
                  err.status =401;
                  return (next(err));
                }
                else if(user.password !==password)
                {
                   var err =new Error("username "+username+" doesn't exist");
                   err.status =401;
                   return (next(err));
                }
                else
                {
                  req.session.user='authenciated';
                  res.statusCode=200
                  res.setHeader('content-type','text/plain');
                  res.end('you are autheciated');
                }
            })
            .catch( err =>next(err))
  }
  else
  {
      res.statusCode=200
      res.setHeader('content-type','text/plain');
      res.end('you are already autheciated');
  }
});

router.get('/logout',(req,res,next) =>
{
    if(req.session.user)
    {
         req.session.destroy();
         res.clearCookie();
         res.redirect('/');
    }
    else
    {
        var err =new Error("you are not logged in");
        err.status=403;
        next(err);
    }
})


module.exports = router;

