type Props = {
	error: string;
	closeErrorPrompt: () => void;
};

const ErrorPrompt = ({ error, closeErrorPrompt }: Props) => {
	return (
		<div
			onClick={closeErrorPrompt}
			className='fixed z-[100] top-0 left-0 w-full h-full grid place-content-center bg-[#d0d0d0] bg-opacity-50'>
			<div className='w-[350px] text-center flex flex-col items-center justify-evenly h-[150px] rounded-lg  bg-white'>
				<div className='text-xl'>{error}</div>
				<div>
					<button
						className=' bg-[#3B71CA] shadow-sm rounded-md py-2 shadow-black px-4 text-white font-medium hover:drop-shadow-md hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none transition-[shadow,transform]'
						onClick={closeErrorPrompt}>
						Okay
					</button>
				</div>
			</div>
		</div>
	);
};

export default ErrorPrompt;
