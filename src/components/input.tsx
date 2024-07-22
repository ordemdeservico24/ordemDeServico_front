import React from "react";

interface InputProps {
	type?: string;
	name: string;
	placeholder?: string;
	className?: string;
	labelName?: string;
	labelText?: string;
	textArea?: boolean;
	value?: string | number;
}

export const Input: React.FC<InputProps> = ({
	type,
	name,
	placeholder,
	className,
	labelName,
	labelText,
	textArea,
	value,
}) => {
	return (
		<>
			{textArea ? (
				<>
					<textarea
						name={name}
						id={labelName}
						placeholder={placeholder}
						defaultValue={value}
						className={`outline-none border border-[#2a2a2a] rounded px-2 py-1 mb-4 ${className}`}
					></textarea>
				</>
			) : (
				<>
					<label htmlFor={labelName}>{labelText}</label>
					<input
						type={type}
						name={name}
						placeholder={placeholder}
						id={labelName}
						defaultValue={value}
						className={`outline-none border border-[#2a2a2a] rounded px-2 py-1 mb-4 ${className}`}
					/>
				</>
			)}
		</>
	);
};
