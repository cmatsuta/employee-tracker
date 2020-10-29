INSERT INTO department (name)
VALUES 
('Sales'),
('Accounting'),
('Administration'),
('Marketing');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Rep', 67000, 1),
('Sales Manager', 89000, 1),
('Accountant', 87000, 2),
('Receptionist', 47000, 3),
('Human Resource', 70000, 3),
('Marketing Manager',78000, 4);

INSERT INTO employee (first_name, last_name, role_id) 
VALUES
('John', 'Doe', 2),
('Mike', 'Chan', 1),
('Ashley', 'Rodriquez', 3),
('Kevin', 'Tupik', 4),
('Malia', 'Brown', 4),
('Sarah', 'Lourd', 5),
('Tom', 'Allen', 5),
('Christian', 'Eckenrode', 6);

Use employeeDB;
UPDATE employee SET manager_id = 2 Where id = 1;
UPDATE employee SET manager_id = 8 Where id = 6;
UPDATE employee SET manager_id = 8 Where id = 7;