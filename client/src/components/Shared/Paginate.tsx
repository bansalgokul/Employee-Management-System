import { useMemo } from "react";
import Button from "./Button";
import {
	MdOutlineArrowBackIos,
	MdOutlineArrowForwardIos,
} from "react-icons/md";
import { parse } from "date-fns";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paginate = (currentPage: number, limit = 5, itemArray: any[]) => {
	const arrayLength = itemArray.length;
	const startingItem = (currentPage - 1) * limit;
	const endingItem = startingItem + limit;

	if (startingItem > arrayLength) {
		return [];
	}

	const output = itemArray.slice(startingItem, endingItem);
	return output;
};

// eslint-disable-next-line react-refresh/only-export-components
export { paginate };

const range = (start: number, end: number) => {
	const length = end - start + 1;
	return Array.from({ length }, (_, idx) => idx + start);
};

type Parameter = {
	totalCount: number;
	pageSize: number;
	siblingCount?: number;
	currentPage: number;
};

const usePagination = ({
	totalCount,
	pageSize,
	siblingCount = 1,
	currentPage,
}: Parameter) => {
	const paginationRange = useMemo(() => {
		const totalPageCount = Math.ceil(totalCount / pageSize);
		const totalPageNumbers = 2 * siblingCount + 5;

		if (totalPageNumbers - 2 >= totalPageCount) {
			return range(1, totalPageCount);
		}

		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(
			currentPage + siblingCount,
			totalPageCount,
		);

		const showLeftDots = leftSiblingIndex > 2;
		const showRightDots = rightSiblingIndex < totalPageCount - 1;

		if (showLeftDots && showRightDots) {
			const middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [1, -1, ...middleRange, -1, totalPageCount];
		} else if (!showLeftDots && showRightDots) {
			const leftRange = range(1, rightSiblingIndex);
			return [...leftRange, -1, totalPageCount];
		} else if (showLeftDots && !showRightDots) {
			const rightRange = range(leftSiblingIndex, totalPageCount);
			return [1, -1, ...rightRange];
		}
		return range(1, totalPageCount);
	}, [totalCount, pageSize, siblingCount, currentPage]);

	return paginationRange;
};

type Props = {
	totalCount: number;
	pageSize: number;
	siblingCount?: number;
	currentPage: number;
	onPageChange: (pageNumber: number) => void;
	handleLimitChange?: (limit: number) => void;
	limitRange?: number[];
};

const Pagination = ({
	totalCount,
	pageSize,
	siblingCount,
	currentPage,
	onPageChange,
	handleLimitChange,
	limitRange,
}: Props) => {
	const paginationRange = usePagination({
		currentPage,
		totalCount,
		siblingCount,
		pageSize,
	});

	const nextPage = () => {
		onPageChange(currentPage + 1);
	};
	const prevPage = () => {
		onPageChange(currentPage - 1);
	};

	const disabledArrowStyle =
		" bg-[#e6e6e6] rounded-md py-2  px-4 text-white font-medium";

	const currentPageNumberStyle =
		"rounded-full bg-[#f4f4f4] text-black p-2 w-8 h-8 grid place-content-center";
	const PageNumberStyle =
		"rounded-full bg-white text-black p-2 w-8 h-8 grid place-content-center";

	return (
		<div className='flex items-center justify-center gap-2 w-full py-1 border-y relative'>
			<Button
				onClick={prevPage}
				disabled={currentPage === 1}
				styling={currentPage === 1 ? disabledArrowStyle : undefined}
				icon={<MdOutlineArrowBackIos />}
			/>

			<div className='flex items-center'>
				{paginationRange.map((pageNo, index) => {
					if (pageNo === -1) {
						return (
							<Button
								key={index}
								name='...'
								styling='p-2 rounded-full'
							/>
						);
					} else {
						return (
							<div
								key={index}
								onClick={() => {
									onPageChange(pageNo);
								}}>
								<Button
									name={pageNo.toString()}
									styling={
										currentPage === pageNo
											? currentPageNumberStyle
											: PageNumberStyle
									}
								/>
							</div>
						);
					}
				})}
			</div>
			<Button
				disabled={
					totalCount == 0 ||
					currentPage === paginationRange[paginationRange.length - 1]
				}
				styling={
					totalCount == 0 ||
					currentPage === paginationRange[paginationRange.length - 1]
						? disabledArrowStyle
						: undefined
				}
				onClick={nextPage}
				icon={<MdOutlineArrowForwardIos />}
			/>

			{handleLimitChange && (
				<div className='absolute right-4'>
					Limit: {"  "}
					<select
						name=''
						id=''
						value={pageSize}
						onChange={(e) =>
							handleLimitChange(parseInt(e.target.value))
						}>
						{limitRange?.map((limit, index) => {
							return (
								<option key={index} value={limit}>
									{limit}
								</option>
							);
						})}
					</select>
				</div>
			)}
		</div>
	);
};

export default Pagination;
