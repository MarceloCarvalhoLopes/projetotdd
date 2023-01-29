let express  = require("express");
let     app  = express();
let mongoose = require("mongoose");

app.use(express.urlencoded({extended:false}));
app.use(express.json());

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://0.0.0.0:27017/guiapics",{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connected to db')
    }).catch((err) => {
        console.log(err.message);
    });


app.get("/",(req, res) => {
    res.json({});
})

module.exports = app;