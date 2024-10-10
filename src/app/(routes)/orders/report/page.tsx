"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { IOrderReport } from "@/interfaces/order.interface";
import { getCookie } from "cookies-next";
import { Container } from "@/components/container";
const BASE_URL = process.env.BASE_URL;

export default function Page() {
	const [orderData, setOrderData] = useState<IOrderReport[]>([]);
	const token = getCookie("access_token");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		setError(null);
		fetch(`${BASE_URL}/order/report`, {
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
			}).finally(() => setIsLoading(false));
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
				{isLoading ? (
					<div className="flex justify-center items-center">
						<svg
							className="h-8 w-8 animate-spin text-gray-600 mx-auto"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
							/>
						</svg>
					</div>
				) : error ? (
					<div className="text-center text-red-500 p-8">
						<span>{error}</span>
					</div>
				) : (
					<div className="max-w-7xl mx-auto space-y-6">
						<h1 className="text-2xl font-bold">Relatório de Ordens de Serviço</h1>

						<div className="flex w-full flex-col lg:flex-row gap-6">
							<Card className="w-full flex flex-col justify-between">
								<CardHeader>
									<CardTitle className="flex gap-2 text-base md:text-xl">
										<Calendar className="h-6 w-6" />
										{orderData[0].label}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">{orderData[0].data.number}</p>
								</CardContent>
							</Card>

							<Card className="w-full">
								<CardHeader>
									<CardTitle className="flex gap-2 text-base md:text-xl">
										<Clock className="h-8 w-8" />
										{orderData[1].label}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">{orderData[1].data.number}</p>
								</CardContent>
							</Card>

							<Card className="w-full">
								<CardHeader>
									<CardTitle className="flex gap-2 text-base md:text-xl">
										<BarChart3 className="h-8 w-8" />
										{orderData[2].label}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-3xl font-bold">{orderData[2].data.number}</p>
								</CardContent>
							</Card>
						</div>
						<Card>
							<CardHeader>
								<CardTitle>Ordens por Status</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									<Card>
										<CardHeader>
											<CardTitle className="flex gap-2 text-base">
												<AlertCircle className="h-7 w-7 text-red-500" />
												{orderData[3].label}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-3xl font-bold">{orderData[3].data.number}</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="flex gap-2 text-base">
												<Loader2 className="h-7 w-7 text-blue-500" />
												{orderData[4].label}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-3xl font-bold">{orderData[4].data.number}</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="flex gap-2 text-base">
												<AlertCircle className="h-7 w-7 text-yellow-500" />
												{orderData[5].label}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-3xl font-bold">{orderData[5].data.number}</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader>
											<CardTitle className="flex gap-2 text-base">
												<CheckCircle className="h-7 w-7 text-green-500" />
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
				)}
			</main>
		</Container>
	);
}
