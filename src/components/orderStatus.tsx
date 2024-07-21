import React from "react";
import { toast } from "react-toastify";

interface OrderStatus {
	currentStatus: string;
	orderId: string;
}

export const OrderStatus: React.FC<OrderStatus> = ({
	currentStatus,
	orderId,
}) => {
	const statuses = ["Aberto", "Em andamento", "Finalizado"];

	// Filtre a lista de status para excluir o status atual
	const filteredStatuses = statuses.filter(
		(status) => status !== currentStatus
	);

	const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value;
		toast.promise(
			fetch(
				`https://ordemdeservicosdev.onrender.com/api/order/update-status/${orderId}`,
				{
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify({ orderStatus: e.target.value }),
				}
			)
				.then((res) => {
					const status = res.status;
					return res.json().then((data) => ({ status, data }));
				})
				.then(({ status, data }) => {
					console.log(status, data);
				}),
			{
				pending: "Atualizando status",
				success: "Status atualizado com sucesso",
				error: "Ocorreu um erro",
			}
		);
	};

	return (
		<select
			value={currentStatus}
			onChange={handleChange}
			className="text-white bg-[#4FAFCB] py-1 rounded text-[.6rem] sm:text-base outline-none"
		>
			{/* Adiciona a opção do status atual no início */}
			<option value={currentStatus} disabled>
				{currentStatus}
			</option>
			{filteredStatuses.map((status) => (
				<option key={status} value={status}>
					{status}
				</option>
			))}
		</select>
	);
};
