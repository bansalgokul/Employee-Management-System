const TaskView = () => {
	return (
		<div className='flex justify-center'>
			<div className='flex flex-col gap-2 w-[900px] h-[550px] overflow-auto'>
				<div>
					<div className='flex justify-between w-full'>
						<div className='w-[450px]'>Description</div>
						<div className='w-[180px]'>Start Time</div>
						<div className='w-[180px]'>End Time</div>
						<div className='w-[50px]'></div>
					</div>
				</div>
				<div className='flex flex-col border-b-4'>
					<div className='py-4'>Date</div>
					<div className='flex justify-between w-full py-2 border-y'>
						<div className='w-[450px]'>Description</div>
						<div className='w-[180px]'>Start Time</div>
						<div className='w-[180px]'>End Time</div>
						<div className='w-[50px]'>Th</div>
					</div>
					<div className='flex justify-between w-full py-2 border-y'>
						<div className='w-[450px]'>Description</div>
						<div className='w-[180px]'>Start Time</div>
						<div className='w-[180px]'>End Time</div>
						<div className='w-[50px]'>Th</div>
					</div>
					<div className='flex justify-between w-full py-2 border-y'>
						<div className='w-[450px]'>Description</div>
						<div className='w-[180px]'>Start Time</div>
						<div className='w-[180px]'>End Time</div>
						<div className='w-[50px]'>Th</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskView;
