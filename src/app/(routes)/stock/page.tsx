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
import { IStockItem, ISupplier } from "@/interfaces/stock.interface";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MoneyFormatter from "@/components/formatMoneyValues";
import { withMask } from 'use-mask-input';


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
	const [items, setItems] = useState<IStockItem[]>([]);
	const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
	const [selectedSupplier, setSelectedSupplier] = useState<string>("");
	const [selectedUnitMeasurement, setSelectedUnitMeasurement] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const token = getCookie("access_token");

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BASE_URL}/storage/get-all-items`, {
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
				setError("Erro ao carregar dados do estoque.");
				setIsLoading(false);
			});

		fetch(`${BASE_URL}/storage/get-all-suppliers`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setSuppliers(data);
			})
			.catch((error) => {
				console.error("Erro ao buscar os dados:", error);
				setError("Erro ao carregar dados dos fornecedores.");
			});
		setIsLoading(false);
	}, [token]);

	const handleSelectSupplierChange = (value: string) => {
		setSelectedSupplier(value);
	};

	const handleSelectUnitChange = (value: string) => {
		setSelectedUnitMeasurement(value);
	};

	const onSubmitItem = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const totalMeasurementInput = getInput("totalMeasurement");
		const totalMeasurementValue = totalMeasurementInput ? +totalMeasurementInput.value : 0;

		const formData: {
			productName: string;
			quantity: number;
			unitOfMeasurement: string;
			totalMeasurement?: number;
			productValue: number;
			supplierId: string;
		} = {
			productName: getInput("productName").value || "",
			quantity: +getInput("quantity").value || 0,
			productValue: +getInput("productValue").value || 0,
			unitOfMeasurement: selectedUnitMeasurement,
			totalMeasurement: totalMeasurementValue > 0 ? totalMeasurementValue : undefined,
			supplierId: selectedSupplier,
		};

		const body: any = {
			productName: formData.productName,
			unitOfMeasurement: selectedUnitMeasurement,
			quantity: formData.quantity,
			productValue: formData.productValue,
			supplierId: selectedSupplier,
		};

		if (formData.totalMeasurement !== undefined) {
			body.totalMeasurement = formData.totalMeasurement;
		}

		const validation = stockItemSchema.safeParse(formData);
		console.log(validation);

		if (!validation.success) {
			validation.error.errors.forEach((err) => toast.error(err.message));
			console.log(validation.error.errors);
			return;
		}

		toast.promise(
			fetch(`${BASE_URL}/storage/create-item`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(body),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					setItems([...items, data]);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Criando item",
				success: {
					render: "Item criado com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao criar item",
			}
		);
	};

	const onSubmitSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const formData = {
			supplierName: getInput("name").value || "",
			email: getInput("email").value || "",
			phone: getInput("phone").value || "",
		};

		const validation = supplierSchema.safeParse(formData);

		if (!validation.success) {
			validation.error.errors.forEach((err) => toast.error(err.message));
			return;
		}

		toast.promise(
			fetch(`${BASE_URL}/storage/create-supplier`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(formData),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					setSuppliers([...suppliers, data]);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Criando fornecedor",
				success: {
					render: "Fornecedor criado com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao criar fornecedor",
			}
		);
	};

	function formatTotalMeasurement(item: IStockItem): string {
		let measurement = item.totalMeasurement ?? "-";

		switch (item.unitOfMeasurement) {
			case "meter":
				return `${measurement} metros`;
			case "liter":
				return `${measurement} litros`;
			case "unit":
				return "-";
			default:
				return measurement.toString();
		}
	}

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
									<div className="flex items-center justify-between">
										<div>
											<CardTitle className="text-[#3b82f6] text-2xl font-bold">Estoque</CardTitle>
											<CardDescription>Cheque todas as informações relacionadas ao estoque.</CardDescription>
										</div>

										<div className="flex items-center gap-3">
											<Dialog>
												<DialogTrigger asChild>
													<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
														Adicionar Item
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>Adicionar Item ao Estoque</DialogTitle>
														<DialogDescription>
															Preencha os campos abaixo para adicionar um novo item ao estoque.
														</DialogDescription>
													</DialogHeader>
													<form onSubmit={onSubmitItem} className="flex flex-col justify-center items-center">
														<div className="flex flex-col items-center max-w-96 w-full space-y-4">
															<Input
																type="text"
																name="productName"
																placeholder="Nome do produto"
																required
																className="w-full"
															/>
															<Input
																type="number"
																name="quantity"
																placeholder="Quantidade"
																required
																className="w-full"
															/>
															<Select onValueChange={handleSelectUnitChange} value={selectedUnitMeasurement}>
																<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
																	<SelectValue placeholder="Selecione uma Unidade de Medida" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="unit">Unidade</SelectItem>
																	<SelectItem value="meter">Metros</SelectItem>
																	<SelectItem value="liter">Litros</SelectItem>
																</SelectContent>
															</Select>
															{selectedUnitMeasurement === "meter" || selectedUnitMeasurement === "liter" ? (
																<Input
																	type="number"
																	name="totalMeasurement"
																	step="0.01"
																	placeholder="Total de Medida"
																	required
																	className="w-full"
																/>
															) : (
																""
															)}
															<Input
																type="number"
																name="productValue"
																step="0.01"
																placeholder="Valor"
																required
																className="w-full"
															/>
															<Select onValueChange={handleSelectSupplierChange} value={selectedSupplier}>
																<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
																	<SelectValue placeholder="Selecione um Fornecedor" />
																</SelectTrigger>
																<SelectContent>
																	{suppliers.map((supplier) => (
																		<SelectItem key={supplier.id} value={supplier.id}>
																			{supplier.supplierName}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<Button
																className="font-medium rounded my-4 px-12 py-2 hover:-translate-y-1 transition-all w-full bg-blue-500 hover:bg-blue-600"
																type="submit"
															>
																Adicionar Item
															</Button>
														</div>
													</form>
												</DialogContent>
											</Dialog>

											<Dialog>
												<DialogTrigger asChild>
													<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
														Adicionar Fornecedor
													</Button>
												</DialogTrigger>
												<DialogContent className="sm:max-w-[425px]">
													<DialogHeader>
														<DialogTitle>Adicionar Fornecedor</DialogTitle>
														<DialogDescription>
															Preencha os campos abaixo para adicionar um novo fornecedor.
														</DialogDescription>
													</DialogHeader>
													<form onSubmit={onSubmitSupplier} className="flex flex-col justify-center items-center">
														<div className="flex flex-col items-center max-w-96 w-full space-y-4">
															<Input
																type="text"
																name="name"
																placeholder="Nome do fornecedor"
																required
																className="w-full"
															/>
															<Input type="email" name="email" placeholder="E-mail" required className="w-full" />
															<Input type="tel" ref={withMask('(99) 99999-9999')} name="phone" placeholder="Telefone" required className="w-full" />
															<Button
																className="font-medium rounded my-4 px-12 py-2 hover:-translate-y-1 transition-all w-full bg-blue-500 hover:bg-blue-600"
																type="submit"
															>
																Adicionar Fornecedor
															</Button>
														</div>
													</form>
												</DialogContent>
											</Dialog>
										</div>
									</div>
								</CardHeader>
								<div>
									<Table className="overflow-x-auto">
										<TableHeader>
											<TableRow>
												<TableCell className="whitespace-nowrap">Nome do Produto</TableCell>
												<TableCell className="whitespace-nowrap">Quantidade</TableCell>
												<TableCell className="whitespace-nowrap">Total em Medida</TableCell>
												<TableCell className="whitespace-nowrap">Restante</TableCell>
												<TableCell className="whitespace-nowrap">Valor</TableCell>
												<TableCell className="whitespace-nowrap">Fornecedor</TableCell>
											</TableRow>
										</TableHeader>
										<TableBody>
											{items.map((item) => (
												<TableRow key={item.id}>
													<TableCell className="whitespace-nowrap">{item.productName}</TableCell>
													<TableCell className="whitespace-nowrap">{item.quantity}</TableCell>
													<TableCell className="whitespace-nowrap">{formatTotalMeasurement(item)}</TableCell>
													<TableCell className="whitespace-nowrap">
														{item.unitOfMeasurement === "unit"
															? `${item.quantity - item.usedQuantity} ${
																	item.quantity - item.usedQuantity > 1 ? "unidades" : "unidade"
															  }`
															: `${item.totalMeasurement - item.usedMeasurement} ${
																	item.unitOfMeasurement === "meter"
																		? `${item.totalMeasurement - item.usedMeasurement > 1 ? "metros" : "metro"}`
																		: `${item.totalMeasurement - item.usedMeasurement > 1 ? "litros" : "litro"}`
															  }`}
													</TableCell>
													<TableCell className="whitespace-nowrap">
														<MoneyFormatter value={item.productValue || 0} currency="BRL" />
													</TableCell>
													<TableCell className="whitespace-nowrap">{item.supplier?.supplierName}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</Card>
						</TabsContent>

						<TabsContent value="suppliers">
							<Card>
								<CardHeader>
									<CardTitle>Fornecedores</CardTitle>
								</CardHeader>
								<Table>
									<TableHeader>
										<TableRow>
											<TableCell>Nome do Fornecedor</TableCell>
											<TableCell>Email</TableCell>
											<TableCell>Telefone</TableCell>
										</TableRow>
									</TableHeader>
									<TableBody>
										{suppliers.map((supplier) => (
											<TableRow key={supplier.id}>
												<TableCell>{supplier.supplierName}</TableCell>
												<TableCell>{supplier.email}</TableCell>
												<TableCell>{supplier.phone}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Card>
						</TabsContent>
					</Tabs>
				)}
			</main>
		</Container>
	);
}
