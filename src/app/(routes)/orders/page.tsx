"use client";
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

export default function Page() {
	const [orders, setOrders] = useState<Order[]>([]);
	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/order/get-all-orders",
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
				setOrders(data);
			});
	}, []);

	const truncateNotes = (notes: string, maxLength: number) => {
		if (notes.length > maxLength) {
			return notes.substring(0, maxLength) + "...";
		}
		return notes;
	};

	return (
		<div>
			<h1 className="font-semibold text-xl">Ordens de serviço</h1>
			<div className="mt-4 bg-white min-w-full p-4 rounded-lg">
				<div className="flex justify-between">
					<input
						type="search"
						name=""
						id=""
						placeholder="Pesquisar ordem"
						className="border border-[#E7E7E7] px-2 outline-none"
					/>
					<Link
						href="/orders/create-order"
						className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all"
					>
						Cadastrar OS
					</Link>
				</div>
				<div className="mt-8">
					<ul className="flex gap-32">
						<li
							className={`hover:text-[#7F56D8] cursor-pointer font-medium`}
						>
							Ver todas
						</li>
						<li className="hover:text-[#7F56D8] cursor-pointer font-medium">
							Novas
						</li>
						<li className="hover:text-[#7F56D8] cursor-pointer font-medium">
							Em andamento
						</li>
						<li className="hover:text-[#7F56D8] cursor-pointer font-medium">
							Resolvidas
						</li>
					</ul>
					{orders.map((orders, index) => (
						<Link
							className="mt-4 border border-[#e2e2e2] py-2 px-4 rounded flex flex-col gap-2"
							href={`/orders/order/${orders.id}`}
							key={index}
						>
							<div className="flex justify-between items-center">
								<h1 className="font-semibold text-xl">
									Ordem de Serviço - {orders.orderId}
								</h1>
								<p className="text-[#84818A] text-xs">
									Data de abertura:{" "}
									{orders.openningDate.split(", ")[0]}
								</p>
							</div>
							<h1 className="font-medium">{orders.subject}</h1>
							<div className="flex justify-between items-center">
								<p className="text-[#84818A] text-xs">
									{truncateNotes(orders.notes, 200)}
								</p>
								<p className="text-white bg-[#4FAFCB] px-2 py-1 rounded">
									{orders.orderStatus}
								</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
