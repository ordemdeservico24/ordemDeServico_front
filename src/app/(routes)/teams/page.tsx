"use client";
import { Container } from "@/components/container";
import { ITeam, ITeamLeader } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { getCookie } from 'cookies-next';
import { ICreateTeam } from "@/interfaces/create-team-request/createTeam.interface";

export default function Page() {
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [error, setError] = useState<string | null>(null);
	const token = getCookie('access_token');

	useEffect(() => {
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
			});
	}, [token]);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement | HTMLSelectElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement | HTMLSelectElement;
		};

		const request: ICreateTeam = {
			teamName: getInput("teamName").value || "",
			teamLeaderId: getInput("teamLeaderId").value || "",
		};

		toast.promise(
			fetch(
				"https://ordemdeservicosdev.onrender.com/api/team/create-team",
				{
					method: "POST",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(request),
				}
			)
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
				success: "Equipe criada com sucesso!",
				error: "Ocorreu um erro ao criar equipe",
			}
		);
	};

	const [leaders, setLeaders] = useState<ITeamLeader[]>([]);

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-leaders",
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => setLeaders(data))
			.catch((err) => console.error("Erro ao buscar líderes:", err));
	}, [token]);

	const availableLeaders = Array.isArray(leaders)? leaders.filter((leader) =>!leader.teamId) : [];

	return (
		<Container className="overflow-x-auto">
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Equipes</CardTitle>
								<CardDescription>Cheque todas as informações relacionado aos membros apresentados.</CardDescription>
							  <div className="flex gap-3 items-center justify-between">
								  
								  <div className="relative flex-1 md:grow-0">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										type="search"
										placeholder="Pesquisar..."
										className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
									/>
								</div>
							  		<Dialog>
									<DialogTrigger asChild>
										<Button variant="default" className="bg-blue-500 hover:bg-blue-600">Criar</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
							<DialogTitle>Criar equipe</DialogTitle>
							<DialogDescription>
								Adicione os dados abaixo e crie uma nova equipe.
							</DialogDescription>
							</DialogHeader>
								<form
									action="#"
									onSubmit={(e) => onSubmit(e)}
									className="flex flex-col justify-center items-center"
								>
								<div className="flex flex-col gap-3 items-center max-w-96 w-full">
									<Input
										type="text"
										name="teamName"
										placeholder="Nome da equipe"
										className="w-full"
									/>
									<select
										name="teamLeaderId"
										id="teamLeaderId"
										className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full mb-4"
									>
										<option value="">{"Selecione um líder"}</option>
										{availableLeaders.map((leader, index) => (
											<option value={leader.id} key={index}>
												{leader.name}
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
								</div>
						  </CardHeader>
						  
						  	<div className="p-3">
				{error? (
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
								>
									<TableCell>
										<Link href={`/teams/${team.id}`}>
											<span className="block w-full h-full">{team.teamName}</span>
										</Link>
									</TableCell>
									<TableCell>
										<Link href={`/teams/${team.id}`}>
											<span className="block w-full h-full">{team.leader.name}</span>
										</Link>
									</TableCell>
									<TableCell>
										<Link href={`/teams/${team.id}`}>
											<span className="block w-full h-full">{team.orders.length}</span>
										</Link>
									</TableCell>
									<TableCell>
										<Link href={`/teams/${team.id}`}>
											<span className="block w-full h-full">{team.members.length}</span>
										</Link>
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
			</main>
		
				
		</Container>
	);
}