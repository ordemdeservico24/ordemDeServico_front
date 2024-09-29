"use client";
import { AssignedTeam } from "@/components/assignedTeam";
import { Container } from "@/components/container";
import { OrderStatus } from "@/components/orderStatus";
import { IOrderGet, IOrderStatus } from "@/interfaces/order.interface";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { ITertiaryInfoPage } from "@/interfaces/company.interface";
import { Input } from "@/components/ui/input";
import { BarChart3, Clipboard, MapPin, Share2, Users } from "lucide-react";
import CopyToClipboardButton from "@/components/copyToClipboard";

export default function Page({ params }: { params: { id: string } }) {
	const [tertiary, setTertiary] = useState<ITertiaryInfoPage>();
	const token = getCookie("access_token");

	useEffect(() => {
		fetch(`https://ordemdeservicosdev.onrender.com/api/company/get-tertiary/${params.id}`, {
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
				setTertiary(data);
			});
	}, [params.id, token]);

	return (
		<Container>
			<main className="flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<div className="max-w-7xl mx-auto space-y-6">
					<h1 className="text-3xl font-bold">{tertiary?.nameDistrict}</h1>

					<div className="flex w-full flex-col lg:flex-row gap-6">
						<Card className="w-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="h-5 w-5" />
									Ordens de Serviço
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<p>
										Última 24 horas: <span className="font-semibold">{tertiary?.last24HoursOrders}</span>
									</p>
									<p>
										Últimos 7 dias: <span className="font-semibold">{tertiary?.last7DaysOrders}</span>
									</p>
									<p>
										Últimos 30 dias: <span className="font-semibold">{tertiary?.last30DaysOrders}</span>
									</p>
								</div>
							</CardContent>
						</Card>

						{/* User Information */}
						<Card className="w-full">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Users className="h-5 w-5" />
									Informações dos Usuários
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<p>
										Total de Usuários: <span className="font-semibold">{tertiary?.totalUsers}</span>
									</p>
									<p>
										Funcionários: <span className="font-semibold">{tertiary?.totalEmployees}</span>
									</p>
									<p>
										Novos Usuários (Últimos 30 dias): <span className="font-semibold">{tertiary?.newUsers30Days}</span>
									</p>
								</div>
							</CardContent>
						</Card>

						{/* City Information
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MapPin className="h-5 w-5" />
									City Information
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<p>
										Cidade: <span className="font-semibold">{tertiary?.secondary.cityName}</span>
									</p>
									<p>
										Population: <span className="font-semibold">167,000</span>
									</p>
									<p>
										Area: <span className="font-semibold">170 km²</span>
									</p>
								</div>
							</CardContent>
						</Card> */}
					</div>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clipboard className="h-5 w-5" />
								Cadastro de Usuários
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-4">Compartilhe este link para os usuários se cadastrarem a esse distrito</p>
							<div className="flex gap-2">
								<CopyToClipboardButton textToCopy={`http://localhost:3000/register/${tertiary?.id}`} />
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Links Rápidos</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
								<Button variant="outline">Ordens de Serviço</Button>
								<Button variant="outline">Equipes</Button>
								<Button variant="outline">Usuários</Button>
								<Button variant="outline">Estoque</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</Container>
	);
}
