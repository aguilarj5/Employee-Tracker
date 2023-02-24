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

const checkComplete = [
	{
		type: 'list',
		name: 'done',
		message: 'Is team complete?',
		choices: ['Yes', 'No'],
	},
];

module.exports = {
	startQ,
	checkComplete,
};
