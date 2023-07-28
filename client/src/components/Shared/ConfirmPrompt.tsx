type Props = {
	message: string;
	setIsDeleteProject: React.Dispatch<React.SetStateAction<boolean>>;
	deleteProject: () => Promise<void>;
};

const ConfirmPrompt = ({
	message,
	setIsDeleteProject,
	deleteProject,
}: Props) => {
	const handleCancel = () => {
		setIsDeleteProject(false);
	};

	return (
		<div
			className='fixed z-20 top-0 left-0 w-full h-full grid place-content-center bg-black bg-opacity-50'
			onClick={handleCancel}>
			<div
				className='min-w-[400px] flex flex-col bg-[#e0e0e0] rounded-lg'
				onClick={(e) => e.stopPropagation()}>
				<div className='grow text-center p-4'>{message}</div>
				<div className='flex gap-4 p-4 justify-center'>
					<button
						onClick={handleCancel}
						className='bg-[#3B71CA] shadow-sm rounded-md py-1 shadow-black px-2 text-white font-medium hover:drop-shadow-md hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none transition-[shadow,transform]'>
						Cancel
					</button>
					<button
						className='bg-[#3B71CA] shadow-sm rounded-md py-1 shadow-black px-2 text-white font-medium hover:drop-shadow-md hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none transition-[shadow,transform]'
						onClick={deleteProject}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmPrompt;
