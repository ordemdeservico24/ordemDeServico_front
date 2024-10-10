"use client";
import { useState, useEffect, FormEvent } from "react";
import { Container } from "@/components/container";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { IPrimaryGroup, ISecondaryGroup } from "@/interfaces/company.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
const BASE_URL = process.env.BASE_URL;
export default function SecondaryGroupsPage() {
	const token = getCookie("access_token");
	const [secondaryGroups, setSecondaryGroups] = useState<ISecondaryGroup[] | null>(null);
	const [primaryGroups, setPrimaryGroups] = useState<IPrimaryGroup[] | null>(null);
	const [primary, setPrimary] = useState<IPrimaryGroup | string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSecondaryGroups = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(`${BASE_URL}/company/get-all-secondaries`, {
					method: "GET",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setSecondaryGroups(data);
			} catch (error) {
				console.error("Erro ao buscar os grupos secundários:", error);
				setError("Erro ao carregar dados dos grupos secundários.");
			} finally {
				setIsLoading(false);
			}
		};

		const fetchPrimaryGroups = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(`${BASE_URL}/company/get-all-primaries`, {
					method: "GET",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setPrimaryGroups(data);
			} catch (error) {
				console.error("Erro ao buscar os estados:", error);
				setError("Erro ao carregar dados dos estados.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSecondaryGroups();
		fetchPrimaryGroups();
	}, [token]);

	const handleSelectChangePrimary = (value: string) => {
		setPrimary(value);
	};

	const handleAddCity = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: {
			cityName: string;
		} = {
			cityName: getInput("cityName").value || "",
		};
		try {
			const response = await toast.promise(
				fetch(`${BASE_URL}/company/create-secondary/${primary}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(request),
				}),
				{
					pending: "Criando Cidade",
					success: {
						render: "Cidade criada com sucesso",
						onClose: () => {
							window.location.reload();
						},
						autoClose: 1500,
					},
					error: "Ocorreu um erro ao criar",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to create category");
			}
		} catch (error) {
			console.error("Error creating category:", error);
			setError("Erro ao criar categoria.");
		}
	};

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
				) : error ? (
					<div className="text-center text-red-500 p-8">
						<span>{error}</span>
					</div>
				) : (
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">Cidades</CardTitle>
									<CardDescription>Veja todas as cidades cadastradas e informações adicionais.</CardDescription>
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
											Adicionar Cidade
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Adicionar nova cidade</DialogTitle>
											<DialogDescription>Adicione uma nova cidade para cadastras novos distritos a ela</DialogDescription>
										</DialogHeader>
										<form action="#" onSubmit={(e) => handleAddCity(e)} className=" flex flex-col justify-center items-center">
											<div className="flex gap-3 flex-col items-center max-w-96 w-full">
												<Select onValueChange={handleSelectChangePrimary}>
													<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
														<SelectValue placeholder="Escolha o estado da cidade" />
													</SelectTrigger>
													<SelectContent>
														{primaryGroups?.map((primary) => (
															<SelectItem key={primary.id} value={primary.id || ""}>
																{primary.stateName}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<Input type="text" name="cityName" placeholder="Nome da Cidade" className="w-full" />
												<Button
													className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
													type="submit"
												>
													Criar Cidade
												</Button>
											</div>
										</form>
									</DialogContent>
								</Dialog>
							</div>
						</CardHeader>
						<div>
							<Table className="overflow-x-auto">
								<TableHeader>
									<TableRow>
										<TableCell className="whitespace-nowrap">Nome da Cidade</TableCell>
										<TableCell className="whitespace-nowrap">Estado</TableCell>
										<TableCell className="whitespace-nowrap">Distritos</TableCell>
										<TableCell className="whitespace-nowrap">Empresa</TableCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.isArray(secondaryGroups) &&
										secondaryGroups.map((group) => (
											<TableRow key={group.id}>
												<TableCell className="whitespace-nowrap">{group.cityName}</TableCell>
												<TableCell className="whitespace-nowrap">{group.primary.stateName}</TableCell>
												<TableCell className="whitespace-nowrap">{group.tertiaries?.length || 0} terciários</TableCell>
												<TableCell className="whitespace-nowrap">{group.company.companyName || "N/A"}</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						</div>
					</Card>
				)}
			</main>
		</Container>
	);
}
