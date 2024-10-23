"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/container";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { FinancialCategoryItem, FinancialItem } from "@/interfaces/financial.interface";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import AddItemForm from "@/components/AddItem";
import { toast } from "react-toastify";
import Image from "next/image";
import MoneyFormatter from "@/components/formatMoneyValues";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
import { FiTrash } from "react-icons/fi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function CategoryDetailPage() {
	const [categoryItem, setCategoryItem] = useState<FinancialCategoryItem | null>(null);
	const [error, setError] = useState<string | null>(null);
	const params = useParams();
	const { id } = params;
	const { role = [] } = useStore();

	const token = getCookie("access_token");

	const [isLoading, setIsLoading] = useState(false);
	const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		const fetchCategoryItem = async () => {
			if (!id) {
				console.error("ID da categoria não fornecido.");
				setError("ID da categoria não fornecido.");
				return;
			}

			// console.log(`Buscando dados para a categoria com ID: ${id}`);

			try {
				const response = await fetch(`${BASE_URL}/finance/get-category/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				// console.log(`Resposta da API: ${response.status}`);

				if (!response.ok) {
					throw new Error("Falha ao buscar detalhes da categoria.");
				}

				const data: FinancialCategoryItem = await response.json();
				// console.log("Dados recebidos:", data);
				setCategoryItem(data);
			} catch (error) {
				console.error("Erro ao buscar detalhes da categoria:", error);
				setError("Erro ao carregar detalhes da categoria.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategoryItem();
	}, [id, token]);

	const handleAddItem = async (item: Partial<FinancialItem>, itemPhoto: File | null) => {
		const formData = new FormData();

		formData.append("name", item.name || "");
		formData.append("amountSpent", item.amountSpent?.toString() || "0");
		formData.append("isRecurrent", item.isRecurrent ? "true" : "false");
		if (item.isRecurrent) {
			formData.append("installments", item.installments?.toString() || "");
			const formattedDate = new Date(`${item.dueDate}`);
			formData.append("dueDate", formattedDate.toISOString() || "");
		}
		if (itemPhoto) {
			formData.append("itemPhoto", itemPhoto);
		}

		setIsLoading(true);
		setError(null);

		toast.promise(
			fetch(`${BASE_URL}/finance/create-item/${id}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Falha ao adicionar item.");
					}
					return response.json();
				})
				.then((addedItem: FinancialItem) => {
					setCategoryItem((prev) => (prev ? { ...prev, items: [...prev.items, addedItem] } : prev));
					setIsAddItemDialogOpen(false);
				})
				.catch((error) => {
					console.error("Erro ao adicionar item:", error);
					setError("Erro ao adicionar item.");
				}),
			{
				pending: "Adicionando item...",
				success: {
					render: "Item adicionado com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Erro ao adicionar item.",
			}
		);

		setIsLoading(false);
	};

	if (!categoryItem) {
		return (
			<Container>
				<main className="flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
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
						<div className="flex justify-center items-center">
							<p className="text-gray-600">Erro ao carregar dados da categoria.</p>
						</div>
					)}
				</main>
			</Container>
		);
	}

	const totalAmountSpent = categoryItem.items.reduce((sum: number, item: FinancialItem) => sum + item.amountSpent, 0);

	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(`${BASE_URL}/finance/delete-item/${id}`, {
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				toast.success("Item excluído com sucesso!");
				setTimeout(() => {
					window.location.reload();
				}, 1500);
			} else {
				toast.error("Ocorreu um erro ao excluir o item.");
			}
		} catch (error) {
			console.error("Erro ao deletar líder:", error);
			toast.error("Erro ao excluir o líder.");
		}
	};

	return (
		<Container className="overflow-x-auto">
			<main className="flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
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
					<>
						<Card>
							<CardHeader>
								<div className="flex justify-between items-center">
									<div>
										<CardTitle className="text-[#3b82f6] text-2xl font-bold">{categoryItem.name}</CardTitle>
										<CardDescription>{categoryItem.description || "Sem descrição disponível"}</CardDescription>
									</div>
									{/* {hasPermission(role, "admin_management", "update") && (
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
													Editar categoria
												</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-[425px]">
												<DialogHeader>
													<DialogTitle>Editar categoria</DialogTitle>
													<DialogDescription>Modifique as informações da categoria aqui.</DialogDescription>
												</DialogHeader>
											</DialogContent>
										</Dialog>
									)} */}
								</div>
							</CardHeader>
							<div className="p-4">
								<p>
									<strong>Valor Total Gasto:</strong> <MoneyFormatter value={totalAmountSpent} />
								</p>
								<p>
									<strong>Data de Criação:</strong> {new Date(categoryItem.createdAt).toLocaleDateString()}
								</p>
								<p>
									<strong>Empresa:</strong> {categoryItem.company.companyName} (CNPJ: {categoryItem.company.cnpj})
								</p>
							</div>
						</Card>

						<Card className="mt-5">
							<CardHeader>
								<div className="w-full flex justify-between items-center">
									<CardTitle className="text-xl font-bold">Itens da Categoria</CardTitle>
									{hasPermission(role, "admin_management", "create") &&
										categoryItem.name !== "Estoque" &&
										categoryItem.name !== "Folha de pagamento" && (
											<Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
												<DialogTrigger asChild>
													<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
														Adicionar Item
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[600px]">
													<DialogHeader>
														<DialogTitle>Adicionar Item à Categoria</DialogTitle>
														<DialogDescription>Preencha as informações do novo item.</DialogDescription>
													</DialogHeader>

													<AddItemForm onAdd={handleAddItem} isLoading={isLoading} />
												</DialogContent>
											</Dialog>
										)}
								</div>
							</CardHeader>
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableCell className="whitespace-nowrap">Nome</TableCell>
											<TableCell className="whitespace-nowrap">Descrição</TableCell>
											<TableCell className="whitespace-nowrap">Valor Gasto</TableCell>
											<TableCell className="whitespace-nowrap">Foto do Item</TableCell>
											<TableCell className="whitespace-nowrap">Data de Criação</TableCell>
											<TableCell className="whitespace-nowrap">Recorrente</TableCell>
											<TableCell className="whitespace-nowrap">Parcelas</TableCell>
											<TableCell className="whitespace-nowrap">Valor por Parcela</TableCell>
										</TableRow>
									</TableHeader>
									<TableBody>
										{categoryItem.items.map((item: FinancialItem) => (
											<TableRow key={item.id}>
												<TableCell className="whitespace-nowrap">{item.name}</TableCell>
												<TableCell className="whitespace-nowrap">{item.description || "-"}</TableCell>
												<TableCell className="whitespace-nowrap">
													{item.amountSpent ? <MoneyFormatter value={item.amountSpent} /> : "0.00"}
												</TableCell>
												<TableCell className="whitespace-nowrap">
													{item.itemPhoto ? (
														<Dialog>
															<DialogTrigger asChild>
																<p className="cursor-pointer underline">Ver foto</p>
															</DialogTrigger>
															<DialogContent className="sm:max-w-[350px]">
																<DialogHeader>
																	<DialogTitle>Foto do Item: {item.name}</DialogTitle>
																</DialogHeader>
																<div className="flex justify-center">
																	<Image
																		src={item.itemPhoto}
																		alt={item.name}
																		width={300}
																		height={300}
																		className="max-w-full h-auto"
																	/>
																</div>
															</DialogContent>
														</Dialog>
													) : (
														"Sem foto"
													)}
												</TableCell>
												<TableCell className="whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
												<TableCell className="whitespace-nowrap">{item.isRecurrent ? "Sim" : "Não"}</TableCell>
												<TableCell className="whitespace-nowrap">{item.installments || "-"}</TableCell>
												<TableCell className="whitespace-nowrap">
													{item.installmentValue ? <MoneyFormatter value={item.installmentValue} /> : "-"}
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
																		Tem certeza que deseja excluir o item <b>{item.name}</b>? Esta ação não poderá
																		ser desfeita.
																	</DialogDescription>
																</DialogHeader>
																<div className="flex justify-end space-x-4">
																	<Button variant="outline" onClick={() => console.log("Cancelado")}>
																		Cancelar
																	</Button>
																	<Button variant="destructive" onClick={() => handleDelete(item.id)}>
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
					</>
				)}
			</main>
		</Container>
	);
}
