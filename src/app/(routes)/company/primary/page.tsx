"use client";
import { useState, useEffect, FormEvent } from "react";
import { Container } from "@/components/container";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCookie } from "cookies-next";
import { IPrimaryGroup } from "@/interfaces/company.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useStore } from "@/zustandStore";
import { IUser } from "@/interfaces/user.interface";
const BASE_URL = process.env.BASE_URL;
export default function PrimaryGroupsPage() {
	const token = getCookie("access_token");
	const [primaryGroups, setPrimaryGroups] = useState<IPrimaryGroup[] | null>(null);
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { userId } = useStore();

	useEffect(() => {
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
				console.error("Erro ao buscar os grupos primários:", error);
				setError("Erro ao carregar dados dos grupos primários.");
			} finally {
				setIsLoading(false);
			}
		};

		const fetchUser = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch(`https://ordemdeservicosdev.onrender.com/api/user/get-user/${userId}`, {
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
				setUser(data);
			} catch (error) {
				console.error("Erro ao buscar o usuário:", error);
				setError("Erro ao carregar dados do usuário.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPrimaryGroups();
		fetchUser();
	}, [token]);

	const handleAddState = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: {
			stateName: string;
		} = {
			stateName: getInput("stateName").value || "",
		};
		try {
			const response = await toast.promise(
				fetch(`https://ordemdeservicosdev.onrender.com/api/company/create-primary/${user?.companyId}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(request),
				}),
				{
					pending: "Adicionando Estado",
					success: {
						render: "Estado adicionado com sucesso",
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
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">Estados</CardTitle>
									<CardDescription>Veja os estados em que sua empresa está atuando.</CardDescription>
								</div>
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
											Adicionar Novo Estado
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Adicionar nova cidade</DialogTitle>
											<DialogDescription>Adicione uma nova cidade para cadastras novos distritos a ela</DialogDescription>
										</DialogHeader>
										<form action="#" onSubmit={(e) => handleAddState(e)} className=" flex flex-col justify-center items-center">
											<div className="flex gap-3 flex-col items-center max-w-96 w-full">
												<Input type="text" name="stateName" placeholder="Nome do Estado" className="w-full" />
												<Button
													className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
													type="submit"
												>
													Adicionar Estado
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
										<TableCell className="whitespace-nowrap">Nome do Estado</TableCell>
										<TableCell className="whitespace-nowrap">Cidades</TableCell>
										<TableCell className="whitespace-nowrap">Empresa</TableCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.isArray(primaryGroups) &&
										primaryGroups.map((group) => (
											<TableRow key={group.id}>
												<TableCell className="whitespace-nowrap">{group.stateName}</TableCell>
												<TableCell className="whitespace-nowrap">{group.secondaries?.length}</TableCell>
												<TableCell className="whitespace-nowrap">{group.company.companyName}</TableCell>
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
