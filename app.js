const express = require('express');
const cors=require('cors');
const app = express();
app.use (express.json());
app.use(cors());
const port = 3000;
const sql=require('mysql');
const db=sql.createConnection({
    host:'localhost',
    user:'root',
    password:'2319',
    database:'tasksDatabase'
});
const getSql='SELECT * FROM tasks';
const postSql='INSERT INTO tasks SET ?';
const deleteSql='DELETE FROM tasks where id=?';
const updateSql='UPDATE tasks SET ? where id=?';
db.connect((error)=>{
    if(error) return console.log('Databse error');
    console.log('Databse active');
});

app.get('/getTasks',(req,res)=>{
    db.query(getSql,(error,result)=>{
        if(error){
            console.log('/Get error');
            res.status(404).send('Server error');
            return;
        }
        res.status(200).send(result);
    });
});

app.post('/addTask',(req,res)=>{
    console.log(req.body);
    const taskData = {
        id: req.body.id,
        head: req.body.head,
        description: req.body.description,
        creation_date: JSON.stringify(req.body.creation_date), 
        status: req.body.status
    };
    db.query(postSql,taskData,(error,result)=>{
        if(error){
            console.log(error);
            return res.status(500).send('Server error');
        }
        console.log(result);
        res.status(200).send("Task added");
    })
})

app.delete('/deleteTask/:id',(req,res)=>{
    db.query(deleteSql,req.params.id,(error,result)=>{
        if(error){
            console.log("Server error");
            return res.status(500).send('Internal error');
        }
        console.log(result);
        return res.status(200).send('Task deleted');
    });
});

app.patch('/updatetask/:id',(req,res)=>{
    db.query(updateSql,[req.body,req.params.id],(error,result)=>{
        if(error){
            console.log('Server error');
            return res.status(500).send('Server error');
        }
        console.log(result);
        return res.status(200).send('Task updated');
    });
});
app.listen(port, () => console.log(`App active on: ${port}`));