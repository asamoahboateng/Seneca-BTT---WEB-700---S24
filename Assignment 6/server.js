/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: KWAME TWUM ASAMOAH BOATENG Student .ID: 144522224 .Date: July 30th 2024
*
* HEROKU LINK : https://ktasamoah-boateng-assignment6.vercel.app/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require('express');
var exphbs = require('express-handlebars');
var dataCollection = require('./modules/collegeData');
var path = require('path');

var app = express();


// include handlebar 

app.engine('.hbs', exphbs.engine({  
    extname: '.hbs' ,
    helpers: {
        // navigation helper function
        navLink: function( url , options) {
            return '<li' +
            ((url == app.locals.activeRoute)? ' class="nav-item active" ': ' class="nav-item" ' )+
            '><a class="nav-link" href="' + url + '">'+ options.fn(this) + '</a></li>';
        },
        // equal helper function
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebar Helper equal needs 2 parameter");
            if (lvalue != rvalue) {
                return options.inverse(this);
            }
            else {
                return options.fn(this);
            }
        }
    }

}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));

// routing public files
// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

// body-parser middleware
app.use(express.urlencoded({ extended: true }));


// middleware for active navbar
app.use(function(req,res,next){ 
    let route = req.path.substring(1); 
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));     
    next(); 
});


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
        function(student_results) {
            if (student_results.length > 0){
                res.render('students', { students: student_results, layout: "main" });
            }
            else {
                res.render('students', { message: 'no results', layout: "main" }) ;
            }
            
        }
        // (student_results) =>res.render('students', { students: student_results, layout: "main" })   
    )
    .catch(
        () =>res.render('students', { message: 'no results', layout: "main" })  
    );
});


// GET /tas
// app.get("/tas", (req,res)=> {

//     dataCollection.getTAs()
//     .then(
//         (tas_data) => res.send(tas_data) 
//     )
//     .catch(
//         () => res.send({
//             'message': "no results"
//         })
//     );
// });

// GET /courses
app.get("/courses", (req,res)=> {

    dataCollection.getCourses()
    .then(
        // (course_data) => res.send(course_data) 
        function(course_data) {
            if (course_data.length > 0){
                res.render('courses', { courses: course_data, layout: "main" }) 
            }
            else {
                res.render('courses', { message: 'no results', layout: "main" })
            }
            
        }
    )
    .catch(
        () =>res.render('courses', { message: 'no results', layout: "main" })  
    );
});

//Get /course/courseId
app.get("/course/:id", (req,res)=> {
    const courseNo = req.params.id;
    dataCollection.getCourseById(courseNo)
    .then(
        function(course_data) {
            // console.log(course_data);
            res.render('course',{ course: course_data[0] , layout: "main" });
        }
    )
    .catch(
        () =>{ res.render('course', { message: 'query returned 0 results', layout: "main" }) }
    );
});

// GET /student/num
app.get("/student/:num", (req,res)=> {

    let viewData = {};
    const studentNo = req.params.num;

    dataCollection.getStudentByNum(studentNo) 
    .then((student_data) => {
        if (student_data) {
            viewData.student = student_data[0];
        } else {
            viewData.student = null;
        }
    })
    .catch(
        () =>{
            // res.render('student', { message : 'no results', layout: "main" })   
            viewData.student = null;
        }
    )
    .then(dataCollection.getCourses)
    .then((courseData) => {
        viewData.courses = courseData;

        for (let i=0; i < viewData.courses.length; i++) {
            if (viewData.courses[i].courseId == viewData.student.course) {
                viewData.courses[i]['selected'] = true;
                // break;
            }
        }
    })
    .catch(() => { viewData.courses = [] })
    .then(() => {
        if(viewData.student == null ){
            res.status(404).send('Student Not Found!');
        } else {
            res.render('student', {viewData: viewData, layout : "main"});
        }
    });
});

// delete course
app.get("/course/delete/:id", (req,res)=> {
    const courseNo = req.params.id;
    dataCollection.deleteCourse(courseNo)
    .then(
        // (course_data) => res.send(course_data) 
        (course_data) =>res.redirect('/courses')  
    )
    .catch(
        () =>res.render('course', { message: 'Unable to Remove Course / Course not found', layout: "main" }) 
    );
});

//delete student
app.get("/student/delete/:studentNum", (req,res)=> {
    const student_no = req.params.id;
    dataCollection.deleteStudentByNum(student_no)
    .then(
        // (course_data) => res.send(course_data) 
        (course_data) =>res.redirect('/students')  
    )
    .catch(
        () =>res.render('course', { message: 'Unable to Remove Student / Student not found', layout: "main" }) 
    );
});

app.get("/students/add", (req,res)=> {
    dataCollection.getCourses()
    .then(
        function(course_data) {
            res.render('addStudent', {courses: course_data, layout: "main"})
        }
    )
    .catch(
        ()=>res.render('addStudent', { layout: "main" }) 
    )
});

// routing to html pages
app.get("*", (req, res) => {
    const page_path = req.path;

    switch(page_path) {
        case '/':
            res.render('home', { layout: "main" });        
            break;
        case '/home':
            res.render('home', { layout: "main" });        
            break;
        case '/about':
            res.render('about', { layout: "main" });  
            break;
        case '/htmlDemo':
            res.render('htmlDemo', { layout: "main" });  
            break;
        case '/htmldemo':
            res.render('htmlDemo', { layout: "main" }); 
            break;
        case '/courses/add':
            res.render('addCourse', { layout: 'main' });
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
    )
    .catch(
        ()=>res.render('students', { layout: "main" }) 
    );
});

// creating course
app.post("/courses/add", (req, res) => {
    dataCollection.addCourse(req.body) 
    .then(
        () => res.redirect('/courses')
    )
    .catch(
        ()=>res.render('courses', { layout: "main" }) 
    );
});

//updating the form
app.post("/students/update", (req, res) => { 
    console.log(req.body); 
    // res.redirect("/students"); 
    dataCollection.updateStudent(req.body) 
    .then(
        () => res.redirect('/students')
    )
    .catch(
        ()=>res.render('students', { layout: "main" }) 
    );
});

// updating course
app.post("/course/update", (req, res) => {
    dataCollection.updateCourse(req.body) 
    .then(
        () => res.redirect('/courses')
    )
    .catch(
        ()=>res.render('courses', { layout: "main" }) 
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
