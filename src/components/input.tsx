import React from "react";

interface InputProps {
	type?: string;
	name: string;
	placeholder?: string;
	className?: string;
	labelName?: string;
	labelText?: string;
	textArea?: boolean;
}

export const Input: React.FC<InputProps> = ({
	type,
	name,
	placeholder,
	className,
	labelName,
	labelText,
	textArea,
}) => {
	return (
		<>
			{textArea ? (
				<>
					<textarea
						name={name}
						id={labelName}
						placeholder={placeholder}
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
						className={`outline-none border border-[#2a2a2a] rounded px-2 py-1 mb-4 ${className}`}
					/>
				</>
			)}
		</>
	);
};
