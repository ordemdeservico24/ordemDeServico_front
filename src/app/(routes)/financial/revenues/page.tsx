"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { getCookie } from "cookies-next";
import { IRevenue } from "@/interfaces/financial.interface";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { withMask } from "use-mask-input";
import MoneyFormatter from "@/components/formatMoneyValues";
import { toast } from "react-toastify";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function RevenuesPage() {
	const [revenues, setRevenues] = useState<IRevenue | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const token = getCookie("access_token");
	const { role = [] } = useStore();

	useEffect(() => {
		setIsLoading(true);
		const fetchRevenues = async () => {
			try {
				const response = await fetch(`${BASE_URL}/finance/revenues`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch revenues");
				}

				const data = await response.json();
				setRevenues(data);
			} catch (error) {
				console.error("Error fetching revenues:", error);
				setError("Erro ao carregar receitas.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRevenues();
	}, [token]);

	const handleGenerateReceipt = async (itemId: string) => {
		const receiptDate = new Date().toLocaleString();
		try {
			const response = await toast.promise(
				fetch(`${BASE_URL}/finance/revenues/receipt/${itemId}`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ receiptDate: receiptDate }),
				}),
				{
					pending: "Gerando recibo",
					success: {
						render: "Recibo gerado com sucesso!",
						onClose: () => {
							window.location.reload();
						},
						autoClose: 1500,
					},
					error: "Ocorreu um erro ao gerar o recibo",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to generate receipt");
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `recibo-${itemId}.pdf`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error generating receipt:", error);
			setError("Erro ao gerar recibo.");
		}
	};

	const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const newItem = {
			description: formData.get("description") as string,
			quantity: Number(formData.get("quantity")),
			value: formData.get("value") as string,
			buyerName: formData.get("buyerName") as string,
			cpf: formData.get("cpf") as string,
			cnpj: formData.get("cnpj") as string,
			phone: formData.get("phone") as string,
		};

		try {
			toast.promise(
				fetch(`${BASE_URL}/finance/revenues/create-item`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ ...newItem, value: parseFloat(newItem.value.replace("R$", "").replace(/\./g, "").replace(",", ".")) }),
				})
					.then(async (res) => {
						if (res.status === 400 || res.status === 401) {
							const data = await res.json();
							toast.error(data.message);
							throw new Error(data.message);
						}
						if (res.ok) {
							return res.json();
						}
						throw new Error("Erro ao criar item em receitas.");
					})
					.then((data) => {
						setRevenues((prev) => (prev ? { ...prev, items: [...prev.items, data] } : prev));
					})
					.catch((error) => {
						console.log(error);
						throw error;
					}),
				{
					pending: "Criando item",
					success: {
						render: "Item criado com sucesso",
						onClose: () => {
							window.location.reload();
						},
						autoClose: 1500,
					},
					error: "Ocorreu um erro",
				}
			);
		} catch (error) {
			console.error("Error creating item:", error);
			setError("Erro ao criar item.");
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
				) : (
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card>
								<CardHeader>
									<div className="flex justify-between items-center">
										<div>
											<CardTitle className="text-[#3b82f6] text-2xl font-bold">Financeiro Receitas</CardTitle>
											<CardDescription>Cheque todas as informações relacionadas ao financeiro de receitas.</CardDescription>
										</div>
										<div>
											<h1>
												Total receitas: <MoneyFormatter value={revenues?.totalRevenue || 0} />
											</h1>
											{hasPermission(role, "admin_management", "create") && (
												<Dialog>
													<DialogTrigger asChild>
														<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
															Criar item
														</Button>
													</DialogTrigger>
													<DialogContent>
														<DialogHeader>
															<DialogTitle>Criar Item na Receita</DialogTitle>
														</DialogHeader>
														<form onSubmit={handleCreateItem} className="space-y-4">
															<Textarea name="description" placeholder="Nome ou descrição" />
															<Input name="quantity" type="number" required placeholder="Quantidade" />
															<Input
																name="value"
																type="text"
																placeholder="Valor unitário"
																required
																ref={withMask("brl-currency", { rightAlign: false })}
															/>
															<Input name="buyerName" required placeholder="Recebido de" />
															<Input name="cpf" placeholder="CPF" required ref={withMask("999.999.999-99")} />
															<Input name="cnpj" placeholder="CNPJ" required ref={withMask("99.999.999/9999-99")} />
															<Input name="phone" placeholder="Telefone" required ref={withMask("(99) 99999-9999")} />
															<Button type="submit" variant="default" className="bg-blue-500 hover:bg-blue-600">
																Salvar Item
															</Button>
														</form>
													</DialogContent>
												</Dialog>
											)}
										</div>
									</div>
								</CardHeader>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableCell className="whitespace-nowrap">Nome/Descrição</TableCell>
												<TableCell className="whitespace-nowrap">Quantidade</TableCell>
												<TableCell className="whitespace-nowrap">Valor Unitário</TableCell>
												<TableCell className="whitespace-nowrap">Data de Criação</TableCell>
												<TableCell className="whitespace-nowrap">Gerar recibo</TableCell>
											</TableRow>
										</TableHeader>
										<TableBody>
											{revenues?.items.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="whitespace-nowrap">{item.description || "-"}</TableCell>
													<TableCell className="whitespace-nowrap">{item.quantity}</TableCell>
													<TableCell className="whitespace-nowrap">
														{item.value ? <MoneyFormatter value={item.value} /> : "0.00"}
													</TableCell>
													<TableCell className="whitespace-nowrap">
														{new Date(item.createdAt).toLocaleDateString()}
													</TableCell>
													<TableCell className="whitespace-nowrap">
														<Button
															variant="default"
															className="bg-blue-500 hover:bg-blue-600"
															onClick={() => handleGenerateReceipt(item.id)}
														>
															Gerar recibo
														</Button>
													</TableCell>
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
