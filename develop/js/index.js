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

//will act as the main menu of this application
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
	db.query(
		`select first_name, last_name, title, department_name, salary
	from employee, roles, department
	where employee.role_id = roles.id and roles.id = department.id`,
		function (error, results) {
			if (error) {
				console.log(error);
			} else {
				db.query(
					`select b.first_name as Manager
					from employee a, employee b
					where b.manager_id = a.id
					order by a.id;`,
					function (error, results2) {
						if (error) {
							console.log(error);
						} else {
							const table = cTable.getTable(results);
							console.log(table);
							init();
						}
					}
				);
			}
		}
	);
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
											} else {
												//lets user know employee was added succesfully and goes back to main menu
												console.log('New Employee Added');
												init();
											}
										}
									);
									//reverts back to start prompts
								});
						}
					});
				});
		}
	});
}

//function to UPDATE an employee role
function updateEmployeeRole() {
	db.query('SELECT * FROM employee', function (error, results) {
		if (error) {
			console.log(error);
		} else {
			//initializes list of choices
			let choices = [];

			//creates the list of choices for inquirer to use
			for (let i = 0; i < results.length; i++) {
				choices.push(results[i].first_name);
			}

			//prompt for updating certain employee
			inquirer
				.prompt([
					{
						type: 'list',
						name: 'empChoice',
						message: `Which employee's role do you want to update?`,
						choices: choices,
					},
				])
				.then(function (employee) {
					//will get the employee object that was chosen
					const emp1 = results.find(
						(emp) => emp.first_name === employee.empChoice
					);

					//query to get all role objects
					db.query('SELECT * FROM roles', function (error, roles) {
						if (error) {
							console.log(error);
						} else {
							//new array for role title choices
							let rChoices = [];
							for (let i = 0; i < roles.length; i++) {
								rChoices.push(roles[i].title);
							}

							//prompt to select role to update to
							inquirer
								.prompt([
									{
										type: 'list',
										name: 'roleChoice',
										message: `Which role do you want to assign the selected employee?`,
										choices: rChoices,
									},
								])
								.then(function (role) {
									const updRole = roles.find(
										(objRoles) => objRoles.title === role.roleChoice
									);

									//query to update role_id of selected employee.id
									db.query(
										`UPDATE employee
									SET role_id = ${updRole.id}
									WHERE employee.id = ${emp1.id};`,
										function (error, results) {
											if (error) {
												console.log(error);
											} else {
												console.log('Employee Role Updated!');
												init();
											}
										}
									);
								});
						}
					});
				});
		}
	});
}

//function to VIEW roles table
function viewAllRoles() {
	db.query('SELECT * FROM roles', function (error, results) {
		if (error) {
			console.log(error);
		} else {
			//initializes table of results
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
							} else {
								//lets user know new role was added successfully
								console.log('New Role Added');
								init();
							}
						}
					);
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
					} else {
						//lets user know new department was added successfully
						console.log('New Department Added');
						init();
					}
				}
			);
		});
}

//initializes application
init();
