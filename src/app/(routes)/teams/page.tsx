"use client";
import { Container } from "@/components/container";
import { ITeam, ITeamLeader } from "@/interfaces/team.interfaces";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { ICreateTeam } from "@/interfaces/create-team-request/createTeam.interface";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";

export default function Page() {
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [error, setError] = useState<string | null>(null);
	const token = getCookie("access_token");
	const { role = [] } = useStore();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch("https://ordemdeservicosdev.onrender.com/api/team/get-all-teams", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setTeams(data);
				} else {
					console.error("Dados da API não são um array:", data);
					setError("Erro ao carregar dados da equipe.");
				}
			})
			.catch((err) => {
				console.error("Erro ao buscar os dados:", err);
				setError("Erro ao carregar dados da equipe.");
			}).finally(() => {
				setIsLoading(false);
			});
	}, [token]);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement | HTMLSelectElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement;
		};

		const request: ICreateTeam = {
			teamName: getInput("teamName").value || "",
			teamLeaderId: getInput("teamLeaderId").value || "",
		};

		toast.promise(
			fetch("https://ordemdeservicosdev.onrender.com/api/team/create-team", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(request),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Criando equipe",
				success: {
					render: "Equipe criada com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao criar equipe",
			}
		);
	};

	const [leaders, setLeaders] = useState<ITeamLeader[]>([]);

	useEffect(() => {
		fetch("https://ordemdeservicosdev.onrender.com/api/team/get-all-leaders", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => setLeaders(data))
			.catch((err) => console.error("Erro ao buscar líderes:", err));
	}, [token]);

	const availableLeaders = Array.isArray(leaders) ? leaders.filter((leader) => !leader.teamId) : [];

	return (
		<Container className="overflow-x-auto">
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
				<>
				{hasPermission(role, ["teams_management", "teamleader"], "read") && (
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-[#3b82f6] text-2xl font-bold">Equipes</CardTitle>
											<CardDescription>Cheque todas as informações relacionado aos membros apresentados.</CardDescription>
										</div>
										<div className="flex gap-3 items-center justify-between">
											{hasPermission(role, ["teams_management"], "create") && (
												<Dialog>
													<DialogTrigger asChild>
														<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
															Criar Equipe
														</Button>
													</DialogTrigger>
													<DialogContent className="sm:max-w-[425px]">
														<DialogHeader>
															<DialogTitle>Criar equipe</DialogTitle>
															<DialogDescription>Adicione os dados abaixo e crie uma nova equipe.</DialogDescription>
														</DialogHeader>
														<form
															action="#"
															onSubmit={(e) => onSubmit(e)}
															className="flex flex-col justify-center items-center"
														>
															<div className="flex flex-col gap-3 items-center max-w-96 w-full">
																<Input type="text" name="teamName" placeholder="Nome da equipe" className="w-full" />
																<select
																	name="teamLeaderId"
																	id="teamLeaderId"
																	className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full mb-4"
																>
																	<option value="">{"Selecione um líder"}</option>
																	{availableLeaders.map((leader, index) => (
																		<option value={leader.id} key={index}>
																			{leader.user.name}
																		</option>
																	))}
																</select>
																<Button
																	className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
																	type="submit"
																>
																	Criar
																</Button>
															</div>
														</form>
													</DialogContent>
												</Dialog>
											)}
										</div>
									</div>
								</CardHeader>

								<div className="p-3">
									{error ? (
										<p className="text-red-500">{error}</p>
									) : (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Nome da equipe</TableHead>
													<TableHead>Líder da equipe</TableHead>
													<TableHead>Ordens atribuídas</TableHead>
													<TableHead>Membros na equipe</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{teams.map((team, index) => (
													<TableRow
														key={index}
														className="cursor-pointer hover:bg-gray-100 whitespace-nowrap"
														style={{ cursor: "pointer" }}
														onClick={() => router.push(`/teams/${team.id}`)}
													>
														<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/teams/${team.id}`)}>
															{hasPermission(role, ["teams_management", "teamleader", "teammember"], "read") && (
																<span className="block w-full h-full">{team.teamName}</span>
															)}
														</TableCell>
														<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/teams/${team.id}`)}>
															{hasPermission(role, ["teams_management", "teamleader", "teammember"], "read") && (
																<span className="block w-full h-full">{team.leader.user.name}</span>
															)}
														</TableCell>
														<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/teams/${team.id}`)}>
															{hasPermission(role, ["teams_management", "teamleader", "teammember"], "read") && (
																<span className="block w-full h-full">{team.orders.length}</span>
															)}
														</TableCell>
														<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/teams/${team.id}`)}>
															{hasPermission(role, ["teams_management", "teamleader", "teammember"], "read") && (
																<span className="block w-full h-full">{team.members.length}</span>
															)}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									)}
								</div>
							</Card>
						</TabsContent>
					</Tabs>
							)}
						</>
				)}
			</main>
		</Container>
	);
}
