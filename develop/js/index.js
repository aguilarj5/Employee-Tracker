const cTable = require('console.table');
const questions = require('./questions');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
	{
		host: 'localhost',
		// MySQL username,
		user: 'root',
		// MySQL password
		password: '!SC30!',
		database: 'employees_db',
	},
	console.log(`Connected to the employees_db database.`)
);

function init() {
	inquirer.prompt(questions.startQ).then((startQ) => {
		let choice = startQ.choice;
		if (choice === 'Add Employee') {
			addEmployee();
		} else if (choice === 'Update Employee Role') {
			updateEmployeeRole();
		} else if (choice === 'View All Roles') {
			viewAllRoles();
		} else if (choice === 'Add Role') {
			addRole();
		} else if (choice === 'View All Departments') {
			viewAllDepartments();
		} else if (choice === 'Add Department') {
			addDepartment();
		} else if (choice === 'View All Employees') {
			viewAllEmployees();
		} else return console.log('Done.');
	});
}

function viewAllEmployees() {
	console.log('view all employees');

	// select employee.id, first_name, last_name, title, salary from employee, roles where employee.role_id = roles.id
}

function addEmployee() {
	db.query('SELECT * FROM roles', function (error, results) {
		if (error) {
			console.log(error);
		} else {
			//initializes list of choices
			let roleChoices = [];

			//creates the list of choices for inquirer to use
			for (let i = 0; i < results.length; i++) {
				roleChoices.push(results[i].title);
			}

			inquirer
				.prompt([
					{
						type: 'input',
						name: 'empFirst',
						message: `What is the employee's First Name?`,
					},
					{
						type: 'input',
						name: 'empLast',
						message: `What is the employee's Last Name?`,
					},
					{
						type: 'list',
						name: 'roleChoice',
						message: `What is the employee's role?`,
						choices: roleChoices,
					},
				])
				.then(function (response) {
					const role = results.find(
						(role) => role.title === response.roleChoice
					);

					db.query('SELECT * FROM employee', function (error, empResults) {
						if (error) {
							console.log(error);
						} else {
							//initializes list of choices
							let managerChoices = [];

							//creates the list of manager choices for inquirer to use
							for (let i = 0; i < empResults.length; i++) {
								managerChoices.push(empResults[i].first_name);
							}

							inquirer
								.prompt([
									{
										type: 'list',
										name: 'managerChoice',
										message: `Who is the employee's manager?`,
										choices: managerChoices,
									},
								])
								.then(function (manResponse) {
									//gets back manager OBJ from DB, ued for foreign key
									const manager = empResults.find(
										(man) => man.first_name === manResponse.managerChoice
									);

									//add new employee to DB
									db.query(
										`INSERT INTO employee SET ?`,
										{
											first_name: response.empFirst,
											last_name: response.empLast,
											role_id: role.id,
											manager_id: manager.id,
										},
										function (error) {
											if (error) {
												console.log(error);
											} else console.log('New Employee Added');
										}
									);
									//reverts back to start prompts
									init();
								});
						}
					});
				});
		}
	});
}

//function to UPDATE an employee role
function updateEmployeeRole() {
	console.log('update employee role');
	init();
}

//function to VIEW roles table
function viewAllRoles() {
	db.query('SELECT * FROM roles', function (error, results) {
		if (error) {
			console.log(error);
		} else {
			//initializes list of choices
			const table = cTable.getTable(results);
			console.log(table);
			init();
		}
	});
}

//function to ADD ROLE to roles table
function addRole() {
	db.query('SELECT * FROM department', function (error, results) {
		if (error) {
			console.log(error);
		} else {
			//initializes list of choices
			let choices = [];

			//creates the list of choices for inquirer to use
			for (let i = 0; i < results.length; i++) {
				choices.push(results[i].department_name);
			}

			inquirer
				.prompt([
					{
						type: 'input',
						name: 'roleTitle',
						message: 'What is the name of the role?',
					},
					{
						type: 'input',
						name: 'roleSalary',
						message: 'What is the salary of the role?',
					},
					{
						type: 'list',
						name: 'deptChoice',
						message: 'Which department does the role belong to?',
						choices: choices,
					},
				])
				.then(function (newRole) {
					const department = results.find(
						(dept) => dept.department_name === newRole.deptChoice
					);

					db.query(
						`INSERT INTO roles SET ?`,
						{
							title: newRole.roleTitle,
							salary: newRole.roleSalary,
							department_id: department.id,
						},
						function (error) {
							if (error) {
								console.log(error);
							} else console.log('New Role Added');
						}
					);

					//back to the main propmt
					init();
				});
		}
	});
}

//function to VIEW department table
function viewAllDepartments() {
	db.query('SELECT * FROM department', function (error, results) {
		if (error) {
			console.log(error);
		} else {
			//initializes list of choices
			const table = cTable.getTable(results);
			console.log(table);
			init();
		}
	});
}

//function to add to department table
function addDepartment() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'deptName',
				message: 'What is the name of the department?',
			},
		])
		.then(function (newDept) {
			db.query(
				`INSERT INTO department SET ?`,
				{
					department_name: newDept.deptName,
				},
				function (error) {
					if (error) {
						console.log(error);
					} else console.log('New Department Added');
				}
			);

			//back to the main prompt
			init();
		});
}

init();
