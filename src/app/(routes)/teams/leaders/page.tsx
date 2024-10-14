"use client";
import { Container } from "@/components/container";
import { ITeamLeader } from "@/interfaces/team.interfaces";
import React, { useEffect, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiTrash } from "react-icons/fi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { IUser } from "@/interfaces/user.interface";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [leaders, setLeaders] = useState<ITeamLeader[]>([]);
	const token = getCookie("access_token");
	const { role = [] } = useStore();
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		setIsLoading(true);
		if (hasPermission(role, ["teams_management", "teamleader"], "read")) {
			fetch(`${BASE_URL}/team/get-all-leaders`, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((data) => setLeaders(data))
				.catch((error) => console.error("Fetch error:", error))
				.finally(() => setIsLoading(false));
		}
	}, [token]);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		if (!hasPermission(role, ["teams_management"], "create")) {
			toast.error("Você não tem permissão para criar líderes de equipe.");
			return;
		}

		e.preventDefault();

		const id = (e.currentTarget.querySelector('[name="id"]') as HTMLSelectElement).value;

		try {
			toast.promise(
				fetch(`${BASE_URL}/team/create-leader`, {
					method: "POST",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ id }),
				}),
				{
					pending: "Criando líder de equipe",
					success: {
						render: "Líder de equipe criado com sucesso!",
						onClose: () => {
							window.location.reload();
						},
						autoClose: 1500,
					},
					error: "Ocorreu um erro ao criar um líder de equipe",
				}
			);
		} catch (error) {
			toast.error("Ocorreu um erro ao criar líder de equipe");
		}
	};

	useEffect(() => {
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
	}, [token]);

	const filteredUsers = Array.isArray(users) ? users.filter((user) => !user.isTeamMember && !user.isTeamLeader) : [];

	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(`${BASE_URL}/team/delete-leader/${id}`, {
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				toast.success("Líder de equipe excluído com sucesso!");
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				toast.error("Ocorreu um erro ao excluir o líder de equipe.");
			}
		} catch (error) {
			console.error("Erro ao deletar líder:", error);
			toast.error("Erro ao excluir o líder.");
		}
	};

	return (
		<Container className="p-4 overflow-x-auto">
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
											<div className="flex justify-between items-center">
												<div>
													<CardTitle className="text-[#3b82f6] text-2xl font-bold">Líderes</CardTitle>
													<CardDescription>
														Cheque todas as informações relacionado aos líderes apresentados.
													</CardDescription>
												</div>

												<div className="flex gap-3 items-center justify-between">
													{hasPermission(role, ["teams_management"], "create") && (
														<Dialog>
															<DialogTrigger asChild>
																<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
																	Criar
																</Button>
															</DialogTrigger>
															<DialogContent className="sm:max-w-[425px]">
																<DialogHeader>
																	<DialogTitle>Adicionar líder</DialogTitle>
																	<DialogDescription>
																		Selecione um usuário para atribuir à equipe como líder.
																	</DialogDescription>
																</DialogHeader>
																<form
																	action="#"
																	onSubmit={(e) => onSubmit(e)}
																	className="flex flex-col justify-center items-center"
																>
																	<div className="flex flex-col gap-3 items-center max-w-96 w-full">
																		<select
																			name="id"
																			className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full"
																		>
																			<option value="">Selecione um usuário</option>
																			{filteredUsers.map((users) => (
																				<option value={users.id} key={users.id}>
																					{users.name}
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
											<Table className="w-full bg-white shadow-md rounded-lg overflow-x-auto">
												<TableHeader>
													<TableRow>
														<TableHead className="font-bold">Nome</TableHead>
														<TableHead className="font-bold">E-mail</TableHead>
														<TableHead className="font-bold">Telefone</TableHead>
														<TableHead className="font-bold">Profissão</TableHead>
													</TableRow>
												</TableHeader>
												<TableBody>
													{leaders.map((leader, index) => (
														<TableRow key={index} className="hover:bg-gray-100 cursor-pointer">
															<TableCell className="whitespace-nowrap">{leader.user.name}</TableCell>
															<TableCell className="whitespace-nowrap">{leader.user.email}</TableCell>
															<TableCell className="whitespace-nowrap">{leader.user.phone}</TableCell>
															<TableCell className="whitespace-nowrap">
																{leader.user.role ? leader.user.role.roleName : "Não possui"}
															</TableCell>
															{hasPermission(role, "teams_management", "delete") && (
																<TableCell>
																	<Dialog>
																		<DialogTrigger asChild>
																			<Button variant="ghost">
																				<FiTrash className="text-red-500 hover:text-red-700" size={20} />
																			</Button>
																		</DialogTrigger>
																		<DialogContent className="sm:max-w-[425px]">
																			<DialogHeader>
																				<DialogTitle>Excluir Líder</DialogTitle>
																				<DialogDescription>
																					Tem certeza que deseja excluir o líder <b>{leader.user.name}</b>?
																					Esta ação não poderá ser desfeita.
																				</DialogDescription>
																			</DialogHeader>
																			<div className="flex justify-end space-x-4">
																				<Button variant="outline" onClick={() => console.log("Cancelado")}>
																					Cancelar
																				</Button>
																				<Button variant="destructive" onClick={() => handleDelete(leader.id)}>
																					Confirmar Exclusão
																				</Button>
																			</div>
																		</DialogContent>
																	</Dialog>
																</TableCell>
															)}
														</TableRow>
													))}
												</TableBody>
											</Table>
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
