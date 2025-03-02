var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
//console.log(__dirname);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
//app.use(express.json());
//app.use(express.urlencoded({extended:false}))

var messages=[/* {id:1,name:"Base",message:"base"} */];
io.on('connection',(socket)=>{
    console.log("connected on io");
});


app.post("/messages", (req,res)=>{
    console.log("entering post/messages");
    console.log(req.body);
    messages.push(req.body);
    io.emit('message',req.body);
    res.status(201);
    res.send("added");
});

app.delete("/messages",(req,res)=>{
    console.log("entering delete messages with req");
    console.log(req.body);
    //messages.splice(req.body.index-1,1);
    //messages = messages.filter(message=>message.id!=req.body.messageId);
    let removed = messages.splice(messages.findIndex(message=>message.id==req.body.messageId),1)[0];
    console.log(`removed this - ${JSON.stringify(removed)}`);
    //io.emit('getAllMessages');
    io.emit('deleteMessage',req.body.messageId);
    res.status(200);
    res.send({status:"deleted"});
})

app.get("/messages",(req,res)=>{
    console.log("entering get/messages");
    res.status(200);
    res.send(messages);
});

/* app.get("/next",(req,res,next)=>{
    console.log("entered /next");
    next();
},(req,resp)=>{
    resp.send("from next");
}
); */

/* app.get("/redirect",(req,res)=>{
    console.log("entering redirect");
    //res.status(200);
    res.redirect('https://www.google.co.in');
}); */

app.get("/error",(req,res)=>{
    //console.log("entering get/messages");
    //res.status(200);
    //res.send(messages);
    throw new Error();
})


app.use((err,req,resp,next)=>{
    console.error(err.stack);
    resp.status(500).send("Something wrong");
})

/* app.route("/routeChaining")
    .get((req,resp)=>{
        resp.send("from get/routeChaining");
    })
    .post((req,resp)=>{
        resp.send("from post/routeChaining");
    })
    .put((req,resp)=>{
        resp.send("from put/routeChaining");
    }); */

app.get("/messages/:name",(req,res)=>{
    console.log("entering get/messages/user");
    console.log(req.params.name);
    namedMessages = messages.filter(message=>message.name===req.params.name);
    /* if(namedMessages.length>0){
        res.status(200);
        res.send(namedMessages);
    }else{
        res.status(404);
        res.send("No Messages Found");  
    } */
    res.status(200);
    res.send(namedMessages);
})

var server = http.listen(3000,()=>{
    console.log("listening now on port "+server.address().port);
});

app.messages=messages;
module.exports = app;