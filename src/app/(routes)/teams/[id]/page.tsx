"use client";
import { Container } from "@/components/container";
import { ITeam } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/utils/hasPermissions";
import { useStore } from "@/zustandStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IUser } from "@/interfaces/user.interface";
import { toast } from "react-toastify";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page({ params }: { params: { id: string } }) {
	const [team, setTeam] = useState<ITeam>();
	const token = getCookie("access_token");
	const [isLoading, setIsLoading] = useState(true);
	const { role = [] } = useStore();
	const [leader, setLeader] = useState<string>("");
	const [users, setUsers] = useState<IUser[]>([]);

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
		fetch(`${BASE_URL}/user/get-all-users?limit=${100}&type=user`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => setUsers(data.users))
			.catch((error) => {
				console.error("Erro ao buscar usuários:", error);
				setUsers([]);
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

	const handleSelectChangeLeader = async (value: string) => {
		await setLeader(value);

		toast.promise(
			fetch(`${BASE_URL}/team/assign-leader/${params.id}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ teamId: params.id, leaderId: value }),
			})
				.then(async (res) => {
					if (res.status === 400 || res.status === 500) {
						const data = await res.json();
						toast.error(data.message);
						throw new Error(data.message);
					}
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					// console.log(data);
				})
				.catch((error) => {
					console.log(error);
					throw error;
				}),
			{
				pending: "Atribuindo...",
				success: {
					render: "Atribuído com sucesso",
				},
				error: "Ocorreu um erro ao atribuir",
			}
		);
	};

	const filteredUsers = Array.isArray(users) ? users.filter((user) => !user.isTeamMember && !user.isTeamLeader) : [];

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
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">{team?.teamName}</CardTitle>
									<CardDescription>Veja todas as informações da equipe.</CardDescription>
								</CardHeader>

								<div className="flex px-4 flex-col gap-2 sm:gap-4 flex-wrap">
									<h3>Ordens Atribuídas: {team?.orders.length}</h3>
									<div className="flex flex-row gap-2 sm:gap-4 flex-w">
										{team?.orders.map((order, index) => (
											<Link
												className="text-white bg-[#355ea0] p-4 rounded flex flex-col justify-between gap-2 w-[250px] sm:max-w-sm"
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
								</div>

								<div className="flex justify-between p-4 items-center">
									<p className="flex whitespace-nowrap items-center gap-4">
										Líder da equipe:{" "}
										{team?.leader ? (
											team.leader.user.name
										) : hasPermission(role, "teams_management", "update") ? (
											<Select onValueChange={handleSelectChangeLeader}>
												<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 h-6">
													<SelectValue placeholder="Não possui" />
												</SelectTrigger>
												<SelectContent>
													{filteredUsers?.map((user) => (
														<SelectItem key={user.id} value={user.id || ""}>
															{user.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										) : (
											"Não possui"
										)}
									</p>
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
