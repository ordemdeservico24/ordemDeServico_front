"use client";
import { Container } from "@/components/container";
import { useEffect, useState } from "react";

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

export default function Home() {
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

	const totalOrders = orders.length;
	const openOrders = orders.filter(
		(order) => order.orderStatus === "Aberto"
	).length;
	const inProgressOrders = orders.filter(
		(order) => order.orderStatus === "Em andamento"
	).length;

	const today = new Date().toLocaleDateString("pt-BR");

	const ordersOpenedToday = orders.filter((order) => {
		const [orderDate] = order.openningDate.split(", ");
		return orderDate === today;
	}).length;

	return (
		<Container>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-4 bg-blue-500 text-white rounded shadow">
					<h2 className="text-lg font-bold">Total de Ordens</h2>
					<p className="text-2xl">{totalOrders}</p>
				</div>
				<div className="p-4 bg-green-500 text-white rounded shadow">
					<h2 className="text-lg font-bold">Ordens em Aberto</h2>
					<p className="text-2xl">{openOrders}</p>
				</div>
				<div className="p-4 bg-yellow-500 text-white rounded shadow">
					<h2 className="text-lg font-bold">Ordens em Andamento</h2>
					<p className="text-2xl">{inProgressOrders}</p>
				</div>
				<div className="p-4 bg-red-500 text-white rounded shadow">
					<h2 className="text-lg font-bold">Ordens Abertas Hoje</h2>
					<p className="text-2xl">{ordersOpenedToday}</p>
				</div>
			</div>
		</Container>
	);
}
