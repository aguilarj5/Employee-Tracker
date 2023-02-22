INSERT INTO department (id, department_name)
VALUES (001, "Sales"), 
       (002, "Marketing"),
       (003, "HR"),
       (004, "IT");

INSERT INTO roles (id, title, salary, department_id)
VALUES (001, "Sales Person", 65000, 001),
       (002, "Web Design", 55000, 002),
       (003, "HR Rep", 45000, 003),
       (004, "IT Tech", 52000, 004);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "Jon", "Snow", 001, 002),
       (002, "Jaime", "Lan", 003, 003),
       (003, "Lya", "Khan", 002, 004),
       (004, "Ryan", "Pratt", 004, 001);
