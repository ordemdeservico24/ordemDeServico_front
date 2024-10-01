"use client";
import React from "react";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { IOrderStatus } from "@/interfaces/order.interface";

interface OrderStatusProps {
	currentStatus: string;
	currentStatusId: string;
	orderId: string;
	statuses: IOrderStatus[];
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ currentStatus, orderId, statuses }) => {
	const filteredStatuses = statuses.filter((status) => status.id !== currentStatus);

	const token = getCookie("access_token");

	const handleChange = async (value: string) => {
		toast.promise(
			fetch(`https://ordemdeservicosdev.onrender.com/api/order/update-status/${orderId}`, {
				method: "PATCH",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ orderStatusId: value }),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error("Falha ao atualizar status");
					}
					return res.json();
				})
				.then((data) => {
					console.log(data);
				}),
			{
				pending: "Atualizando status",
				success: {
					render: "Status atualizado com sucesso",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro",
			}
		);
	};

	return (
		<div className="flex justify-end">
			<Select onValueChange={handleChange} defaultValue={currentStatus}>
				<SelectTrigger className="py-1 px-2 rounded text-sm bg-[#3b82f6] text-white">{currentStatus}</SelectTrigger>
				<SelectContent>
					<SelectItem value={currentStatus} disabled>
						{currentStatus}
					</SelectItem>
					{filteredStatuses
						.filter((status) => status.orderStatusName !== currentStatus)
						.map((status) => (
							<SelectItem key={status.id} value={status.id}>
								{status.orderStatusName}
							</SelectItem>
						))}
				</SelectContent>
			</Select>
		</div>
	);
};
