"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { getCookie } from "cookies-next";
import MoneyFormatter from "@/components/formatMoneyValues";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function ExpensesPage() {
	const [categories, setCategories] = useState<any[]>([]);
	const [totalExpenses, setTotalExpenses] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const token = getCookie("access_token");
	const router = useRouter();

	useEffect(() => {
		setIsLoading(true);
		const fetchExpenses = async () => {
			try {
				const response = await fetch(`${BASE_URL}/finance/expenses`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Failed to fetch expenses");
				}

				const data = await response.json();
				setCategories(data.categories);
				setTotalExpenses(data.totalAmount);
			} catch (error) {
				console.error("Error fetching expenses:", error);
				setError("Erro ao carregar despesas.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchExpenses();
	}, [token]);

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
											<CardTitle className="text-[#3b82f6] text-2xl font-bold">Financeiro Despesas</CardTitle>
											<CardDescription>Cheque todas as informações relacionadas ao financeiro.</CardDescription>
										</div>
										<h1>
											Total despesas: <MoneyFormatter value={totalExpenses} />{" "}
										</h1>
									</div>
								</CardHeader>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableCell className="whitespace-nowrap">Categoria</TableCell>
												<TableCell className="whitespace-nowrap">Descrição</TableCell>
												<TableCell className="whitespace-nowrap">Quantidade de Itens</TableCell>
												<TableCell className="whitespace-nowrap">Data de Criação</TableCell>
											</TableRow>
										</TableHeader>
										<TableBody>
											{categories.map((category) => (
												<TableRow key={category.id} onClick={() => router.push(`/financial/categories/${category.id}`)}>
													<TableCell className="whitespace-nowrap">{category.name}</TableCell>
													<TableCell className="whitespace-nowrap">{category.description}</TableCell>
													<TableCell className="whitespace-nowrap">{category.items}</TableCell>
													<TableCell className="whitespace-nowrap">
														{new Date(category.createdAt).toLocaleDateString()}
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
