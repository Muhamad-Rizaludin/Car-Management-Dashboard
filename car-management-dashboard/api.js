require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const session   = require('express-session');

const app       = express();
const PORT      = process.env.PORT || 5001;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/edit'));
app.use(express.static("uploads"));

//database connection
mongoose.connect(process.env.BASE_URL, {useNewUrlParser:true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Database Connected'));

//middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
    session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false
    })
);

app.use((req, res, next) =>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

//view engine
app.set('view engine','ejs');

//router prefix
app.use("", require("./routes/router"));

app.listen(PORT, () => {
    console.log(`Server runing in port http://localhost:${PORT}`);
})