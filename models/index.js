// // const mysql = require("mysql");

// // const con = mysql.createConnection({
// //     host:'localhost',
// //     user:"root",
// //     password:"",
// //     database:"dbnew"
// // });
// // con.connect((err)=>{
// //     if(err){
// //         console.warn("error");
// //     }
// //     else{
// //         console.warn("connected");
// //     }
// // });

// // // con.query("select * from users",(err,result)=>{
// // //     console.warn("result",result);
// // // })
// // con.query("SELECT * FROM users", (err, result) => {
// //     if (err) {
// //         console.error("Error executing query:", err);
// //     } else {
// //         console.log("Result:", result);
// //     }
// // });


// const express = require('express');
// const con = require("./config");
// const app = express();
// app.use(express.json())
// app.get("/getuser",(req,res)=>{
//    // res.send("route done");
//    con.query("select * from users", (err,result) => {
//     if(err){
//         res.send("error");
//     }
//     else{
//         res.send(result);
//     }
//    });
// });

// app.get("/getuser/:id", (req,res)=>{
//     const userId = req.params.id;
//     con.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
//         if (err) {
//             //res.status(500).send("Error fetching user");
//             throw err;
//         } 
//         else
//         res.send(result[0]);
        
//     });
// })

// app.post("/createuser",(req,res) => {
//     //const data = {name:"bhasker",password:'3030',user_type:"visitor"};
//     const data = req.body;
//     con.query('Insert into users SET ?',data, (error,result,fields)=>{
//         if(error)  throw error;
//         res.send(result);
//     });
// });

// app.put("/updateuser/:id", (req,res) => {
//     //const data = ["tony",'0000',"reader",req.params.id]
//     const data = [req.body.name,req.body.password,req.body.user_type,req.params.id]
//     con.query("Update users SET name = ?, password = ?, user_type = ? where id = ?", data, (err,result,fields) => {
//         if(err)  throw err;
//         res.send(result);
//     });
//    // res.send("updated api working");
// });

// app.delete("/deleteuser/:id", (req,res) => {
//     con.query("Delete from users where id =" +req.params.id, (error,result)=>{
//     if(error) throw error;
//     res.send(result);
//     });
//    // res.send(req.params.id);
// });

// app.listen(5000);
  


const express = require('express');
const con = require("./config");
const app = express();
app.use(express.json())

const itemsPerPage = 5;

// app.get("/getuser", (req, res) => {
//     con.query("SELECT * FROM users", (err, result) => {
//         if (err) {
//             res.status(500).send("Error fetching users");
//         } else {
//             res.send(result);
//         }
//     });
// });

app.get("/getuser", (req, res) => {
    // Get the current page number from query parameters, default to page 1
    const page = parseInt(req.query.page) || 1;

    // Calculate the offset based on the current page and items per page
    const offset = (page - 1) * itemsPerPage;

    // Query to fetch a paginated list of users
    const query = "SELECT * FROM users LIMIT ? OFFSET ?";

    con.query(query, [itemsPerPage, offset], (err, result) => {
        if (err) {
            res.status(500).send("Error fetching users");
        } else {
            res.send(result);
        }
    });
});

app.get("/getuser/:id", (req, res) => {
    const userId = req.params.id;
    con.query("SELECT * FROM users WHERE id = ?", [userId], (err, result) => {
        if (err) {
            res.status(500).send("Error fetching user");
        } else {
            res.send(result[0]);
        }
    });
});

app.post("/createuser", (req, res) => {
    const data = req.body;
    con.query('INSERT IGNORE INTO users SET ?', data, (error, result, fields) => {
        if (error) {
            // Check for duplicate entry error (ER_DUP_ENTRY)
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).send("User with the same name already exists");
            }
            res.status(500).send("Error creating user");
        } else {
            res.send(result);
        }
    });
});

app.put("/updateuser/:id", (req, res) => {
    const data = [req.body.name, req.body.password, req.body.user_type, req.params.id];
    con.query("UPDATE users SET name = ?, password = ?, user_type = ? WHERE id = ?", data, (err, result, fields) => {
        if (err) {
            res.status(500).send("Error updating user");
        } else {
            res.send(result);
        }
    });
});

app.delete("/deleteuser/:id", (req, res) => {
    con.query("DELETE FROM users WHERE id = ?", [req.params.id], (error, result) => {
        if (error) {
            res.status(500).send("Error deleting user");
        } else {
            res.send(result);
        }
    });
});

app.get("/searchuser", (req, res) => {
    const searchTerm = req.query.name; // Assuming the client sends the name as a query parameter
    
    // Construct the SQL query to search for users by name
    const query = "SELECT * FROM users WHERE name LIKE ?"; // Using LIKE for partial matches
    
    // Execute the query with the search term as a parameter
    con.query(query, [`%${searchTerm}%`], (err, result) => {
        if (err) {
            res.status(500).send("Error searching for users");
        } else {
            res.send(result);
        }
    });
});

app.get("/sortuserbyname", (req, res) => {
    // Construct the SQL query to select and sort users by name
    const query = "SELECT * FROM users ORDER BY name ASC"; // ASC for ascending order, or DESC for descending order
    
    // Execute the query
    con.query(query, (err, result) => {
        if (err) {
            res.status(500).send("Error sorting users by name");
        } else {
            res.send(result);
        }
    });
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
