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

connection.connect(function (err) {
    if (err) throw err;

    console.log(`Connected as ID ${connection.threadId}`);

    chooseTask();
});

function chooseTask() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do on employee database?",
            choices: [
                "View departments",
                "View roles",
                "View employees",
                "Add department",
                "Add role",
                "Add employee",
                "Update employee role",
                "Quit"
            ],
            name: "question"
        }
    ]).then(response => {
        switch (response.question) {
            case "View departments":
                // code block
                viewDepartment();
                break;
            case "View roles":
                // code block
                viewRole();
                break;
            case "View employees":
                // code block
                viewEmployee();
                break;
            case "Add department":
                // code block
                addDepartment();
                break;
            case "Add role":
                // code block
                addRole();
                break;
            case "Add employee":
                // code block
                addEmployee();
                break;
            case "Update employee role":
                updateEmployeeRole();
                break;
            default:
                return quit();
        }

    })
}

function viewDepartment() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        chooseTask();
    })
}

function viewRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        chooseTask();
    })
}

function viewEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        chooseTask();
    })
}

function addDepartment() {
    inquirer.prompt({

        type: "input",
        message: "What is the name of the department?",
        name: "deptName"

    }).then(function (answer) {
        connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptName], function (err, res) {
            if (err) throw err;
            console.log(res)
            chooseTask();
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the role name.",
            name: "roleName"
        },
        {
            type: "input",
            message: "Enter the salary for the role.",
            name: "salaryTotal"
        },
        {
            type: "input",
            message: "Enter the department id.",
            name: "deptId"
        }
    ])
        .then(function (answer) {
            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptId], function (err, res) {
                if (err) throw err;
                console.log(res);
                chooseTask();
            });
        });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "FirstName"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "LastName"
        },
        {
            type: "input",
            message: "What is the employee's role?",
            name: "roleId"
        },
        {
            type: "input",
            message: "Who is the employee's manager?",
            name: "managerId"
        }
    ])
        .then(function (answer) {
            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.FirstName, answer.LastName, answer.roleId, answer.managerId], function (err, res) {
                if (err) throw err;
                console.log(res);
                chooseTask();
            });
        });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "Which employee would you like to update?",
            name: "employeeUpdate"
        },

        {
            type: "input",
            message: "What do you want to update to?",
            name: "updateRole"
        }
    ])
        .then(function (answer) {
            connection.query('UPDATE employee SET role_id=? WHERE first_name= ?', [answer.updateRole, answer.employeeUpdate], function (err, res) {
                if (err) throw err;
                console.table(res);
                chooseTask();
            });
        });
}

function quit() {
    connection.end();
    process.exit();
};