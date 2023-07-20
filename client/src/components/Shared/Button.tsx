import { ReactNode } from "react";

type Props = {
	type?: "button" | "submit" | "reset" | undefined;
	name?: string;
	icon?: ReactNode;
	styling?: string;
	form?: string;
	disabled?: boolean;
	onClick?: (() => void) | (() => Promise<void>);
};

const Button = ({
	type,
	name,
	icon,
	styling,
	form,
	onClick,
	disabled,
}: Props) => {
	return (
		<button
			type={type || "button"}
			className={
				styling
					? styling
					: " bg-[#3B71CA] shadow-sm rounded-md py-2 shadow-black px-4 text-white font-medium hover:drop-shadow-md hover:-translate-y-[2px] active:translate-y-[2px] active:shadow-none transition-[shadow,transform]"
			}
			disabled={disabled}
			onClick={onClick}
			form={form}>
			{icon}
			{name}
		</button>
	);
};

export default Button;
