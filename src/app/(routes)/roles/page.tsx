"use client";
import { Container } from "@/components/container";
import InputCreateRole from "@/components/inputCreateRole";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { IRoleRequest } from "@/interfaces/create-role-request/createRole.interface";
import { IRole, IRolePermission } from "@/interfaces/user.interface";
import { getCookie } from "cookies-next";
import { EditIcon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
	const [roles, setRoles] = useState<IRole[]>([]);
	const token = getCookie("access_token");
	const [permissions, setPermissions] = useState<IRolePermission[]>([]);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	const addResource = (resource: string, resourceLabel: string) => {
		setPermissions((prev) => {
			const existingResource = prev.find((item) => item.resource === resource);

			if (existingResource) {
				// Se já existir, podemos simplesmente retornar sem mudar
				return prev;
			} else {
				// Se não existir, adicionamos um novo objeto para o resource
				return [
					...prev,
					{
						operations: [], // Inicializa como um array vazio
						resource,
						resourceLabel,
					},
				];
			}
		});
	};

	const toggleOperation = (resource: string, operation: string) => {
		setPermissions((prev) => {
			return prev.map((item) => {
				if (item.resource === resource) {
					if (item.operations.includes(operation)) {
						// Se a operação já está lá, remova-a
						return {
							...item,
							operations: item.operations.filter((op) => op !== operation),
						};
					} else {
						// Se não está lá, adicione-a
						return {
							...item,
							operations: [...item.operations, operation],
						};
					}
				}
				return item; // Retorna o item inalterado
			});
		});
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: IRoleRequest = {
			roleName: getInput("roleName").value || "",
			permissions,
			roleLevel: getInput("roleLevel").value || "",
		};
		console.log(request);
		toast.promise(
			fetch(`https://ordemdeservicosdev.onrender.com/api/user/create-role`, {
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
				pending: "Criando cargo",
				success: {
					render: "Cargo criado com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao criar cargo",
			}
		);
	};

	useEffect(() => {
		setIsLoading(true);
		fetch("https://ordemdeservicosdev.onrender.com/api/user/get-all-roles", {
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
			}).finally(() => {
				setIsLoading(false);
			});
	}, [token]);

	const deleteRole = async (roleId: string) => {
		toast.promise(
			fetch(`https://ordemdeservicosdev.onrender.com/api/user/delete-role/${roleId}`, {
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
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
				pending: "Deletando cargo",
				success: {
					render: "Cargo deletado com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao deletar o cargo",
			}
		);
	};

	return (
		<Container className="p-4">
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
				
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-[#3b82f6] text-2xl font-bold">Cargos</CardTitle>
											<CardDescription>Cheque todas as informações relacionadas aos cargos de usuários.</CardDescription>
										</div>
										<div>
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
														Criar
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-fit">
													<DialogHeader>
														<DialogTitle>Criar cargo</DialogTitle>
														<DialogDescription>Adicione as informações para criar um cargo.</DialogDescription>
													</DialogHeader>
													<form action="#" onSubmit={(e) => onSubmit(e)} className="flex flex-col justify-center items-center">
														<div className="flex gap-3 flex-col items-center max-w-full w-full">
															<div className="flex flex-col md:flex-row max-h-fit md:max-h-12 gap-4 w-full">
																<Input
																	type="text"
																	name="roleName"
																	placeholder="Nome do cargo"
																	className="w-full h-full"
																/>
																<select
																	name="roleLevel"
																	className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full h-full mb-1"
																>
																	<option value="">Selecione a abrangência</option>
																	<option value="primary">Empresa</option>
																	<option value="tertiary">Distrito</option>
																</select>
															</div>
															<div className="w-full md:w-[600px] flex flex-col gap-4">
																<h1 className="text-left mb-1">Recursos:</h1>
																<InputCreateRole
																	resource="orders_management"
																	resourceLabel="Gestão em Ordens de Serviço"
																	permissions={permissions}
																	toggleOperation={toggleOperation}
																	addResource={addResource}
																/>
																<InputCreateRole
																	resource="teams_management"
																	resourceLabel="Gestão em Equipes"
																	permissions={permissions}
																	toggleOperation={toggleOperation}
																	addResource={addResource}
																/>
																<InputCreateRole
																	resource="teamleader"
																	resourceLabel="Líder de Equipe"
																	permissions={permissions}
																	toggleOperation={toggleOperation}
																	addResource={addResource}
																/>
																<InputCreateRole
																	resource="teammember"
																	resourceLabel="Membro de equipe"
																	permissions={permissions}
																	toggleOperation={toggleOperation}
																	addResource={addResource}
																/>
																<InputCreateRole
																	resource="roles_management"
																	resourceLabel="Gestão em Cargos"
																	permissions={permissions}
																	toggleOperation={toggleOperation}
																	addResource={addResource}
																/>
																<InputCreateRole
																	resource="admin_management"
																	resourceLabel="Gestão Administrativa"
																	permissions={permissions}
																	toggleOperation={toggleOperation}
																	addResource={addResource}
																/>
															</div>
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
									</div>
								</CardHeader>

								<div className="p-3">
									<div className="w-full overflow-x-auto">
										<Table className="min-w-[600px] bg-white shadow-md rounded-lg">
											<TableHeader>
												<TableRow>
													<TableHead className="font-bold">Nome</TableHead>
													<TableHead className="font-bold">Abrangência</TableHead>
													<TableHead className="font-bold">Usuários</TableHead>
													<TableHead></TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{roles &&
													roles.length > 0 &&
													roles.map((role, index) => (
														<TableRow key={index} className="border-b">
															<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/roles/${role.id}`)}>
																{role.roleName}
															</TableCell>
															<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/roles/${role.id}`)}>
																{role.roleLevel === "primary" ? "Empresa" : "Distrito"}
															</TableCell>
															<TableCell style={{ cursor: "pointer" }} onClick={() => router.push(`/roles/${role.id}`)}>
																{role._count?.users || 0}
															</TableCell>
															<TableCell className="p-0">
																<TrashIcon className="hover:cursor-pointer" onClick={() => deleteRole(role.id)} />
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>
								</div>
							</Card>
						</TabsContent>
					</Tabs>
				)}
			</main>
		</Container>
	);
}
