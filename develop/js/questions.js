//initial menu questions
const startQ = [
	{
		type: 'list',
		name: 'choice',
		message: 'What would you like to do?',
		choices: [
			'View All Employees',
			'Add Employee',
			'Update Employee Role',
			'View All Roles',
			'Add Role',
			'View All Departments',
			'Add Department',
			'Done?',
		],
	},
];

//prompts when adding new employee
const employeeQ = [
	{
		type: 'input',
		message: `First Name:`,
		name: 'firstName',
	},
	{
		type: 'input',
		message: 'Last Name:',
		name: 'lastName',
	},
	{
		type: 'list',
		name: 'role',
		message: 'Employee Role',
		choices: ['Salesperson', 'Accountant', 'Reception'],
	},
	{
		type: 'list',
		name: 'manager',
		message: 'Manager',
		choices: ['Leslie', 'Christopher', 'Marcus'],
	},
];

//TODO: add department Qs
//
//TODO: add role Qs
//TODO: update employee role Qs

const checkComplete = [
	{
		type: 'list',
		name: 'done',
		message: 'Is team complete?',
		choices: ['Yes', 'No'],
	},
];

module.exports = {
	employeeQ,
	startQ,
	checkComplete,
};
