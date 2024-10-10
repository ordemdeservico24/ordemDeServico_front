"use client";
import { Container } from "@/components/container";
import { IRole, IUser } from "@/interfaces/user.interface";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { EditIcon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import MoneyFormatter from "@/components/formatMoneyValues";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function UserPage({ params }: { params: { id: string } }) {
	const [user, setUser] = useState<IUser>();
	const [roles, setRoles] = useState<IRole[]>([]);
	const [selectedRole, setSelectedRole] = useState<string>("");
	const token = getCookie("access_token");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BASE_URL}/user/get-user/${params.id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error! status: ${res.status}`);
				}
				return res.json();
			})
			.then((data) => {
				setUser(data);
			})
			.catch((err) => {
				console.error(err);
			}),
			fetch(`${BASE_URL}/user/get-all-roles`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("Resposta da API:", data);
					if (Array.isArray(data)) {
						setRoles(data);
					} else if (data && Array.isArray(data.users)) {
						setRoles(data.users);
					} else {
						setRoles([]);
					}
				})
				.catch((error) => {
					console.error("Erro ao buscar usuários:", error);
					setRoles([]);
				})
				.finally(() => setIsLoading(false));
	}, [params.id, token]);

	const handleSelectChange = (value: string) => {
		setSelectedRole(value);
	};

	const assignRole = async () => {
		toast.promise(
			fetch(`${BASE_URL}/user/assign-role/${params.id}`, {
				method: "PATCH",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ roleId: selectedRole }),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
					throw new Error("Falha ao atribuir cargo");
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Atribuindo cargo...",
				success: {
					render: "Cargo atribuído com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao atribuir cargo",
			}
		);
	};

	const addSalary = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request = {
			salary: getInput("salary").value || 0,
		};

		toast.promise(
			fetch(`${BASE_URL}/user/add-salary/${params.id}`, {
				method: "PATCH",
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
					throw new Error("Falha ao adicionar salário");
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Adicionando salário...",
				success: {
					render: "Salário adicionado com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao adicionar salário",
			}
		);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const day = String(date.getUTCDate()).padStart(2, "0");
		return `${day}/${month}/${year}`;
	};

	return (
		<Container className="p-4">
			<main className="grid flex-1 items-start gap-8 sm:px-6 sm:py-0 md:gap-12">
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
						{user ? (
							<>
								<Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
									<CardHeader className="bg-white p-4 flex flex-row-reverse justify-between items-center">
										<Link href="/users">
											<Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">Voltar</Button>
										</Link>
										<h1 className="text-2xl font-semibold">
											{user.isUser ? "Usuário" : "Funcionário"} - {user.name}
										</h1>
									</CardHeader>
									<CardContent className="p-6 space-y-6">
										<div className="border-b border-gray-300 pb-4 mb-4">
											<h2 className="text-xl font-semibold mb-4">Dados do {user.isUser ? "Usuário" : "Funcionário"}</h2>
											<div className="space-y-2">
												<p className="text-gray-700">
													<strong className="font-medium">Email:</strong> {user.email ? user.email : "Não possui"}
												</p>
												<p className="text-gray-700">
													<strong className="font-medium">Telefone:</strong> {user.phone}
												</p>
												<p className="text-gray-700">
													<strong className="font-medium">Cargo:</strong>{" "}
													{user.role?.roleName ? user.role?.roleName : "Não possui"}
												</p>
												<p className="text-gray-700">
													<strong className="font-medium">Distrito:</strong> {user.tertiary.districtName}
												</p>
												<p className="text-gray-700">
													<strong className="font-medium">Data de Início na Empresa:</strong>{" "}
													{user.startCompanyDate ? formatDate(user.startCompanyDate) : "Não informado"}
												</p>
												<p className="text-gray-700 flex gap-1">
													<strong className="font-medium">Salário:</strong>{" "}
													{user.salary === 0 ? (
														<Dialog>
															<DialogTrigger asChild>
																<p className="cursor-pointer">Adicionar salário</p>
															</DialogTrigger>
															<DialogContent className="sm:max-w-[425px]">
																<DialogHeader>
																	<DialogTitle>Adicionar Salário</DialogTitle>
																	<DialogDescription>
																		Adicione um salário a este usuário e transforme ele num funcionário.
																	</DialogDescription>
																</DialogHeader>
																<form
																	action="#"
																	onSubmit={(e) => addSalary(e)}
																	className=" flex flex-col justify-center items-center"
																>
																	<div className="flex gap-3 flex-col items-center max-w-96 w-full">
																		<Input
																			type="number"
																			step="0.01"
																			name="salary"
																			placeholder="Valor do salário em Reais"
																			className="w-full"
																		/>
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
													) : (
														<MoneyFormatter value={user.salary || 0} currency="BRL" />
													)}
												</p>
											</div>
										</div>
									</CardContent>
									<CardContent className="px-6 space-y-6">
										<div className="flex items-center space-x-4 w-fit">
											<Select onValueChange={handleSelectChange} value={selectedRole}>
												<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
													<SelectValue placeholder={user.role ? user.role.roleName : "Atribua um cargo"} />
												</SelectTrigger>
												<SelectContent>
													{roles.map((role) => (
														<SelectItem key={role.id} value={role.id}>
															{role.roleName}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button variant="default" className="bg-blue-500 hover:bg-blue-600" onClick={assignRole}>
												Selecionar
											</Button>
										</div>
									</CardContent>
								</Card>
								{user.role ? (
									<Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
										<CardHeader className="bg-white p-4 flex justify-between items-center">
											<h1 className="text-2xl font-semibold">Recursos e Permissões</h1>
										</CardHeader>
										<CardContent className="p-6">
											{user.role?.permissions.map((permission, index) => (
												<div key={index} className="flex gap-4 mb-4 md:mb-8">
													<span className=" text-sm sm:text-base lg:text-xl font-semibold w-full">
														{permission.resourceLabel}
													</span>
													<ul className="list-none flex gap-2 md:gap-4">
														<li className="rounded text-sm capitalize hover:cursor-pointer " title="Criar">
															<PlusIcon
																className={
																	permission.operations.includes("create")
																		? "opacity-100 size-5 md:size-6"
																		: "opacity-20 size-5 md:size-6"
																}
															/>
														</li>
														<li className="rounded text-sm capitalize hover:cursor-pointer " title="Criar">
															<EyeIcon
																className={
																	permission.operations.includes("read")
																		? "opacity-100 size-5 md:size-6"
																		: "opacity-20 size-5 md:size-6"
																}
															/>
														</li>
														<li className="rounded text-sm capitalize hover:cursor-pointer " title="Criar">
															<EditIcon
																className={
																	permission.operations.includes("update")
																		? "opacity-100 size-5 md:size-6"
																		: "opacity-20 size-5 md:size-6"
																}
															/>
														</li>
														<li className="rounded text-sm capitalize hover:cursor-pointer " title="Criar">
															<TrashIcon
																className={
																	permission.operations.includes("delete")
																		? "opacity-100 size-5 md:size-6"
																		: "opacity-20 size-5 md:size-6"
																}
															/>
														</li>
													</ul>
												</div>
											))}
										</CardContent>
									</Card>
								) : (
									""
								)}
							</>
						) : (
							<div className="text-center mt-10">
								<h1 className="text-xl font-bold text-gray-700">Não há usuário com este id</h1>
							</div>
						)}
					</>
				)}
			</main>
		</Container>
	);
}
