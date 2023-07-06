const ProjectView = () => {
	return (
		<div className='flex justify-center'>
			<div className='flex flex-col gap-2 w-[900px] h-[550px] overflow-auto'>
				<div>
					<div className='flex justify-between w-full'>
						<div className='w-[450px]'>Title</div>
						<div className='w-[180px]'>Assigned</div>
						<div className='w-[180px]'>Completed</div>
						<div className='w-[50px]'></div>
					</div>
				</div>
				<div className='flex flex-col border-b-4'>
					<div className='flex justify-between w-full py-2 border-y'>
						<div className='w-[450px]'>Title</div>
						<div className='w-[180px]'>Assigned</div>
						<div className='w-[180px]'>Completed</div>
						<div className='w-[50px]'>TH</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProjectView;