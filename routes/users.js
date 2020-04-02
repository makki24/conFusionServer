var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

var users=require('../models/users');
var passport =require('passport');
var authenticate =require('../authenticate');

router.use(bodyParser.json());
/* GET users listing. */
/*router.get('/', function(req, res, next)
{
  res.send('respond with a resource');
});
*/
router.route('/')
    .get(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>
    {

        users.find()
            .then((users) =>
            {
                res.statusCode =200;
                res.setHeader('Content-Type','applciation/json');
                res.json(users);
            },err =>next(err))
            .catch(err=>next(err));
    /*     console.log(req.user.username);
       if(authenticate.verifyAdmin(req.user.username))
        {
            users.find({})
                .then((users) =>
                {
                    res.statusCode =200;
                    res.setHeader('Content-Type','application/json');
                    res.json(users);
                },err=>next(err))
                .catch((err) => next(err));
        }
        else
        {
            var err=new Error("Not an admin user");
            err.status=401;
            next(err);
        } */
    });

router.post('/signup',(req,res,next) =>
{
  users.register(new users({username:req.body.username}),req.body.password,(err,user) =>
  {
      if(err)
      {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
      }
      else
      {
           if(req.body.firstname)
                  user.firstname =req.body.firstname;
              if(req.body.lastname)
                  user.lastname =req.body.lastname;
              user.save((err,user) =>
              {
                  if(err)
                  {
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({err:err});
                      return;
                  }
              })
          passport.authenticate('local')(req,res,() =>
          {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Registration Successful!'});
           });

      }
  });
});

router.post('/login',passport.authenticate('local'),(req,res) =>
{
    var token = authenticate.getToken({_id:req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({token:token,success: true, status: 'You are successfully logged in!'});
});

router.get('/logout',(req,res,next) =>
{
    if(req.user)
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

