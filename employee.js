var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');
const promisemysql = require("promise-mysql");

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
                "Update employee manager",
                "Delete employee",
                "Delete role",
                "Delete department",
                "View employees by manager",
                "View department budgets",
                "Quit"
            ],
            name: "question",
            pageSize: 14
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
            case "Update employee manager":
                updateManager();
                break;
            case "Delete employee":
                deleteEmployee();
                break;
            case "Delete role":
                deleteRole();
                break;
            case "Delete department":
                deleteDept();
                break;
            case "View all employees by manager":
                viewEmpByManager();
                break;
            case "View department budgets":
                viewDeptBudget();
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
    let employeeArray = [];
    let roleArray = [];

    // Create connection using promise-sql
    promisemysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employeedb"
    })
    .then((conn) => {
        return Promise.all([

            // query all roles and employee
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {

        // place all roles in array
        for (i=0; i < roles.length; i++){
            roleArray.push(roles[i].title);
        }

        // place all employees in array
        for (i=0; i < employees.length; i++){
            employeeArray.push(employees[i].Employee);
        }

        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([
            {
                // prompt user to select employee
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArray
            }, {
                // Select role to update employee
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArray
            },]).then((answer) => {

                let roleId;
                let employeeId;

                /// get Id of role selected
                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleId = roles[i].id;
                    }
                }

                // get Id of employee selected
                for (i=0; i < employees.length; i++){
                    if (answer.employee == employees[i].Employee){
                        employeeId = employees[i].id;
                    }
                }
                
                // update employee with new role
                connection.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`, (err, res) => {
                    if(err) return err;

                    // confirm update employee
                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    // back to main menu
                    chooseTask();
                });
            });
    });
    
}

// Update employee manager
function updateManager(){

    // set global array for employees
    let employeeArray = [];

    // Create connection using promise-sql
    promisemysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employeedb"
    })
    .then((conn) => {

        // query all employees
        return conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {

        // place employees in array
        for (i=0; i < employees.length; i++){
            employeeArray.push(employees[i].Employee);
        }

        return employees;
    }).then((employees) => {

        inquirer.prompt([
            {
                // prompt user to selected employee
                name: "employee",
                type: "list",
                message: "Which employee would you like to edit?",
                choices: employeeArray
            }, {
                // prompt user to select new manager
                name: "manager",
                type: "list",
                message: "Who is the new manager?",
                choices: employeeArray
            },]).then((answer) => {

                let employeeId;
                let managerId;

                // get ID of selected manager
                for (i=0; i < employees.length; i++){
                    if (answer.manager == employees[i].Employee){
                        managerId = employees[i].id;
                    }
                }

                // get ID of selected employee
                for (i=0; i < employees.length; i++){
                    if (answer.employee == employees[i].Employee){
                        employeeId = employees[i].id;
                    }
                }

                // update employee with manager ID
                connection.query(`UPDATE employee SET manager_id = ${managerId} WHERE id = ${employeeId}`, (err, res) => {
                    if(err) return err;

                    // confirm update employee
                    console.log(`\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`);

                    chooseTask();
                });
            });
    });
}

// View all employees by manager
function viewEmpByManager(){

    // set manager array
    let managerArray = [];

    // Create connection using promise-sql
    promisemysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employeedb",
    })
    .then((conn) => {

        // Query all employees
        return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id");

    }).then(function(managers){

        // place all employees in array
        for (i=0; i < managers.length; i++){
            managerArray.push(managers[i].manager);
        }

        return managers;
    }).then((managers) => {

        inquirer.prompt({

            // Prompt user of manager
            name: "manager",
            type: "list",
            message: "Which manager would you like to search?",
            choices: managerArray
        })    
        .then((answer) => {

            let managerId;

            // get ID of manager selected
            for (i=0; i < managers.length; i++){
                if (answer.manager == managers[i].manager){
                    managerId = managers[i].id;
                }
            }

            // query all employees by selected manager
            const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerId};`;
    
            connection.query(query, (err, res) => {
                if(err) return err;
                
                // display results with console.table
                console.log("\n");
                console.table(res);

                chooseTask();
            });
        });
    });
}


// View Department Budget
function viewDeptBudget(){

    // Create connection using promise-sql
    promisemysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employeedb"
    })
    .then((conn) => {
        return  Promise.all([

            // query all departments and salaries
            conn.query("SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department ASC"),
            conn.query('SELECT name FROM department ORDER BY name ASC')
        ]);
    }).then(([deptSalaries, departments]) => {
        
        let deptBudgetArray =[];
        let department;

        for (d=0; d < departments.length; d++){
            let departmentBudget = 0;

            // add all salaries together
            for (i=0; i < deptSalaries.length; i++){
                if (departments[d].name == deptSalaries[i].department){
                    departmentBudget += deptSalaries[i].salary;
                }
            }

            // create new property with budgets
            department = {
                Department: departments[d].name,
                Budget: departmentBudget
            }

            // add to array
            deptBudgetArray.push(department);
        }
        console.log("\n");

        // display departments budgets using console.table
        console.table(deptBudgetArray);

        chooseTask();
    });
}

// Delete employee
function deleteEmployee(){

    // Create global employee array
    let employeeArray = [];

    // Create connection using promise-sql
    promisemysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employeedb"
    }).then((conn) => {

        // Query all employees
        return  conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {

        // Place all employees in array
        for (i=0; i < employees.length; i++){
            employeeArray.push(employees[i].employee);
        }

        inquirer.prompt([
            {
                // prompt user of all employees
                name: "employee",
                type: "list",
                message: "Who would you like to delete?",
                choices: employeeArray
            }, {
                // confirm delete of employee
                name: "yesNo",
                type: "list",
                message: "Confirm deletion",
                choices: ["NO", "YES"]
            }]).then((answer) => {

                if(answer.yesNo == "YES"){
                    let employeeId;

                    // if confirmed, get ID of employee selected
                    for (i=0; i < employees.length; i++){
                        if (answer.employee == employees[i].employee){
                            employeeId = employees[i].id;
                        }
                    }
                    
                    // deleted selected employee
                    connection.query(`DELETE FROM employee WHERE id=${employeeId};`, (err, res) => {
                        if(err) return err;

                        // confirm deleted employee
                        console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);
                        
                        // back to top
                        chooseTask();
                    });
                } 
                else {
                    
                    // if not confirmed, go back to main menu
                    console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);

                    chooseTask();
                }
                
            });
    });
}

// Delete Role
function deleteRole(){

    // Create role array
    let roleArray = [];

    // Create connection using promise-sql
    promisemysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employeedb"
    }).then((conn) => {

        // query all roles
        return conn.query("SELECT id, title FROM role");
    }).then((roles) => {    

        // add all roles to array
        for (i=0; i < roles.length; i++){
            roleArray.push(roles[i].title);
        }

        inquirer.prompt([{
            // confirm to continue to select role to delete
            name: "continueDelete",
            type: "list",
            message: "* WARNING * Deleting role will delete all employees associated with the role. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            // if not, go back to the top
            if (answer.continueDelete === "NO") {
                chooseTask();
            }

        }).then(() => {

            inquirer.prompt([{
                // prompt user of of roles
                name: "role",
                type: "list",
                message: "Which role would you like to delete?",
                choices: roleArray
            }, {
                // confirm to delete role by typing role exactly
                name: "confirmDelete",
                type: "Input",
                message: "Enter the role title to confirm deletion of the role"

            }]).then((answer) => {

                if(answer.confirmDelete === answer.role){

                    // get role id of of selected role
                    let roleId;
                    for (i=0; i < roles.length; i++){
                        if (answer.role == roles[i].title){
                            roleId = roles[i].id;
                        }
                    }
                    
                    // delete role
                    connection.query(`DELETE FROM role WHERE id=${roleId};`, (err, res) => {
                        if(err) return err;

                        // confirm role has been added 
                        console.log(`\n ROLE '${answer.role}' DELETED...\n `);

                        //back to top
                        chooseTask();
                    });
                } 
                else {

                    // if not confirmed, do not delete
                    console.log(`\n ROLE '${answer.role}' NOT DELETED...\n `);

                    chooseTask();
                }
                
            });
        })
    });
}

// Delete Department
function deleteDept(){

    // department array
    let deptArray = [];

    // Create connection using promise-sql
    promisemysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "password",
        database: "employeedb"
    }).then((conn) => {

        // query all departments
        return conn.query("SELECT id, name FROM department");
    }).then((depts) => {

        // add all departments to array
        for (i=0; i < depts.length; i++){
            deptArray.push(depts[i].name);
        }

        inquirer.prompt([{

            // confirm to continue to select department to delete
            name: "continueDelete",
            type: "list",
            message: "* WARNING * Deleting a department will delete all roles and employees associated with the department. Do you want to continue?",
            choices: ["NO", "YES"]
        }]).then((answer) => {

            // if not, go back to top
            if (answer.continueDelete === "NO") {
                chooseTask();
            }

        }).then(() => {

            inquirer.prompt([{

                // prompt user to select department
                name: "dept",
                type: "list",
                message: "Which department would you like to delete?",
                choices: deptArray
            }, {

                // confirm with user to delete
                name: "confirmDelete",
                type: "Input",
                message: "Enter the department name to confirm deletion of the department: "

            }]).then((answer) => {

                if(answer.confirmDelete === answer.dept){

                    // if confirmed, get department id
                    let deptId;
                    for (i=0; i < depts.length; i++){
                        if (answer.dept == depts[i].name){
                            deptId = depts[i].id;
                        }
                    }
                    
                    // delete department
                    connection.query(`DELETE FROM department WHERE id=${deptId};`, (err, res) => {
                        if(err) return err;

                        // confirm department has been deleted
                        console.log(`\n DEPARTMENT '${answer.dept}' DELETED...\n `);

                        // back to top
                        chooseTask();
                    });
                } 
                else {

                    // do not delete department if not confirmed and go back to main menu
                    console.log(`\n DEPARTMENT '${answer.dept}' NOT DELETED...\n `);

                    chooseTask();
                }
                
            });
        })
    });
}

function quit() {
    connection.end();
    process.exit();
};