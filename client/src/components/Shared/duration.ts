import { format } from "date-fns";
import { Task } from "../types";

const getDuration = (startedAt: Date, endedAt?: Date) => {
	const startTime = new Date(startedAt).getTime();
	const endTime = endedAt
		? new Date(endedAt).getTime()
		: new Date().getTime();

	const durationInMilliseconds = endTime - startTime;

	const secs = Math.floor(durationInMilliseconds / 1000) % 60;
	const mins = Math.floor(durationInMilliseconds / (1000 * 60)) % 60;
	const hrs = Math.floor(durationInMilliseconds / (1000 * 60 * 60));

	const duration = {
		hrs,
		secs,
		mins,
		totalSecs: Math.floor(durationInMilliseconds / 1000),
		formatTime: `${hrs.toString().padStart(2, "0")}:${mins
			.toString()
			.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
		formatTimeHM: `${hrs.toString().padStart(2, "0")}:${mins
			.toString()
			.padStart(2, "0")}`,
	};

	return duration;
};

const getTasksTime = (taskArray: Task[]) => {
	let startTime = taskArray[0].startedAt;
    let endTime = taskArray[0].endedAt;
    let totalTime = 0;
	taskArray.forEach((task) => {
        const { totalSecs } = getDuration(task.startedAt, task.endedAt);
        totalTime += totalSecs;
		if (task.startedAt < startTime) {
			startTime = task.startedAt;
		}
		if (task.endedAt > endTime) {
			endTime = task.endedAt;
		}
    });
    const minutes = Math.floor((totalTime / 60) % 60);
    const hours = Math.floor((totalTime / (60 * 60)));
    const formatDuration = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
	return {startTime: format(new Date(startTime), "h:mm aaa"), endTime:  format(new Date(endTime), "h:mm aaa"), formatDuration};
};

export { getDuration, getTasksTime };