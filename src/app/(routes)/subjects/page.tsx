"use client";
import { Container } from "@/components/container";
import { ISubject } from "@/interfaces/subject.interface";
import React, { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { z } from "zod";
import { hasPermission } from "@/utils/hasPermissions";
import { useStore } from "@/zustandStore";
const BASE_URL = process.env.BASE_URL;

const subjectSchema = z.object({
	name: z.string().min(1, "Nome é obrigatório"),
	expirationDays: z.number().min(1, "Dias de prazo devem ser maiores que 0"),
});

export default function Page() {
	const [subjects, setSubjects] = useState<ISubject[]>([]);
	const token = getCookie("access_token");
	const [isLoading, setIsLoading] = useState(true);
	const { role } = useStore();

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BASE_URL}/order/get-all-subjects`, {
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
				setSubjects(data);
			})
			.catch((error) => {
				console.error("Erro ao buscar os dados", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [token]);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const formData = {
			name: getInput("name").value || "",
			expirationDays: +getInput("expirationDays").value || 0,
		};

		const validation = subjectSchema.safeParse(formData);

		if (!validation.success) {
			validation.error.errors.forEach((err) => toast.error(err.message));
			return;
		}

		const request: ISubject = validation.data;

		toast.promise(
			fetch(`${BASE_URL}/order/create-subject`, {
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
				pending: "Criando categoria",
				success: {
					render: "Categoria criada com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao criar categoria",
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
				) : (
					<Tabs defaultValue="all">
						<TabsContent value="all">
							<Card x-chunk="dashboard-06-chunk-0">
								<CardHeader>
									<CardTitle className="text-[#3b82f6] text-2xl font-bold">Categorias</CardTitle>
									<CardDescription>Cheque todas as informações relacionado as categorias apresentadas.</CardDescription>
									<div className="flex items-center gap-3 justify-between">
										{hasPermission(role, "orders_management", "create")}
									</div>
								</CardHeader>
								<div className="p-3">
									<Table className="overflow-x-auto">
										<TableHeader>
											<TableRow>
												<TableHead className="whitespace-nowrap">Nome da categoria</TableHead>
												<TableHead className="whitespace-nowrap">Dias para resolução</TableHead>
												<TableHead className="whitespace-nowrap">Ordens atribuídas</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{Array.isArray(subjects) &&
												subjects.map((subject, index) => (
													<TableRow key={index} className="cursor-pointer hover:bg-gray-100">
														<TableCell className="whitespace-nowrap">{subject.name}</TableCell>
														<TableCell className="whitespace-nowrap">{subject.expirationDays}</TableCell>
														<TableCell className="whitespace-nowrap">{subject.orders?.length}</TableCell>
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
