type Props = {
	error: string;
};

const ErrorDisplay = ({ error }: Props) => {
	return (
		<div className='text-red-600 px-2 py-3 border rounded-md text-center'>
			{error}
		</div>
	);
};

export default ErrorDisplay;
