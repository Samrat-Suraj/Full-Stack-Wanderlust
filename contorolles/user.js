const User = require('../model/user.js');

module.exports.signupfrom = (req ,res)=>{
    res.render('users/signup.ejs')
}

module.exports.wanderlustSignup = async(req ,res)=>{
    try{
        let {username , email, password} = req.body;
        const newUser = new User({email,username})
    
        const registereduser = await User.register(newUser , password);
        req.login(registereduser ,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success' , 'Welcome To Wanderlust');
            res.redirect('/listings');
        })
    }
    catch(err){
        req.flash('error' , err.message);
        res.redirect('/signup');
    }
}

module.exports.loginForm = (req ,res)=>{
    res.render('users/login.ejs')
}

module.exports.wanderlustlogin = async(req ,res)=>{
    req.flash('success' , 'Welcome to WanderLust You Are logged in');
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl)
}

module.exports.wanderlustlogout = (req ,res ,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success' , "logout Successfully")
        res.redirect('/listings');
    })
}