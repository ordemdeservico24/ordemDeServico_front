"use client";
import { Container } from "@/components/container";
import { ITeam } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AssignTeamLeader } from "@/components/assignTeamLeader";
import { ICreateTeam } from "@/interfaces/create-team-request/createTeam.interface";
import { toast } from "react-toastify";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import Image from "next/image"
import ImageProfile from '../../../assets/profile.png'


export default function Page() {
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetch("https://ordemdeservicosdev.onrender.com/api/team/get-all-teams", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
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
	}, []);
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement;
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
						Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
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

	return (
		<Container className="overflow-x-auto">
			<header className="z-30 flex justify-start items-start border-b flex-col md:flex-row md:justify-between md:items-center gap-2 bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          		<Breadcrumb className="md:flex">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
							<Link href="/home">Dashboard</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
					  <BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Equipes</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
			  	</Breadcrumb>
			  	<div className="flex flex-row-reverse md:flex-row items-center gap-3 pb-3">
				  	<h1>Débora Almeida</h1>
				  	<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="overflow-hidden rounded-full"
							>
								<Image
									src={ImageProfile}
									width={36}
									height={36}
									alt="Avatar"
									className="overflow-hidden rounded-full"
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Minha conta</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Configurações</DropdownMenuItem>
							<DropdownMenuItem>Suporte</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Sair</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
			  	</div>
			</header>

			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Equipes</CardTitle>
								<CardDescription>Cheque todas as informações relacionado aos membros apresentados.</CardDescription>
							  <div className="flex items-center justify-between">
								  
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
									<AssignTeamLeader />
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
