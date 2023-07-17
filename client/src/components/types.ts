export type User = {
	_id: string;
	name: string;
	email: string;
	empID: string;
	roles: string;
};

export type Project = {
	_id: string;
	title: string;
	description: string;
	completed: boolean;
	assigned: Array<{ user: User }>;
};

export type Task = {
	_id: string;
	description: string;
	project: Project;
	user: User;
	startedAt: Date;
	endedAt: Date;
};