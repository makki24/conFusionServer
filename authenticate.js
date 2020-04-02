var passport= require('passport');
var LocalStrategy =require('passport-local').Strategy;
var user= require('./models/users');
var JwtStrategy =require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt= require('jsonwebtoken');
var config =require('./config');

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

exports.getToken = function (user)
{
    return jwt.sign(user,config.secretKey,{expiresIn: 36000});
}

var opts ={};
opts.jwtFromRequest =ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,(jwt_payload,done)=>
{
    console.log("JWT payload ",jwt_payload);
    user.findOne({_id: jwt_payload._id},(err,user) =>
    {
        if(err)
        {
            return done(err,false);
        }
        else if (user)
        {
            return done(null,user);
        }
        else
        {
            return done(null, false);
        }
    });
}));


exports.verifyUser = passport.authenticate('jwt',{session:false});
/*
exports.jwtPassport = passport.use(new JwtStrategy(opts,(user,done) =>
{
    var err=new Error("not an bla bal admin user");
    if(user ==='admin')
        return done(null,true);
    else
        return done(err,false);
}));    */


exports.verifyAdmin=((req,res,next) =>
{
    console.log(req.user);
    if(req.user.admin)
    {
        next();
    }
    else
    {
        var err =new Error("you are not an admin");
        err.status =401;
        next(err);
    }
});
/*
exports.verifyAdmin= (user) =>
{
    if(user==='admin')
        return true;
    else
        return false;
} */