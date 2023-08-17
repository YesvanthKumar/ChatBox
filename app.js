const express =require("express");
const path =require("path");
const app =express(); 
const http = require("http").Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const session = require('express-session');
const bodyParser =require('body-parser');

app.set("view engine","pug");

app.use(session({ 
    secret: 'session',
    resave: false,
    saveUninitialized: true
  }));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get('/',(req,res)=>{ 
    if (req.session.loggedIn) { 
        res.render('index',{
        name:req.session.userName});
    } else{
        res.sendFile('C:/xampp/htdocs/node/socket1/register.html');
    }
}) 
app.post('/',(req,res)=>{
    req.session.loggedIn = true;
    req.session.userName = req.body.name;
    res.redirect(301,'/');
})
app.use(express.static(path.join(__dirname,'assets')));

//Whenever someone connects this gets executed
io.on('connection', (socket)=>{ 
    console.log('Connected',socket.id);
    socket.on('adduser',(name)=>{
        socket.name = name;  
        console.log('Socket Id',socket.id)
    }) 
    socket.on('msgValue', (data) => { 
        console.log('Socket',socket); 
          io.sockets.emit('msgValueOn', {
            data: data,
            name: socket.name
          }); 
      });
      socket.on('disconnect', function () {
        console.log('A user disconnected');
     });
}); 

http.listen(5000,()=>{
    console.log("Server start : http://localhost:5000");
});