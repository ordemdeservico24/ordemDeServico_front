"use client";
import { Container } from "@/components/container";
import { useRouter } from "next/navigation";
import { IUser } from "@/interfaces/user.interface";
import React, { FormEvent, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ICreateUserRequest } from "@/interfaces/create-user-request/createUser.interface";
import { toast } from "react-toastify";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function Page() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const token = getCookie("access_token");
	const router = useRouter();

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: ICreateUserRequest = {
			name: getInput("name").value || "",
			email: getInput("email").value || "",
			password: getInput("password").value || "",
			phone: getInput("phone").value || "",
			tertiaryGroupId: getInput("tertiaryGroupId").value || "",
			typeOfProfileId: getInput("typeOfProfileId").value || "",
			roleId: getInput("roleId").value || "",
		};

		toast.promise(
			fetch(`https://ordemdeservicosdev.onrender.com/api/user/create-user/:id`, {
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
				pending: "Criando usuário",
				success: "Usuário criado com sucesso!",
				error: "Ocorreu um erro ao criar usuário",
			}
		);
	};

	const fetchUsers = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const limit = 10;
			const offset = limit * (currentPage - 1);

			const response = await fetch(`https://ordemdeservicosdev.onrender.com/api/user/get-all-users?limit=${limit}&offset=${offset}`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (Array.isArray(data.users)) {
				setUsers(data.users);
				setTotalPages(Math.ceil(data.total / limit));
			} else {
				setError("Dados recebidos não são um array.");
			}
		} catch (error: Error | any) {
			setError(error.message || "Erro ao carregar os usuários");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [currentPage, token]);

	return (
		<Container className="p-4">
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-[#3b82f6] text-2xl font-bold">Usuários</CardTitle>
										<CardDescription>Cheque todas as informações relacionadas aos usuários.</CardDescription>
									</div>
									<div>
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
													Criar
												</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>Adicionar usuário</DialogTitle>
													<DialogDescription>Adicione as informações para criar um usuário.</DialogDescription>
												</DialogHeader>
												<form action="#" onSubmit={(e) => onSubmit(e)} className=" flex flex-col justify-center items-center">
													<div className="flex gap-3 flex-col items-center max-w-96 w-full">
														<Input type="text" name="name" placeholder="Nome do usuário" className="w-full" />
														<Input type="email" name="email" placeholder="Email" className="w-full" />
														<Input type="password" name="password" placeholder="Senha" className="w-full" />
														<Input type="tel" name="phone" placeholder="Telefone" className="w-full" />
														<select
															name="tertiaryGroupId"
															id="tertiaryGroupId"
															className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full mb-1"
														>
															<option value="">Selecione um grupo terciário</option>
														</select>
														<select
															name="typeOfProfileId"
															id="typeOfProfileId"
															className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full mb-1"
														>
															<option value="">Selecione o tipo de perfil</option>
														</select>
														<select
															name="roleId"
															id="roleId"
															className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full mb-1"
														>
															<option value="">Selecione um cargo</option>
														</select>
														<Button
															className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
															type="submit"
														>
															Criar
														</Button>
													</div>
												</form>
											</DialogContent>
										</Dialog>
									</div>
								</div>
							</CardHeader>

							<div className="p-3">
								<div className="w-full overflow-x-auto">
									<Table className="min-w-[600px] bg-white shadow-md rounded-lg">
										<TableHeader>
											<TableRow>
												<TableHead className="font-bold">Nome</TableHead>
												<TableHead className="font-bold">Email</TableHead>
												<TableHead className="font-bold">Telefone</TableHead>
												<TableHead className="font-bold">Cargo</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{isLoading ? (
												<TableRow>
													<TableCell colSpan={5} className="text-center">
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
													</TableCell>
												</TableRow>
											) : error ? (
												<TableRow>
													<TableCell colSpan={5} className="text-center text-red-500">
														{error}
													</TableCell>
												</TableRow>
											) : (
												users.map((user, index) => (
													<TableRow key={index} className="border-b">
														<TableCell>{user.name}</TableCell>
														<TableCell>{user.email}</TableCell>
														<TableCell>{user.phone}</TableCell>
														<TableCell>{user.role?.roleName}</TableCell>
														<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/users/${user.id}`)}>
															<Button variant="outline">Ver dados</Button>
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
									</Table>
								</div>
							</div>
							<div className="flex items-center justify-between pt-0 pb-4">
								<Pagination>
									<PaginationContent>
										<PaginationPrevious
											style={{ cursor: "pointer" }}
											onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
											className={`${currentPage === 1 ? "disabled" : ""}`}
										>
											Anterior
										</PaginationPrevious>

										{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
											<PaginationItem key={page}>
												<PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
													{page}
												</PaginationLink>
											</PaginationItem>
										))}

										<PaginationNext
											style={{ cursor: "pointer" }}
											onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
											className={`${currentPage === totalPages ? "disabled" : ""}`}
										>
											Próximo
										</PaginationNext>
									</PaginationContent>
								</Pagination>
							</div>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</Container>
	);
}
