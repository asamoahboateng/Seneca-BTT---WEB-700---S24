/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: KWAME TWUM ASAMOAH BOATENG Student .ID: 144522224 .Date: July 12th 2024
*
********************************************************************************/

var HTTP_PORT = process.env.port || 8080;
var express = require('express');
var dataCollection = require('./modules/collegeData');
var path = require('path');

var app = express();


// GET Students
app.get("/students", (req,res)=> {
    // get course value 
    const course_id = req.query.course;
    if (course_id == undefined){
        get_function = dataCollection.getAllStudents();
    }
    else {
        get_function = dataCollection.getStudentsByCourse(course_id);
    }
    
    get_function.then(
        (student_results) => res.send(student_results) 
    )
    .catch(
        () => res.send({
            'message': "no results"
        })
    );
});


// GET /tas
app.get("/tas", (req,res)=> {

    dataCollection.getTAs()
    .then(
        (tas_data) => res.send(tas_data) 
    )
    .catch(
        () => res.send({
            'message': "no results"
        })
    );
});

// GET /courses
app.get("/courses", (req,res)=> {

    dataCollection.getCourses()
    .then(
        (course_data) => res.send(course_data) 
    )
    .catch(
        () => res.send({
            'message': "no results"
        })
    );
});

// GET /student/num
app.get("/student/:num", (req,res)=> {

    // get student number
    const studentNo = req.params.num;

    dataCollection.getStudentByNum(studentNo) 
    .then(
        (student_data) => res.send(student_data) 
    )
    .catch(
        () => res.send({
            'message': "no results"
        })
    );
});

// routing public files
app.use(express.static("public"));

// body-parser middleware
app.use(express.urlencoded({ extended: true }));

// routing to html pages
app.get("*", (req, res) => {
    const page_path = req.path;

    switch(page_path) {
        case '/':
            res.sendFile(path.join(__dirname,"/views/home.html"));
            break;
        case '/about':
            res.sendFile(path.join(__dirname,"/views/about.html"));
            break;
        case '/htmlDemo':
            res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
            break;
        case '/htmldemo':
            res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
            break;
        case '/students/add':
            res.sendFile(path.join(__dirname,"/views/addStudent.html"));
            break;
        default:
            res.sendFile(path.join(__dirname,"/views/404.html"));
            break;

    }
});

// posting form
app.post("/students/add", (req, res) => {
    dataCollection.addStudent(req.body) 
    .then(
        () => res.redirect('/students')
        // (studentCount) => res.send({ 'count' : studentCount})
    )
    .catch(
        () => res.send({
            'message': "Form not posted. You missed some inputs. Kindly Check and try again"
        })
    );
});

// setup http server to listen on HTTP_PORT
dataCollection.initialize()
.then(
    () => app.listen(HTTP_PORT, () => {console.log("server listening on port: " + HTTP_PORT)})
)
.catch(
    (err) => console.log(err) 
);
