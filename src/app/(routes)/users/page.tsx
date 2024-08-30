"use client";
import { Container } from "@/components/container";
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
import { Search } from "lucide-react";
import { getCookie } from 'cookies-next';
import Link from "next/link";

export default function Page() {
	const [users, setUsers] = useState<IUser[]>([]);
	const token = getCookie('access_token');

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement;
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
			fetch(
				`https://ordemdeservicosdev.onrender.com/api/user/create-user/:id`,
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
				pending: "Criando usuário",
				success: "Usuário criado com sucesso!",
				error: "Ocorreu um erro ao criar usuário",
			}
		);
	};

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/user/get-all-users",
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				}
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

  	return (
	  	<Container className="p-4">
		  	<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Usuários</CardTitle>
								<CardDescription>Cheque todas as informações relacionadas aos usuários.</CardDescription>
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
										<DialogTitle>Adicionar usuário</DialogTitle>
										<DialogDescription>
											Adicione as informações para criar um usuário.
										</DialogDescription>
										</DialogHeader>
										<form
										action="#"
										onSubmit={(e) => onSubmit(e)}
										className=" flex flex-col justify-center items-center"
									>
										<div className="flex gap-3 flex-col items-center max-w-96 w-full">
											<Input
												type="text"
												name="name"
												placeholder="Nome do usuário"
												className="w-full"
											/>
											<Input
												type="email"
												name="email"
												placeholder="Email"
												className="w-full"
											/>
											<Input
												type="password"
												name="password"
												placeholder="Senha"
												className="w-full"
											/>
											<Input
												type="tel"
												name="phone"
												placeholder="Telefone"
												className="w-full"
											/>
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
									{users.map((user, index) => (
										<TableRow key={index} className="border-b">
												<TableCell>{user.name}</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>{user.phone}</TableCell>
												<TableCell>{user.role?.roleName}</TableCell>
												<TableCell>
													<Link href={`/users/${user.id}`}>
													<Button variant="outline">Ver dados</Button>
													</Link>
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
		  	</main>
	  	</Container>
  	);
}
