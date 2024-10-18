"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { z } from "zod";
import { getCookie } from "cookies-next";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { IStockHistory, IStockItem, ISupplier } from "@/interfaces/stock.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MoneyFormatter from "@/components/formatMoneyValues";
import { withMask } from "use-mask-input";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";

const stockItemSchema = z.object({
	productName: z.string().min(1, "Nome do produto é obrigatório"),
	quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
	productValue: z.number().min(0, "Valor deve ser maior ou igual a zero"),
	supplierId: z.string().min(1, "Fornecedor é obrigatório"),
	unitOfMeasurement: z.string().min(1, "Unidade de Medida é obrigatória"),
});

const supplierSchema = z.object({
	supplierName: z.string().min(1, "Nome do fornecedor é obrigatório"),
	email: z.string().email("Email inválido"),
	phone: z.string(),
});

export default function StoragePage() {
	const [items, setItems] = useState<IStockHistory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const token = getCookie("access_token");

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BASE_URL}/storage/history`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setItems(data);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error("Erro ao buscar os dados", error);
				setError("Erro ao carregar dados de saídas do estoque.");
				setIsLoading(false);
			});
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
				) : (
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card>
								<CardHeader>
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">Saídas</CardTitle>
									<CardDescription>Veja as saídas que tiveram do estoque.</CardDescription>
								</CardHeader>
								<div>
									<Table className="overflow-x-auto">
										<TableHeader>
											<TableRow>
												<TableCell className="whitespace-nowrap">Nome do Produto</TableCell>
												<TableCell className="whitespace-nowrap">Quantidade de Saída</TableCell>
												<TableCell className="whitespace-nowrap">Usuário</TableCell>
												<TableCell className="whitespace-nowrap">Data de Saída</TableCell>
											</TableRow>
										</TableHeader>
										<TableBody>
											{items.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="whitespace-nowrap">{item.productName}</TableCell>
													<TableCell className="whitespace-nowrap text-red-600">
														{item.unitOfMeasurement === "unit"
															? item.quantity > 1
																? `${item.quantity} Unidades`
																: `${item.quantity} Unidade`
															: item.totalMeasurement > 1
															? `${item.totalMeasurement} Metros`
															: `${item.totalMeasurement} Metro`}
													</TableCell>
													<TableCell className="whitespace-nowrap">{item.user.name}</TableCell>
													<TableCell className="whitespace-nowrap">{new Date(item.createdAt).toLocaleString()}</TableCell>
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
