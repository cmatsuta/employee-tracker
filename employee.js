var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeedb",
});

connection.connect(function (err){
    if(err) throw err;

    console.log(`Connected as ID ${connection.threadId}`);

    chooseTask();
});

function chooseTask(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do on employee database?",
            choices: ["view department", "view role", "view employee"],
            name: "question"
        }
    ]).then(response => {
        switch(response.question) {
            case "view department":
              // code block
              viewDepartment();
              break;
            case "view role":
              // code block
              break;
            case "view employee":
              // code block
              break;
            default:
              // code block
          }

    })
}

function viewDepartment(){
    connection.query("SELECT * FROM department", function(err,res){
        if(err) throw err;
        console.table(res);
    })
}
