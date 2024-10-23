"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCookie } from "cookies-next";
import { FinancialCategory } from "@/interfaces/financial.interface";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { toast } from "react-toastify";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
import { FiTrash } from "react-icons/fi";
import { Eye } from "lucide-react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function CategoriesPage() {
	const [categories, setCategories] = useState<FinancialCategory[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [newCategory, setNewCategory] = useState({ name: "", description: "" });
	const router = useRouter();
	const token = getCookie("access_token");
	const [isLoading, setIsLoading] = useState(false);
	const { role = [] } = useStore();

	useEffect(() => {
		setIsLoading(true);
		const fetchCategories = async () => {
			try {
				const response = await fetch(`${BASE_URL}/finance/get-all-categories`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch categories");
				}

				const data = await response.json();
				setCategories(data);
			} catch (error) {
				console.error("Error fetching categories:", error);
				setError("Erro ao carregar categorias.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchCategories();
	}, [token]);

	const handleAddCategory = async () => {
		try {
			const response = await toast.promise(
				fetch(`${BASE_URL}/finance/create-category`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(newCategory),
				}),
				{
					pending: "Criando Categoria",
					success: {
						render: "Categoria criada com sucesso",
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

			const createdCategory = await response.json();
			setCategories((prevCategories) => [...prevCategories, createdCategory]);
			setNewCategory({ name: "", description: "" });
		} catch (error) {
			console.error("Error creating category:", error);
			setError("Erro ao criar categoria.");
		}
	};

	const handleDelete = async (id: string) => {
		await toast.promise(
			fetch(`${BASE_URL}/finance/delete-category/${id}`, {
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
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
					throw new Error("Erro ao excluir categoria.");
				})
				.then((data) => {
					return data;
				})
				.catch((error) => {
					console.log(error);
					throw error;
				}),
			{
				pending: "Excluindo Categoria",
				success: {
					render: "Categoria excluída com sucesso",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao excluir categoria",
			}
		);
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
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card>
								<CardHeader>
									<div className="flex justify-between items-center">
										<div>
											<CardTitle className="text-[#3b82f6] text-2xl font-bold">Financeiro Categorias</CardTitle>
											<CardDescription>Cheque todas as informações relacionadas ao financeiro.</CardDescription>
										</div>
										{hasPermission(role, "admin_management", "create") && (
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
														Adicionar categoria
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>Adicionar categoria</DialogTitle>
														<DialogDescription>Adicione as informações para criar uma categoria!!</DialogDescription>
													</DialogHeader>
													<div className="grid gap-4">
														<input
															type="text"
															placeholder="Nome da Categoria"
															value={newCategory.name}
															onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
															className="border rounded p-2"
														/>
														<textarea
															placeholder="Descrição"
															value={newCategory.description}
															onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
															className="border rounded p-2"
														/>
														<Button onClick={handleAddCategory} className="bg-blue-500 hover:bg-blue-600">
															Criar Categoria
														</Button>
													</div>
												</DialogContent>
											</Dialog>
										)}
									</div>
								</CardHeader>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableCell>Nome</TableCell>
												<TableCell>Descrição</TableCell>
												<TableCell className="whitespace-nowrap">Data de Criação</TableCell>
											</TableRow>
										</TableHeader>
										<TableBody>
											{categories.map((category) => (
												<TableRow key={category.id}>
													<TableCell
														className="whitespace-nowrap"
														style={{ cursor: "pointer" }}
														onClick={() => router.push(`/financial/categories/${category.id}`)}
													>
														{category.name}
													</TableCell>
													<TableCell
														className="whitespace-nowrap"
														style={{ cursor: "pointer" }}
														onClick={() => router.push(`/financial/categories/${category.id}`)}
													>
														{category.description || "-"}
													</TableCell>
													<TableCell
														className="whitespace-nowrap"
														style={{ cursor: "pointer" }}
														onClick={() => router.push(`/financial/categories/${category.id}`)}
													>
														{new Date(category.createdAt).toLocaleDateString()}
													</TableCell>
													<TableCell>
														{hasPermission(role, "admin_management", "read") && (
															<Button
																className="hover:bg-accent bg-transparent"
																style={{ cursor: "pointer" }}
																onClick={() => router.push(`/financial/categories/${category.id}`)}
															>
																<Eye className="text-black" />
															</Button>
														)}
														{hasPermission(role, "admin_management", "delete") && (
															<Dialog>
																<DialogTrigger asChild>
																	<Button variant="ghost">
																		<FiTrash className="text-red-500 hover:text-red-700" size={20} />
																	</Button>
																</DialogTrigger>
																<DialogContent className="sm:max-w-[425px]">
																	<DialogHeader>
																		<DialogTitle>Excluir Categoria</DialogTitle>
																		<DialogDescription>
																			Tem certeza que deseja excluir a categoria <b>{category.name}</b>? Os
																			itens dentro dela serão excluídos e não poderá ser desfeito.
																		</DialogDescription>
																	</DialogHeader>
																	<div className="flex justify-end space-x-4">
																		<Button variant="outline" onClick={() => console.log("Cancelado")}>
																			Cancelar
																		</Button>
																		<Button variant="destructive" onClick={() => handleDelete(category.id)}>
																			Confirmar Exclusão
																		</Button>
																	</div>
																</DialogContent>
															</Dialog>
														)}
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
