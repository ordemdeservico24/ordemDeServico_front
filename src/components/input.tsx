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
	required?: boolean;
	defaultValue?: string;
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
	required,
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
						required={required}
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
						required={required}
						className={`outline-none border border-[#2a2a2a] rounded px-2 py-1 mb-4 ${className}`}
					/>
				</>
			)}
		</>
	);
};
