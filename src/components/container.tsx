import React, { ReactNode } from "react";

interface ContainerProps {
	children: ReactNode;
	className?: string;
}

export const Container: React.FC<ContainerProps> = ({
	children,
	className,
}) => {
	return (
		<div
			className={`mt-8 bg-white min-w-full p-4 rounded-lg flex flex-col gap-4 ${className}`}
		>
			{children}
		</div>
	);
};
