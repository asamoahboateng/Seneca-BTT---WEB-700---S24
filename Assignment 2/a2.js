/*********************************************************************************
* WEB700 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: KWAME TWUM ASAMOAH BOATENG Student ID: 144522224 Date: 5/06/2026
*
********************************************************************************/

// require the module
const { Data } = require('./modules/collegeData');

// create an instance 
var data = new Data('./data/students.json', './data/courses.json')

// initiate function
data.initialize()

.then(
    function(initial_result) {
        // get the list of students
        return data.getAllStudents();
    }
)

.then(
    function(stud_results) {
        console.log(stud_results);

        //  get the list of courses
        return data.getCourses();
    }
)

.then(
    function(course_result) {
        console.log(course_result);

        //  get list of TAs
        return data.getTAs();
    }
)

.then(
    (ta_results) => console.log(ta_results)
)

.catch(
    (e)=> console.log(e)
);