let express  = require("express");
let app      = express();
let mongoose = require("mongoose");
let user     = require("./model/User");
let bcrypt   = require("bcrypt");
let jwt      = require("jsonwebtoken");
let jwtSecrete = "huahuahuahuahuah ahauhahuahu";

app.use(express.urlencoded({extended:false}));
app.use(express.json());

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://127.0.0.1:27017/guiapics",{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        //console.log('connected to db')
    }).catch((err) => {
        console.log(err.message);
    });


let User = mongoose.model("User",user);

app.get("/",(req, res) => {
    res.json({});
})

app.post("/user", async(req, res) => {
    
    if (req.body.name == "" || req.body.email == "" || req.body.password == ""){
        res.sendStatus(400);
        return;
    }


    try {

        let user = await User.findOne({"email": req.body.email});   
        
        if (user != undefined){

            res.statusCode = 400;
            res.json({error: "E-mail já cadastrado"})

            return;
        }

        let password = req.body.password;
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(password,salt);

        let newUser = new User({name: req.body.name, email: req.body.email, password: hash});
        await newUser.save();
        res.json({email: req.body.email});        
    } catch (error) {
        res.sendStatus(500);
    }  
})

app.post("/auth", async(req, res) => {
    let {email, password} = req.body;

    let user = await User.findOne({"email": email});

    if (user == undefined){
        res.statusCode = 403;
        res.json({errors: {email:"E-mail não cadastrado"}});
        return;

    }

    let isPasswordRight = await bcrypt.compare(password,user.password);

    if (!isPasswordRight){
        res.statusCode = 403;
        res.json({errors: {password: "Senha incorreta" }});
        return;

    }

    jwt.sign({email, name: user.name, id: user._id}, jwtSecrete, {expiresIn:'48h'},(err, token) =>{
        if (err) {
            res.sendStatus(500);
            console.log(err);
        }else{
            res.json({token});
        }
    }) 

})

app.delete("/user/:email", async(req, res) => {
    await User.deleteOne({"email": req.params.email});
    res.sendStatus(200);
})



module.exports = app;