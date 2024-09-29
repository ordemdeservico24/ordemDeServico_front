"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { IOrderReport } from "@/interfaces/order.interface";
import { getCookie } from "cookies-next";
import { Container } from "@/components/container";

export default function Page() {
	const [orderData, setOrderData] = useState<IOrderReport[]>([]);
	const token = getCookie("access_token");

	useEffect(() => {
		fetch(`https://ordemdeservicosdev.onrender.com/api/order/report`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				const status = res.status;
				return res.json().then((data) => ({ status, data }));
			})
			.then(({ status, data }) => {
				console.log(status, data);
				setOrderData(data);
			});
	}, [token]);

	if (orderData.length < 7) {
		return <p>Carregando dados...</p>;
	}

	const statusColors = {
		Aberto: "#f91244",
		"Em Andamento": "#2798e3",
		"Em Análise": "#f0b41b",
		Finalizado: "#349b9b",
	};

	const pieChartData: { name: "Aberto" | "Em Andamento" | "Em Análise" | "Finalizado"; value: number }[] = [
		{ name: "Aberto", value: orderData[3]?.data?.number || 0 },
		{ name: "Em Andamento", value: orderData[4]?.data?.number || 0 },
		{ name: "Em Análise", value: orderData[5]?.data?.number || 0 },
		{ name: "Finalizado", value: orderData[6]?.data?.number || 0 },
	];

	return (
		<Container>
			<main className="flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<div className="max-w-7xl mx-auto space-y-6">
					<h1 className="text-3xl font-bold">Relatório de Ordens de Serviço</h1>

					<div className="flex w-full flex-col lg:flex-row gap-6">
						{/* Orders Created Statistics */}
						<Card className="w-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									{orderData[0].label}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-4xl font-bold">{orderData[0].data.number}</p>
							</CardContent>
						</Card>

						<Card className="w-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clock className="h-5 w-5" />
									{orderData[1].label}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-4xl font-bold">{orderData[1].data.number}</p>
							</CardContent>
						</Card>

						<Card className="w-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="h-5 w-5" />
									{orderData[2].label}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-4xl font-bold">{orderData[2].data.number}</p>
							</CardContent>
						</Card>
					</div>

					{/* Orders by Status */}
					<Card>
						<CardHeader>
							<CardTitle>Ordens por Status</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-base">
											<AlertCircle className="h-5 w-5 text-red-500" />
											{orderData[3].label}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-3xl font-bold">{orderData[3].data.number}</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-base">
											<Loader2 className="h-5 w-5 text-blue-500" />
											{orderData[4].label}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-3xl font-bold">{orderData[4].data.number}</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-base">
											<AlertCircle className="h-5 w-5 text-yellow-500" />
											{orderData[5].label}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-3xl font-bold">{orderData[5].data.number}</p>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-base">
											<CheckCircle className="h-5 w-5 text-green-500" />
											{orderData[6].label}
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-3xl font-bold">{orderData[6].data.number}</p>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>

					{/* Orders Distribution Chart */}
					<Card>
						<CardHeader>
							<CardTitle>Distribuição de Ordens</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
											{pieChartData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={statusColors[entry.name]} />
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</Container>
	);
}
