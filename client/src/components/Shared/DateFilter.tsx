type Props = {
	fromDate: string;
	toDate: string;
	setFromDate: React.Dispatch<React.SetStateAction<string>>;
	setToDate: React.Dispatch<React.SetStateAction<string>>;
};

const DateFilter = ({ fromDate, setFromDate, toDate, setToDate }: Props) => {
	return (
		<div className='flex justify-evenly border-y-2'>
			<div>
				From:{" "}
				<input
					type='date'
					value={fromDate}
					max={toDate}
					onChange={(e) => setFromDate(e.target.value)}
				/>
			</div>
			<div>
				To:{" "}
				<input
					type='date'
					value={toDate}
					min={fromDate}
					onChange={(e) => setToDate(e.target.value)}
				/>
			</div>
		</div>
	);
};

export default DateFilter;
