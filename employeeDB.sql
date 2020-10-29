Create database employeeDB;

Use employeeDB;

Create table department(
	id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
    );
    
Create table role(
	id  INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY(department_id) REFERENCES department(id),
    PRIMARY KEY(id)
    );

CREATE table employee(
	id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,
    foreign key(role_id) REFERENCES role(id),
    foreign key(manager_id) REFERENCES employee(id),
    PRIMARY KEY(id)
    );
    
    
    
    
    