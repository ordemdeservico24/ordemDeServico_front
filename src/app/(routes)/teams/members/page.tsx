"use client";
import { Container } from "@/components/container";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { z } from "zod";
import { IUser } from "@/interfaces/user.interface";
import { ITeam, ITeamMember } from "@/interfaces/team.interfaces";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
import { FiTrash } from "react-icons/fi";

const createMemberSchema = z.object({
	id: z.string().nonempty("Usuário é obrigatório."),
	teamId: z.string().nonempty("Equipe é obrigatória."),
});

export default function Page() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [members, setMembers] = useState<ITeamMember[]>([]);
	const token = getCookie("access_token");
	const { role = [] } = useStore();

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		if (!hasPermission(role, ["teams_management", "teamleader"], "create")) {
			toast.error("Você não tem permissão para criar membros de equipe.");
			return;
		}

		e.preventDefault();

		const getInput = (name: string): HTMLSelectElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLSelectElement;
		};

		const request = {
			id: getInput("id").value || "",
			teamId: getInput("teamId").value || "",
		};

		const result = createMemberSchema.safeParse(request);

		if (!result.success) {
			console.log(result);
			result.error.errors.forEach((err) => {
				toast.error(err.message);
			});
			return;
		}

		toast.promise(
			fetch(
				"https://ordemdeservicosdev.onrender.com/api/team/create-member",
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
				pending: "Criando membro de equipe",
				success: "Membro de equipe criado com sucesso!",
				error: "Ocorreu um erro ao criar membro de equipe",
			}
		);
	};

	useEffect(() => {
		if (hasPermission(role, ["teams_management", "teamleader", "teammember"], "read")) {
			fetch(
				"https://ordemdeservicosdev.onrender.com/api/team/get-all-members",
				{
					method: "GET",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					setMembers(data);
				});
		}
	}, [token]);

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-teams",
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				setTeams(data);
			});
	}, [token]);

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/user/get-all-users",
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				setUsers(data);
			})
			.catch((error) => {
				console.error("Fetch error:", error);
				setUsers([]);
			});
	}, [token]);

	const filteredUsers = Array.isArray(users)
		? users.filter((user) => !user.isTeamMember && !user.isTeamLeader)
		: [];

	const handleDeleteMember = (id: string) => {
		if (!hasPermission(role, ["teams_management", "teamleader"], "delete")) {
			toast.error("Você não tem permissão para excluir membros de equipe.");
			return;
		}
	
		toast.promise(
			fetch(
				`https://ordemdeservicosdev.onrender.com/api/team/delete-member/${id}`,
				{
					method: "DELETE",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
				.then((res) => {
					if (res.ok) {
						setMembers((prevMembers) =>
							prevMembers.filter((member) => member.id !== id)
						);
						return res.json();
					} else {
						throw new Error("Erro ao excluir o membro");
					}
				})
				.catch((error) => {
					console.error("Erro:", error);
				}),
			{
				pending: "Excluindo membro da equipe...",
				success: "Membro da equipe excluído com sucesso!",
				error: "Ocorreu um erro ao excluir o membro da equipe.",
			}
		);
	};

	return (
		<Container className="p-4">
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				{hasPermission(role, ["teams_management", "teamleader", "teammember"], "read") && (
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">
										Membros
									</CardTitle>
									<CardDescription>
										Cheque todas as informações relacionadas aos
										membros apresentados.
									</CardDescription>
									<div className="flex gap-3 items-center justify-between">
										{hasPermission(role, ['teams_management', 'teamleader'], 'create') && (
											<Dialog>
												<DialogTrigger asChild>
													<Button
														variant="default"
														className="bg-blue-500 hover:bg-blue-600"
													>
														Criar
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>
															Adicionar membro
														</DialogTitle>
														<DialogDescription>
															Selecione o usuário e a
															equipe para criar um membro.
														</DialogDescription>
													</DialogHeader>
													<form
														action="#"
														onSubmit={(e) => onSubmit(e)}
														className="flex flex-col justify-center items-center"
													>
														<div className="flex gap-3 flex-col items-center max-w-96 w-full">
															<select
																name="id"
																className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full"
															>
																<option value="">
																	Selecione um usuário
																</option>
																{filteredUsers.map(
																	(user, index) => (
																		<option
																			value={
																				user.id
																			}
																			key={index}
																		>
																			{user.name}
																		</option>
																	)
																)}
															</select>
															<select
																name="teamId"
																className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full"
															>
																<option value="">
																	Selecione uma equipe
																</option>
																{teams.map(
																	(team, index) => (
																		<option
																			value={
																				team.id
																			}
																			key={index}
																		>
																			{
																				team.teamName
																			}
																		</option>
																	)
																)}
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
								</CardHeader>
								<div className="p-3">
									<Table className="w-full bg-white shadow-md rounded-lg overflow-x-auto">
										<TableHeader>
											<TableRow>
												<TableHead className="font-bold">
													Nome
												</TableHead>
												<TableHead className="font-bold">
													E-mail
												</TableHead>
												<TableHead className="font-bold">
													Telefone
												</TableHead>
												<TableHead className="font-bold">
													Profissão
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{members.map((member, index) => (
												<TableRow
													key={index}
													className="hover:bg-gray-100 cursor-pointer"
												>
													<TableCell>
														{member.user.name}
													</TableCell>
													<TableCell>
														{member.user.email}
													</TableCell>
													<TableCell>
														{member.user.phone}
													</TableCell>
													<TableCell>
														{member.user.role.roleName}
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
																			Tem certeza que deseja excluir o líder <b>{member.user.name}</b>?
																			Esta ação não poderá ser desfeita.
																		</DialogDescription>
																	</DialogHeader>
																	<div className="flex justify-end space-x-4">
																		<Button variant="outline" onClick={() => console.log("Cancelado")}>
																			Cancelar
																		</Button>
																		<Button
																			variant="destructive"
																			onClick={() => handleDeleteMember(member.id)}
																		>
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
			</main>
		</Container>
	);
}
