export type User = {
	_id: string;
	name: string;
	email: string;
	empID: string;
	roles: string;
	updatedAt?: Date;
};

export type Project = {
	_id: string;
	title: string;
	description: string;
	completed: boolean;
	assigned: Array<{ user: User }>;
	updatedAt: Date;
};

export type Task = {
	_id: string;
	description: string;
	project: Project;
	user: User;
	startedAt: Date;
	endedAt: Date;
	updatedAt: Date;
};

export type GroupedTasksUserItem = {
	user: User;
	taskArray: Task[];
};
export type GroupedTasksUser = GroupedTasksUserItem[];

export type GroupedTasksProjectItem = {
	project: Project;
	taskArray: Task[];
};
export type GroupedTasksProject = GroupedTasksProjectItem[];
