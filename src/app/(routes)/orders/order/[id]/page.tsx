"use client";
import { AssignedTeam } from "@/components/assignedTeam";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Order {
	id: string;
	orderId: number;
	openningDate: string;
	expirationDate: string;
	orderStatus: string;
	subject: string;
	notes: string;
	requesterName: string;
	requesterPhone: string;
	requesterStreet: string;
	requesterHouseNumber: number;
	requesterComplement: string;
	requesterZipcode: string;
	teamId: string;
	createdAt: string;
	updatedAt: string;
	assignedTeam: {
		id: string;
		teamLeaderId: string;
		teamName: string;
		createdAt: string;
		updatedAt: string;
	};
}

export default function Page({ params }: { params: { id: string } }) {
	const [order, setOrder] = useState<Order>();

	useEffect(() => {
		fetch(
			`https://ordemdeservicosdev.onrender.com/api/order/get-order/${params.id}`,
			{
				method: "GET",
			}
		)
			.then((res) => {
				const status = res.status;
				return res.json().then((data) => ({ status, data }));
			})
			.then(({ status, data }) => {
				console.log(status, data);
				setOrder(data);
			});
	}, [params.id]);
	return (
		<div className="mt-4 bg-white min-w-full p-4 rounded-lg">
			{order ? (
				<div className="mt-4 py-2 px-4 rounded flex flex-col gap-2">
					<Link
						href="/orders"
						className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-fit"
					>
						Voltar
					</Link>
					<div className="flex justify-between items-center mb-8">
						<h1 className="font-semibold text-xl">
							Ordem de Serviço - {order.orderId}
						</h1>
						<p className="text-[#84818A] text-xs">
							Data de abertura: {order.openningDate}
						</p>
					</div>
					<h1 className="font-medium text-xl">{order.subject}</h1>
					<div className="flex justify-between items-center">
						<p className="text-[#84818A] text-sm">{order.notes}</p>
						<p className="text-white bg-[#4FAFCB] px-2 py-1 rounded">
							{order.orderStatus}
						</p>
					</div>
					<div className="flex flex-col gap-4 py-4 border-b-2">
						<h1 className="text-lg font-medium">
							Dados do solicitante
						</h1>
						<div className="flex flex-wrap gap-x-16 gap-y-4">
							<p>
								<strong>Endereço:</strong>{" "}
								{order.requesterStreet}
							</p>
							<p>
								<strong>N°:</strong>{" "}
								{order.requesterHouseNumber}
							</p>
							<p>
								<strong>Complemento:</strong>{" "}
								{order.requesterComplement}
							</p>
							<p>
								<strong>Telefone/celular:</strong>{" "}
								{order.requesterPhone}
							</p>
							<p>
								<strong>CEP:</strong> {order.requesterZipcode}
							</p>
						</div>
					</div>
					<AssignedTeam
						assignedTeam={order.assignedTeam}
						orderId={order.id}
					/>
				</div>
			) : (
				<h1>Não há ordem de serviço com este id</h1>
			)}
		</div>
	);
}
