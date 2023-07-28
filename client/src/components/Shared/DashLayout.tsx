import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

type Props = {
	isAdmin: boolean;
};

const DashLayout = ({ isAdmin }: Props) => {
	return (
		<>
			<Sidebar isAdmin={isAdmin} />
			<div className='lg:col-start-2 md:col-start-3 md:col-end-16 md:row-start-2 md:row-end-16 col-start-1 col-end-16 row-start-2 row-end-15 md:p-3'>
				<Outlet />
			</div>
		</>
	);
};

export default DashLayout;
