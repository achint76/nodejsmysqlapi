// const mysql = require("mysql");

// const con = mysql.createConnection({
//     host:'localhost',
//     user:"root",
//     password:"",
//     database:"dbnew"
// });
// con.connect((err)=>{
//     if(err){
//         console.warn("error");
//     }
//     else{
//         console.warn("connected");
//     }
// });

// // con.query("select * from users",(err,result)=>{
// //     console.warn("result",result);
// // })
// con.query("SELECT * FROM users", (err, result) => {
//     if (err) {
//         console.error("Error executing query:", err);
//     } else {
//         console.log("Result:", result);
//     }
// });


const express = require('express');
const con = require("./config");
const app = express();
app.use(express.json())
app.get("/",(req,res)=>{
   // res.send("route done");
   con.query("select * from users", (err,result) => {
    if(err){
        res.send("error");
    }
    else{
        res.send(result);
    }
   });
});

app.post("/createuser",(req,res) => {
    //const data = {name:"bhasker",password:'3030',user_type:"visitor"};
    const data = req.body;
    con.query('Insert into users SET ?',data, (error,result,fields)=>{
        if(error)  throw error;
        res.send(result);
    });
});

app.put("/:id", (req,res) => {
    //const data = ["tony",'0000',"reader",req.params.id]
    const data = [req.body.name,req.body.password,req.body.user_type,req.params.id]
    con.query("Update users SET name = ?, password = ?, user_type = ? where id = ?", data, (err,result,fields) => {
        if(err)  throw err;
        res.send(result);
    });
   // res.send("updated api working");
});

app.delete("/:id", (req,res) => {
    con.query("Delete from users where id =" +req.params.id, (error,result)=>{
    if(error) throw error;
    res.send(result);
    });
   // res.send(req.params.id);
});

app.listen(5000);