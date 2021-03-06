const express = require('express');
const app = express();
const cors = require("cors")
app.use(express.json())
app.use(cors())

// mysql connection
const mysql = require("mysql");
const mydatabase = mysql.createConnection({
    host       : 'localhost',
    user       : 'root',
    password   : '',
    database   : 'leadmanagement'
});
mydatabase.connect();


// employee Registration 
app.post("/register", function(req,res){
    var name       = req.body.uname;
    var password   = req.body.password;
    var mobile     = req.body.mobile;
    var email      = req.body.email;
    var sql = "insert into employee(name, password, mobile, email) values('"+name+"', '"+password+"', '"+mobile+"', '"+email+"')";
    mydatabase.query(sql, function(error, rows, fields){
        if(error) throw error
        res.send("Registration Successfull");
        res.end();
    })
})

// employee Login
app.post("/login", function(req,res){
    var password = req.body.password;
    var email    = req.body.email;
    var sql = "select * from employee where email='"+email +"' and password='"+password+"'";
    mydatabase.query(sql, function(error, rows, fields){
        if(error) throw error
            if(rows.length > 0){
                res.send(rows);
                res.end();
            } else{
                res.send({"id" : ""});
                res.end();
            }
    })
})

// get customer data by id
app.post("/customerdata", function(req,res){
    var empid = req.body.empid;
    var sql = "select * from customer where employee='"+empid+"' order by cid desc ";
    mydatabase.query(sql, function(error, rows,fields){
        if(error) throw error
        res.send(rows);
        res.end();
    })
  
})


// app.get("/customerdataget", function(req,res){
//     mydatabase.query('select * from customer', function(error, rows, fields){
//                 if(error) throw error
//             res.send(JSON.stringify(rows));
//             res.end()
//     })
  
// })


// app.get("/getdata", function(req,res){
//     var sql = "select * from customer order by cid desc";
//     mydatabase.query(sql, function(error, rows,fields){
//         if(error) throw error
//         res.send(rows);
//         res.end();
//     })
// })


// get customer data by cid (post method)
app.post("/getcustomerinfo", function(req,res){
    var cid = req.body.cid;
    mydatabase.query("select * from customer where cid='"+cid+"'", function(error, rows,fields){
        if(error) throw error
        res.send(JSON.stringify(rows));
        res.end();
    })
})



// post customer data to mysql along with employee id 
app.post("/savecustomerdata", function(req,res){
    var name        = req.body.cname;
    var location    = req.body.clocation;
    var mobile      = req.body.cmobile;
    var altmobile   = req.body.caltmobile;
    var email       = req.body.cemail;
    var university  = req.body.cuniversity;
    var course      = req.body.ccourse;
    var feedback    = req.body.cfeedback;
    var empid       = req.body.empid;
    var sql = "insert into customer(employee, name, location, mobile, altmobile, email, university, course, feedback ) values('"+empid+"', '"+name+"', '"+location+"', '"+mobile+"', '"+altmobile+"', '"+email+"', '"+university+"', '"+course+"', '"+feedback+"')";
    mydatabase.query(sql, function(error, rows, fields){
        if(error) throw error
        res.send("New customer data saved successfully");
        res.end()
    })
})

// //update feedback and followup date of customer using id
// app.post("/postfeedback", function(req,res){
//     var id          = req.body.cid;
//     var feedback    = req.body.cfeedback;
//     var newdate     = req.body.cfollowup
//     var empid       = req.body.empid;
//     var status      = req.body.cstatus;
//     var sql = "insert into feedback( cid, employee, feedback, followup, status ) values('"+id+"', '"+empid+"',  '"+feedback+"', '"+newdate+"', '"+status+"'  )"
//     mydatabase.query(sql, function(error, rows, fields){
//         if(error) throw error
//         res.send(" Feedback updated Successfully  !");
//         res.end();
//     })
// })


// // get feedback from feedback table
// app.get("/feedback", function(req, res){
//     var sql = "select customer.*, feedback.* from feedback,customer where feedback.cid=customer.cid order by feedbackid desc";
//     mydatabase.query(sql, function(error, rows, fields){
//         if(error) throw error
//         res.send(rows);
//         res.end();
//     })
// })


app.post("/postinterested", function(req,res){
    var name       =  req.body.cname;
    var mobile     =  req.body.cmobile;
    var altmobile  =  req.body.caltmobile;
    var email      =  req.body.cemail;
    var course     =  req.body.ccourse;
    var university =  req.body.cuniversity;
    var id          = req.body.cid;
    var feedback    = req.body.cfeedback;
    var empid       = req.body.empid;
    var newdate     = req.body.cfollowup
    var sql = "insert into interested(name, mobile, altmobile, email, course, university, cid, employee, feedback, followup ) values('"+name+"', '"+mobile+"', '"+altmobile+"', '"+email+"', '"+course+"', '"+university+"', '"+id+"', '"+empid+"',  '"+feedback+"', '"+newdate+"'  )";
    mydatabase.query(sql, function(error, rows, fields){
        var sql2 = "update customer set status = 'done' where cid='"+id+"'  ";
        mydatabase.query(sql2)
        mydatabase.query("delete from customer where cid='"+id+"';")
        if(error) throw error
        res.send(" Interested updated Successfully...  !");
        res.end();
      
    })
   
})

app.post("/postrnr", function(req,res){
    var id          = req.body.cid;
    var feedback    = req.body.cfeedback;
    var empid       = req.body.empid;
    var newdate     = req.body.cfollowup
    var sql ="insert into rnr(cid, employee, feedback, followup)values('"+id+"', '"+empid+"', '"+feedback+"', '"+newdate+"')";
    mydatabase.query(sql, function(error, rows, fields){
        var sql2 = "update customer set status = 'done' where cid='"+id+"'  ";
        mydatabase.query(sql2)
        mydatabase.query("delete from customer where cid='"+id+"';")
        if(error) throw error
        res.send(" RNR updated Successfully... !");
        res.end();
      
    })

})



app.post("/loginattendance", function(req,res){
    var empid = req.body.empid;
    var time  = req.body.time
    var sql="insert into attendance(employee , login) values('"+empid+"', '"+time+"')";
    mydatabase.query(sql, function(error, rows, fields){
        if(error) throw error
        res.send("Attendance Submitted.. !");
        res.end();
    })
});













app.listen(2222, function(){
    console.log("Server is running on port 2222")
})



