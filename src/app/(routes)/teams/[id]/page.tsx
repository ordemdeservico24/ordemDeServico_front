"use client";
import { Container } from "@/components/container";
import { ITeam } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page({ params }: { params: { id: string } }) {
	const [team, setTeam] = useState<ITeam>();
	const token = getCookie("access_token");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BASE_URL}/team/get-team/${params.id}`, {
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
				// console.log(status, data);
				setTeam(data);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [params.id, token]);
	const truncateNotes = (notes: string, maxLength: number) => {
		if (notes.length > maxLength) {
			return notes.substring(0, maxLength) + "...";
		}
		return notes;
	};
	const formattedDates = (date: Date) => {
		return new Date(date).toLocaleString("pt-BR", {
			timeZone: "America/Sao_Paulo",
		});
	};

	return (
		<Container>
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
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
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">Ordens Atribuídas</CardTitle>
									<CardDescription>Cheque todas as informações relacionado aos líderes apresentados.</CardDescription>
								</CardHeader>

								<div className="flex px-4 gap-2 sm:gap-4 flex-wrap">
									{team?.orders.map((order, index) => (
										<Link
											className="bg-primary text-white bg-[#3b82f6] p-4 rounded flex flex-col justify-between gap-2 w-[250px] sm:max-w-sm"
											key={index}
											href={`/orders/order/${order.id}`}
										>
											<div className="flex flex-col gap-2">
												<p className="font-semibold text-sm sm:text-base">{order.subject.name}</p>
												<p className="text-xs sm:text-sm">{truncateNotes(order.notes, 100)}</p>
											</div>
											<p className="border-t border-white text-xs sm:text-sm pt-2 text-right">
												{formattedDates(order.openningDate)}
											</p>
										</Link>
									))}
								</div>

								<div className="p-4">
									<p>Membros na equipe: ({team?.members.length})</p>
									<Table className="overflow-x-auto min-w-full bg-white rounded-xl divide-y divide-gray-200">
										<TableHeader>
											<TableRow>
												<TableHead>Nome</TableHead>
												<TableHead>Profissão</TableHead>
												<TableHead>Telefone</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{team?.members.map((member, index) => (
												<TableRow key={index} className="cursor-pointer hover:bg-gray-100">
													<TableCell>
														<p>{member.user.name}</p>
													</TableCell>
													<TableCell>
														<p>{member.user.role ? member.user.role.roleName : "Não informado"}</p>
													</TableCell>
													<TableCell>
														<p>{member.user.phone}</p>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</Card>
						</TabsContent>
					</Tabs>
				)}
			</main>
		</Container>
	);
}
