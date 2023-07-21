const express = require('express');
const app =express();
const List =require('./database/models/list');
const Task =require('./database/models/task');

 const mongoose =require('./database/models/mongoose');
const { error } = require('console');
 
app.use(express.json());
 
app.use((req,res,next)=>{
    res.header("Acess-Control-Allowed-Method"," *");
    res.header("Acess-Control-Allowed-Methods","GET,POST,HEAD,OPTIONS,PUT,PATCH,DELETE");
    res.header("Acess-Control-Allowed-Headers","origin,X-Requested-With,Content-Type,Accept");
    next();

});
/**
 * CORS -cross origin Request security
 * localhost :3000-backend api
 * localhost:4200-frontend 
 */
/***** LIST URLS****** */

app.get('/lists',(req,res) =>{
List.find({})
.then(lists=>res.send(lists))
.catch((error)=>console.log(error));
}); 


app.post('/lists',(req,res)=>{
    (new List({'title':req.body.title}))
    .save()
    .then((list)=>res.send(list))
    .catch((error)=> console.log(error));
});


app.get('/lists/:listId',(req,res)=>{
    List.find({_id:req.params.listId})
    .then((list)=>res.send(list))
    .catch((error)=> console.log(error));
});
app.patch('/lists/:listId',(req,res)=>{
    List.findOneAndUpdate({_id:req.params.listId}, {$set:req.body})
    .then((list)=>res.send(list))
    .catch((error)=> console.log(error));
});
app.delete('/lists/listid',(req,res)=>{
    const deleteTasks =(list)=>{
        Task.deleteMany({_listId:list._id})
        .then(()=>list)
        .catch((error)=>console.log(error))
    };
    List.findByIdAndDelete(req.params.listId)
    .then((list)=>res.send(deleteTasks(list)))
    .catch((error)=> console.log(error));
     
});

/******
 * http://localhost:3000/lists/:listId/tasks/:taskId
 */
/*****TASK URLS****** */
app.get('lists/:listId/tasks',(req,res)=>{
    Task.find({_listId: req.params.listId})
    .then((tasks)=> res.send(tasks))
    .catch((error)=>console.log(error));
});

app.post('lists/:listId/tasks',(req,res)=>{
    (new Task({'title':req.params.title, '_listId':req.params.listId}))
    .save()
    .then((tasks)=> res.send(tasks))
    .catch((error)=>console.log(error));
});
app.get('lists/:listId/tasks/:taskId',(req,res)=>{
    Task.findOne({_listId: req.params.listId, _id:req.params.taskId})
    .then((tasks)=> res.send(tasks))
    .catch((error)=>console.log(error));
});
app.patch('lists/:listId/tasks/:taskId',(req,res)=>{
    Task.findOneAndUpdate({_listId: req.params.listId, _id:req.params.taskId},{$set:req.body})
    .then((tasks)=> res.send(tasks))
    .catch((error)=>console.log(error));
});
app.delete('lists/:listId/tasks/:taskId',(req,res)=>{
    Task.findOneAndDelete({_listId: req.params.listId, _id:req.params.taskId})
    .then((tasks)=> res.send(tasks))
    .catch((error)=>console.log(error));
});

app.listen( 3000, ()=>console.log("server  is connected on port 3000"));