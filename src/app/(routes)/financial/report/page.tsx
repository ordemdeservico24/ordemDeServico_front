"use client";
import { useState, useEffect } from "react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Container } from "@/components/container";
import { getCookie } from "cookies-next";
import { IFinancialCategory } from "@/interfaces/financial.interface";
import MoneyFormatter from "@/components/formatMoneyValues";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface financialReport {
	totalExpenses: number;
	totalRevenues: number;
	balance: number;
	categories: [
		{
			categoryId: string;
			categoryName: string;
			items: number;
			amount: number;
			createdAt: string;
		}
	];
	revenues: [
		{
			itemId: string;
			itemName: string;
			itemQuantity: number;
			itemValue: number;
			createdAt: string;
		}
	];
}

export default function Page() {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<IFinancialCategory[]>([]);
	const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"));
	const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"));
	const [financialReport, setFinancialReport] = useState<financialReport>({
		totalExpenses: 0,
		totalRevenues: 0,
		balance: 0,
		categories: [
			{
				categoryId: "",
				categoryName: "",
				items: 0,
				amount: 0,
				createdAt: "",
			},
		],
		revenues: [
			{
				itemId: "",
				itemName: "",
				itemQuantity: 0,
				itemValue: 0,
				createdAt: "",
			},
		],
	});

	const token = getCookie("access_token");

	useEffect(() => {
		let categoryId;
		setIsLoading(true);
		if (selectedCategory === "all") {
			categoryId = "";
		} else {
			categoryId = selectedCategory;
		}
		fetch(`${BASE_URL}/finance/generate-report?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59&categoryId=${categoryId}`, {
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
				setFinancialReport(data);
			});

		fetch(`${BASE_URL}/finance/get-all-categories`, {
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
				setCategories(data);
			});
		setIsLoading(false);
	}, [token, startDate, endDate, selectedCategory]);

	const chartData = [
		{
			name: "Receitas",
			Valor: financialReport.totalRevenues,
		},
		{ name: "Despesas", Valor: financialReport.totalExpenses },
		{ name: "Balanço", Valor: financialReport.balance },
	];

	function formatCurrency(value: number) {
		return value.toLocaleString("pt-BR", {
			style: "currency",
			currency: "BRL",
			minimumFractionDigits: 2,
		});
	}

	return (
		<Container className="overflow-x-auto sm:overflow-x-hidden">
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
					<div className="container mx-auto p-4">
						<div className="flex flex-wrap gap-4 mb-4">
							<div>
								<Label htmlFor="category">Categoria de Despesa</Label>
								<Select value={selectedCategory} onValueChange={setSelectedCategory}>
									<SelectTrigger className="w-[200px]">
										<SelectValue placeholder="Selecione uma Categoria" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">Todas</SelectItem>
										{categories.map((category) => (
											<SelectItem key={category.id} value={category.id}>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="startDate">Data de Início</Label>
								<Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
							</div>

							<div>
								<Label htmlFor="endDate">Data Final</Label>
								<Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
							<Card>
								<CardHeader>
									<CardTitle>Total de Receitas</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-bold">
										<MoneyFormatter value={financialReport.totalRevenues} />
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Total de Despesas</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-bold">
										<MoneyFormatter value={financialReport.totalExpenses} />
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader>
									<CardTitle>Balanço Final</CardTitle>
								</CardHeader>
								<CardContent>
									<p className={`text-2xl font-bold ${financialReport.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
										<MoneyFormatter value={financialReport.balance} />
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="mb-8">
							<h2 className="text-xl font-bold mb-2">Visão Geral</h2>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={chartData}>
									<CartesianGrid strokeDasharray="6 6" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip formatter={(value) => formatCurrency(value as number)} />
									<Legend />
									<Bar dataKey="Valor" fill="#133bce" />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className="mb-8">
							<h2 className="text-xl font-bold mb-2">Despesas</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Categoria</TableHead>
										<TableHead>Valor</TableHead>
										<TableHead>Itens</TableHead>
										<TableHead>Criado em</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{financialReport.categories.map((category) => (
										<TableRow key={category.categoryId}>
											<TableCell className="whitespace-nowrap">{category.categoryName}</TableCell>
											<TableCell className="whitespace-nowrap">
												<MoneyFormatter value={category.amount} />
											</TableCell>
											<TableCell className="whitespace-nowrap">{category.items}</TableCell>
											<TableCell className="whitespace-nowrap">{new Date(category.createdAt).toLocaleString()}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						<div>
							<h2 className="text-xl font-bold mb-2">Receitas</h2>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Nome</TableHead>
										<TableHead>Valor</TableHead>
										<TableHead>Itens</TableHead>
										<TableHead>Criado em</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{financialReport.revenues.map((item) => (
										<TableRow key={item.itemId}>
											<TableCell className="whitespace-nowrap">{item.itemName}</TableCell>
											<TableCell className="whitespace-nowrap">
												<MoneyFormatter value={item.itemValue} />
											</TableCell>
											<TableCell className="whitespace-nowrap">{item.itemQuantity}</TableCell>
											<TableCell className="whitespace-nowrap">{new Date(item.createdAt).toLocaleString()}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
				)}
			</main>
		</Container>
	);
}
