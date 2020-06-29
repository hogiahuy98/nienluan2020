const express = require('express');
const app     = express();
const bodyParser = require("body-parser");
const registration = require('./routes/registration.route');
const authentication = require('./routes/authentication.route');
const post = require('./routes/post.route');
const main = require('./routes/main.route');
const comment = require('./routes/comment.route');
const cookieParser = require('cookie-parser'); 
const middlewares = require('./middlewares/authentication.middlewares');
const server = require("http").Server(app);
const io = require("socket.io")(server);
// app.use(session({
//     store: new MongoStore({ url: "mongodb://localhost:27017/moment" })
// }));

app.use(function(req,res,next){
    req.io = io;
    next();
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('node_modules')); 
app.use(cookieParser('Heisenberg'));
app.use(middlewares.authCookie);

app.set('view engine', 'ejs');
app.set('views', "./views");



// app.use(middlewares.checkCookie);
app.use('/', registration);
app.use('/', authentication);
app.use('/', post);
app.use('/', main);
app.use('/', comment);
//Use API

app.get('/apitest', (req, res) => {
    res.send({hello: 'world', test: 'thanh cong', success: true});
})

app.get('/requestTest', (req, res) => {
    console.log(req.originalUrl.slice(1, req.originalUrl.length));
})



server.listen(3000, ()=>console.log("Khoi tao server thanh cong"));