import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

type Props = {
	isAdmin: boolean;
};

const DashLayout = ({ isAdmin }: Props) => {
	return (
		<>
			<Sidebar isAdmin={isAdmin} />
			<div className='col-start-2 col-end-11 row-start-2 row-end-11 p-3'>
				<Outlet />
			</div>
		</>
	);
};

export default DashLayout;
