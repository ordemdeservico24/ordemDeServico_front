"use client";
import { Container } from "@/components/container";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { ITertiaryInfoPage } from "@/interfaces/company.interface";
import { BarChart3, Clipboard, MapPin, Share2, Users } from "lucide-react";
import CopyToClipboardButton from "@/components/copyToClipboard";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.BASE_URL;
export default function Page({ params }: { params: { id: string } }) {
	const [tertiary, setTertiary] = useState<ITertiaryInfoPage>();
	const token = getCookie("access_token");
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BASE_URL}/company/get-tertiary/${params.id}`, {
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
		setIsLoading(false);
	}, [params.id, token]);

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
				) : (
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
									<CopyToClipboardButton textToCopy={`https://ordem-de-servico-front.vercel.app/register/${tertiary?.id}`} />
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Clipboard className="h-5 w-5" />
									Cadastro de Funcionários
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4">Compartilhe este link para os funcionários se cadastrarem a esse distrito</p>
								<div className="flex gap-2">
									<CopyToClipboardButton
										textToCopy={`https://ordem-de-servico-front.vercel.app/register/employee/${tertiary?.id}`}
									/>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Links Rápidos</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
									<Button variant="outline" onClick={() => router.push("/orders")}>
										Ordens de Serviço
									</Button>
									<Button variant="outline" onClick={() => router.push("/teams")}>
										Equipes
									</Button>
									<Button variant="outline" onClick={() => router.push("/users")}>
										Usuários
									</Button>
									<Button variant="outline" onClick={() => router.push("/stock")}>
										Estoque
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</main>
		</Container>
	);
}
