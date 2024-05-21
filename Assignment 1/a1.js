/*********************************************************************************
*  WEB700 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Kwame Twum Asamoah Boateng
*  Student ID: 144522224  
*  Date: May 19th 2024
*
********************************************************************************/ 

var serverVerbs = [
    'GET', 'GET','GET',
    'POST','GET','POST'
    ];
var serverPaths = [
    '/', '/about','/contact',
    '/login', '/panel', '/logout'
    ];
var serverResponses = [
    'Welcome to WEB 700 Assignment 1',
    'This course name is WEB700. This Assignment was prepared by Kwame Asamoah Boateng',
    'ktasamooah-boateng@myseneca.ca Kwame Asamoah Boateng. ',
    'Hello, User Logged in',
    'Main Panel',
    'Logout Complete. Goodbye'
    ];

// get randomw integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
// function with indexOF
function httpRequest(httpVerb, path) {
    var pathIndex = serverPaths.indexOf(path);
   if (serverVerbs[pathIndex] === httpVerb) {
        return ('200: ' + serverResponses[pathIndex]);
    }
    return ('404: Unable to process '+ httpVerb + ' request for '+ path );
}

// manual testing
console.log("==Starting Manual Testing===")
console.log(httpRequest('GET', '/'));
console.log(httpRequest('GET', '/about'));
console.log(httpRequest('GET', '/contact'));
console.log(httpRequest('PUT', '/'));

// automated testing 
function automateTests() {
    //randomIndex = getRandomInt(serverVerbs.length);
    
    var testVerbs = ['GET', 'POST'];
    var testPaths = [ '/', '/about', '/contact', '/login', '/panel', 'logout', '/randomPath1', '/randomPath2'];
    
    function randomRequest() {
        var randVerb = testVerbs[getRandomInt(testVerbs.length)];
        var randPath = testPaths[getRandomInt(testPaths.length)];
        
        console.log(httpRequest(randVerb, randPath));
    }
    
    setInterval(randomRequest, 1000);
}

// manual testing
console.log("\n==Starting Automated Testing===")
automateTests();
