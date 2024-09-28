"use client";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCookie } from "cookies-next";
import { IOrderStatus } from "@/interfaces/order.interface";
import { toast } from "react-toastify";
import { ICreateOrderStatus } from "@/interfaces/create-order-request/create-order-request.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {
	const [isLoading, setIsLoading] = useState(true);
	const [orderStatus, setOrderStatus] = useState<IOrderStatus[]>();
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const token = getCookie("access_token");

	useEffect(() => {
		fetch("https://ordemdeservicosdev.onrender.com/api/order/get-all-orders-status", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => {
				const status = res.status;
				return res.json().then((data) => ({ status, data }));
			})
			.then(({ status, data }) => {
				console.log(status, data);
				setOrderStatus(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Erro ao buscar os dados", error);
			});
	}, [token]);

	const handleSelectOrderStatusChange = (value: string) => {
		setSelectedStatus(value);
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: ICreateOrderStatus = {
			orderStatusName: getInput("orderStatusName").value || "",
			open: selectedStatus === "open",
			inProgress: selectedStatus === "inProgress",
			review: selectedStatus === "review",
			finish: selectedStatus === "finish",
		};

		toast.promise(
			fetch("https://ordemdeservicosdev.onrender.com/api/order/create-order-status", {
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
					throw new Error("Erro ao criar o status.");
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Criando status",
				success: {
					render: "Status criado com sucesso",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 2000,
				},
				error: "Ocorreu um erro",
			}
		);
	};

	return (
		<Container className="p-4">
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-[#3b82f6] text-2xl font-bold">Status das Ordens</CardTitle>
										<CardDescription>Veja todos os status disponíveis para as ordens de serviço.</CardDescription>
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
													<DialogTitle>Adicionar Status</DialogTitle>
													<DialogDescription>Adicione um status para utilizar nas ordens de serviço.</DialogDescription>
												</DialogHeader>
												<form action="#" onSubmit={(e) => onSubmit(e)} className=" flex flex-col justify-center items-center">
													<div className="flex gap-3 flex-col items-center max-w-96 w-full">
														<Input type="text" name="orderStatusName" placeholder="Nome do  status" className="w-full" />
														<Select onValueChange={handleSelectOrderStatusChange} value={selectedStatus}>
															<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
																<SelectValue placeholder="Selecione uma ação" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="open">Aberto</SelectItem>
																<SelectItem value="inProgress">Em andamento</SelectItem>
																<SelectItem value="review">Em revisão</SelectItem>
																<SelectItem value="finish">Finalizada</SelectItem>
															</SelectContent>
														</Select>
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
												<TableHead className="font-bold">Aberto</TableHead>
												<TableHead className="font-bold">Em Andamento</TableHead>
												<TableHead className="font-bold">Revisão</TableHead>
												<TableHead className="font-bold">Finalizada</TableHead>
												<TableHead className="font-bold">Ordens</TableHead>
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
												orderStatus?.map((status) => (
													<TableRow key={status.id} className="border-b">
														<TableCell>{status.orderStatusName}</TableCell>
														<TableCell>{status.open ? "Sim" : "Não"}</TableCell>
														<TableCell>{status.inProgress ? "Sim" : "Não"}</TableCell>
														<TableCell>{status.review ? "Sim" : "Não"}</TableCell>
														<TableCell>{status.finish ? "Sim" : "Não"}</TableCell>
														<TableCell>{status.orders?.length}</TableCell>
													</TableRow>
												))
											)}
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
