import React from "react";

interface OrderStatus {
	status: string;
}

export const OrderStatus: React.FC<OrderStatus> = ({ status }) => {
	return (
		<select className="text-white bg-[#4FAFCB] px-2 py-1 rounded text-sm sm:text-base outline-none">
			<option value="Aberto">Aberto</option>
			<option value="Em andamento">Em andamento</option>
			<option value="Finalizado">Finalizado</option>
		</select>
	);
};
