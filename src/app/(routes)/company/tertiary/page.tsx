"use client";
import { useState, useEffect, FormEvent } from "react";
import { Container } from "@/components/container";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { ISecondaryGroup, ITertiaryGroup } from "@/interfaces/company.interface";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function TertiaryGroupsPage() {
	const token = getCookie("access_token");
	const [tertiaryGroups, setTertiaryGroups] = useState<ITertiaryGroup[] | null>(null);
	const [secondaryGroups, setSecondaryGroups] = useState<ISecondaryGroup[] | null>(null);
	const [secondary, setSecondary] = useState<ISecondaryGroup | string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchTertiaryGroups = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(`${BASE_URL}/company/get-all-tertiaries`, {
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
				setTertiaryGroups(data);
			} catch (error) {
				console.error("Erro ao buscar os grupos terciários:", error);
				setError("Erro ao carregar dados dos grupos terciários.");
			} finally {
				setIsLoading(false);
			}
		};

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
				console.error("Erro ao buscar os grupos terciários:", error);
				setError("Erro ao carregar dados dos grupos terciários.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTertiaryGroups();
		fetchSecondaryGroups();
	}, [token]);

	const handleSelectChangeSecondary = (value: string) => {
		setSecondary(value);
	};

	const handleAddDistrict = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: {
			districtName: string;
		} = {
			districtName: getInput("districtName").value || "",
		};
		try {
			const response = await toast.promise(
				fetch(`${BASE_URL}/company/create-tertiary/${secondary}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(request),
				}),
				{
					pending: "Criando Distrito",
					success: {
						render: "Distrito criado com sucesso",
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
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">Distritos</CardTitle>
									<CardDescription>Veja todas as informações relacionadas aos distritos.</CardDescription>
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
											Criar Novo Distrito
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Adicionar nova distrito</DialogTitle>
											<DialogDescription>
												Adicione um novo distrito para que os usuários/funcionários entrem nele
											</DialogDescription>
										</DialogHeader>
										<form
											action="#"
											onSubmit={(e) => handleAddDistrict(e)}
											className=" flex flex-col justify-center items-center"
										>
											<div className="flex gap-3 flex-col items-center max-w-96 w-full">
												<Select onValueChange={handleSelectChangeSecondary}>
													<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
														<SelectValue placeholder="Escolha a cidade do distrito" />
													</SelectTrigger>
													<SelectContent>
														{secondaryGroups?.map((secondary) => (
															<SelectItem key={secondary.id} value={secondary.id || ""}>
																{secondary.cityName}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<Input type="text" name="districtName" placeholder="Nome do Distrito" className="w-full" />
												<Button
													className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
													type="submit"
												>
													Criar Distrito
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
										<TableCell className="whitespace-nowrap">Nome do Distrito</TableCell>
										<TableCell className="whitespace-nowrap">Cidade</TableCell>
										<TableCell className="whitespace-nowrap">Usuários</TableCell>
										<TableCell className="whitespace-nowrap">Ordens</TableCell>
										<TableCell className="whitespace-nowrap">Equipes</TableCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.isArray(tertiaryGroups) &&
										tertiaryGroups.map((group) => (
											<TableRow
												key={group.id}
												style={{ cursor: "pointer" }}
												onClick={() => router.push(`/company/tertiary/${group.id}`)}
											>
												<TableCell className="whitespace-nowrap">{group.districtName}</TableCell>
												<TableCell className="whitespace-nowrap">{group.secondary.cityName}</TableCell>
												<TableCell className="whitespace-nowrap">{group.users?.length || 0} usuários</TableCell>
												<TableCell className="whitespace-nowrap">{group.orders?.length || 0} ordens</TableCell>
												<TableCell className="whitespace-nowrap">{group.subjects?.length || 0} equipes</TableCell>
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
