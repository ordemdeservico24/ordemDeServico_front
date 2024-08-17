import React, { ReactNode } from "react";
import Menu from "./MenuTest";
interface ContainerProps {
	children: ReactNode;
	className?: string;
}

export const Container: React.FC<ContainerProps> = ({
	children,
	className,
}) => {
	return (
		<div className="flex min-h-[100dvh] relative">
		  <Menu />
		  <div className={`flex-1 mt-3 bg-white p-4 rounded-lg ${className}`}>
			{children}
		  </div>
		</div>
	  );
};
