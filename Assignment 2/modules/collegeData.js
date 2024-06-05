/**
 * This is a module file that has the Data class with information from the parameters
 * 
*/
class Data {
    
    // constructor function set to handle missing parameter
    constructor(students, courses) {
        this.fs = require('fs');
        this.studentPath = students;
        this.coursePath = courses;

        this.students;
        this.courses;
    };

    /**
	 * Initialize function
	 * 
	 * read contents of ./data/students.json and ./data/courses.json
     * 
     * it calls 2 functions to handle that
	 * returns a promise
	 */
    initialize() {
        var that = this;
        return new Promise(function(resolve, reject){
        try {
            that.fetchStudentData()
            .then(function(response){
                // console.log(response);
                that.fetchCoursesData()
                .then(
                    (e) => {
                        resolve();
                    }
                )
                .catch((e) => console.log(e));
            })
            .catch((e) => console.log(e));
            
        } catch (error) {
            reject('error initializing');
        }});
    }


    /** function to fetch the student data */
    fetchStudentData() {
        var that = this
        return new Promise(function(resolve, reject) {
            that.fs.readFile(that.studentPath, 'utf8', function(err, studentData) {
                if (err) {
                    reject('unable to read students.json');
                    return;
                }
                studentData = JSON.parse(studentData);
                that.students = studentData;
                resolve('Successfully read of students.json');
                return;
                
            });
        });
    }

    /** function to fetch the course data */
    fetchCoursesData() {
        var that = this
        return new Promise(function(resolve, reject) {
            that.fs.readFile(that.coursePath, 'utf8', function(err, courseData) {
                if (err) {
                    reject('unable to read courses.json');
                    return;
                }
                courseData = JSON.parse(courseData);
                that.courses = courseData;
                resolve('Successfully read of courses.json');
                return;
            });
        });
    }

    /**
	 * Function to get full array of students
	 * 
	 * returns a promise.
	 * if len = 0. Invoke rejjest method with message 'no result returned'.
	 */
    getAllStudents() {
        var that = this;
        
        return new Promise( function(resolve, reject) {
            let studentData =  that.students;

            if (studentData.length === 0) {
                reject('no results returned.');
                return
            }
            resolve(`Successfully retrieved ${studentData.length} students`);
            return;
        });
    }


    /**
	 * List of Courses
	 * 
	 * return promise with list
	 */
    getCourses() {
        var that = this;
        return new Promise( function(resolve, reject) {
            let courseData =  that.courses;

            if (courseData.length === 0) {
                reject('no results returned.');
                return
            }
            resolve(`Successfully retrieved ${courseData.length} courses`);
            return;
        });
    }

    /**
	 * student with TA property = true
	 * 
	 * return array
	 */
    getTAs() {
        var that = this;
        return new Promise( function(resolve, reject) {
            let studentData =  that.students;

            let studentTaData = studentData.filter( function(studentInfo) {

                return studentInfo = studentInfo.TA === true;
            } ); 

            if (studentTaData.length === 0) {
                reject('no results returned.');
                return
            }
            resolve(`Successfully retrieved ${studentTaData.length} TAs`);
            return;
        });
    }

}

module.exports = { Data };

// dataCollection = new Data('../data/students.json', '../data/courses.json');

