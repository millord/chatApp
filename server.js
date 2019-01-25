const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.Promise = Promise

var dbUrl = 'mongodb://messagesApp:Jabanico17@ds211635.mlab.com:11635/learning-node'


var Message = mongoose.model('Message', {
    name: String,
    message: String
})



app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages);

    })
    
})



app.post('/messages', async (req, res) => {
    try{
        
         var message = new  Message(req.body)
    
         var savedMessage = await message.save();
       
          console.log('saved');
          var censored = await Message.findOne({message:'badword'})
    
          if(censored)
                await Message.deleteOne({_id: censored.id})
            
          else
              io.emit('message', req.body);
              res.sendStatus(200); 

    } catch (error){
        res.sendStatus(500)
        return console.error(error);

    }finally{
        console.log('message post called');
    }
 

    
})
    


io.on('connection', (socket) => {
    console.log('a user connected...')
})


mongoose.connect(dbUrl, {useNewUrlParser: true},(err) => {
    console.log('Mongo db connection', err)
})


const server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
});