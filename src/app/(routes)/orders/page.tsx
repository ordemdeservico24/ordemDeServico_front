"use client";
import { Container } from "@/components/container";
import { EditDeleteOrder } from "@/components/editDeleteOrder";
import { OrderStatus } from "@/components/orderStatus";
import { IOrderGet, IOrderStatus } from "@/interfaces/order.interface";
import Link from "next/link";
import React, { useEffect, FormEvent, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Textarea } from "@/components/ui/textarea";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";
import { toast } from "react-toastify";
import { ISubject } from "@/interfaces/subject.interface";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { z } from "zod";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";

export default function Page() {
	const orderSchema = z.object({
		subjectId: z.string().min(1, "Selecione uma categoria"),
		requesterName: z.string().min(1, "Nome do solicitante é obrigatório"),
		requesterPhone: z.string().min(1, "Telefone do solicitante é obrigatório"),
		requesterStreet: z.string().min(1, "Endereço do solicitante é obrigatório"),
		requesterHouseNumber: z.number().min(1, "Número da casa é obrigatório").transform(Number),
		requesterComplement: z.string().optional(),
		requesterZipcode: z.string().min(1, "CEP do solicitante é obrigatório"),
		notes: z.string().optional(),
	});

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [orders, setOrders] = useState<IOrderGet[]>([]);
	const [subjects, setSubjects] = useState<ISubject[]>();
	const [orderStatus, setOrderStatus] = useState<IOrderStatus[]>();
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [selectedFilter, setSelectedFilter] = useState<string | undefined>(undefined);
	const [error, setError] = useState<string | null>(null);
	const token = getCookie("access_token");
	const { role = [] } = useStore();

	useEffect(() => {
		fetch("https://ordemdeservicosdev.onrender.com/api/order/get-all-subjects", {
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
			});
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
			})
			.catch((error) => {
				console.error("Erro ao buscar os dados", error);
			});
	}, [token]);
	const truncateNotes = (notes: string, maxLength: number) => {
		if (notes.length > maxLength) {
			return notes.substring(0, maxLength) + "...";
		}
		return notes;
	};

	const handleFilterChange = useCallback((status: string) => {
		setSelectedFilter((prevStatus) => (prevStatus === status ? undefined : status));
	}, []);

	const fetchOrders = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const limit = 9;
			const offset = limit * (currentPage - 1);
			const filterParam = selectedFilter ? `&status=${selectedFilter}` : "";

			const response = await fetch(
				`https://ordemdeservicosdev.onrender.com/api/order/get-all-orders?limit=${limit}&offset=${offset}${filterParam}`,
				{
					method: "GET",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (Array.isArray(data.orders)) {
				const now = new Date();
				const ordersWithStatus = data.orders.map((order: IOrderGet) => {
					const [day, month, year] = order.expirationDate.split(", ")[0].split("/");
					const expirationDate = new Date(`${year}-${month}-${day}`);

					return {
						...order,
						isExpired: now.getTime() > expirationDate.getTime(),
					};
				});

				setOrders(ordersWithStatus);
				setTotalPages(data.pages);
			} else {
				setError("Dados recebidos não são um array.");
			}
		} catch (error: Error | any) {
			setError(error.message || "Erro ao carregar as ordens");
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectOrderStatusChange = (value: string) => {
		setSelectedStatus(value);
	};

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: IRequest = {
			subjectId: getInput("subjectId").value || "",
			orderStatusId: selectedStatus,
			requesterName: getInput("requesterName").value || "",
			requesterPhone: getInput("requesterPhone").value || "",
			requesterStreet: getInput("requesterStreet").value || "",
			requesterHouseNumber: +getInput("requesterHouseNumber").value || 0,
			requesterComplement: getInput("requesterComplement").value || "",
			requesterZipcode: getInput("requesterZipcode").value || "",
			notes: getInput("notes").value || "",
		};

		toast.promise(
			fetch("https://ordemdeservicosdev.onrender.com/api/order/create-order", {
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
					throw new Error("Erro ao criar a ordem.");
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Criando ordem",
				success: {
					render: "Ordem criada com sucesso",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro",
			}
		);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		fetchOrders();
	}, [currentPage, token, selectedFilter]);

	return (
		<Container>
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Card x-chunk="dashboard-06-chunk-0">
					<CardHeader className="pb-0">
						<div className="flex justify-between items-center w-full">
							<div>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Ordens de Serviço</CardTitle>
								<CardDescription>Cheque todas as ordens de serviços e dados relacionados a mesma.</CardDescription>
								<div className="flex items-center gap-2 pt-4">
									{hasPermission(role, ["orders_management"], "create") && (
										<Dialog>
											<DialogTrigger asChild>
												<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
													Cadastrar OS
												</Button>
											</DialogTrigger>
											<DialogContent className="sm:max-w-md">
												<DialogHeader>
													<DialogTitle>Cadastrar Ordem de Serviço</DialogTitle>
													<DialogDescription>
														Adicione os dados abaixo e cadastre uma nova ordem de serviço.
													</DialogDescription>
												</DialogHeader>
												<form action="#" onSubmit={(e) => onSubmit(e)} className="flex flex-col gap-4">
													<select name="subjectId" id="subjectId" className="border rounded px-2 py-2" required>
														<option value="">Selecione uma categoria</option>
														{Array.isArray(subjects) ? (
															subjects.map((subject) => (
																<option value={subject.id} key={subject.id}>
																	{subject.name} ({subject.expirationDays} dias de prazo)
																</option>
															))
														) : (
															<option value="">Carregando...</option>
														)}
													</select>
													<Select onValueChange={handleSelectOrderStatusChange} value={selectedStatus}>
														<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
															<SelectValue placeholder="Selecione um Status" />
														</SelectTrigger>
														<SelectContent>
															{orderStatus?.map((status) => (
																<SelectItem key={status.id} value={status.id}>
																	{status.orderStatusName}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<Input type="text" name="requesterName" placeholder="Nome do solicitante" required />
													<Input type="tel" name="requesterPhone" placeholder="Telefone do solicitante" required />
													<Input type="text" name="requesterStreet" placeholder="Endereço do solicitante" required />
													<Input
														type="number"
														name="requesterHouseNumber"
														placeholder="N° da casa do solicitante"
														required
													/>
													<Input type="text" name="requesterComplement" placeholder="Complemento do solicitante" required />
													<Input type="text" name="requesterZipcode" placeholder="CEP do solicitante" required />
													<Textarea name="notes" placeholder="Observações" className="border rounded px-2 py-1 mb-4" />
													<Button
														className="text-white font-medium rounded px-4 py-2 bg-blue-500 hover:bg-blue-600"
														type="submit"
													>
														Cadastrar
													</Button>
												</form>
											</DialogContent>
										</Dialog>
									)}
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline">
												<Filter className="mr-2 h-4 w-4" />
												Filtrar
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											<DropdownMenuRadioGroup value={selectedFilter || ""} onValueChange={handleFilterChange}>
												{orderStatus?.map((status) => (
													<DropdownMenuRadioItem
														key={status.id}
														value={status.id}
														className="outline-none px-6 py-1 focus:bg-accent hover:cursor-pointer"
													>
														{status.orderStatusName}
													</DropdownMenuRadioItem>
												))}
											</DropdownMenuRadioGroup>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						</div>
					</CardHeader>
					<div className="flex flex-col gap-4 p-4 sm:p-6">
						{isLoading ? (
							<div className="flex items-center justify-center">
								<svg
									className="h-8 w-8 animate-spin text-gray-600"
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
							<p className="text-center text-red-500">{error}</p>
						) : (
							<>
								<div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{orders.map((order) => (
										<div
											key={order.id}
											className={`relative border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow ${
												order.isExpired ? "border-5 border-solid border-red-500 overflow-hidden" : ""
											}`}
										>
											{order.isExpired && (
												<span className="absolute top-[100px] w-[160px] right-[-110px] flex justify-center bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-tl-lg transform rotate-45 origin-top-right -translate-x-1/2 -translate-y-1/2">
													Atrasado
												</span>
											)}
											{hasPermission(role, ["orders_management"], "read") && (
												<Link href={`/orders/order/${order.id}`}>
													<h2 className={`text-lg font-semibold mb-2 ${order.isExpired ? "pt-3" : "pt-1"}`}>
														Ordem de Serviço - {order.orderId}
													</h2>
												</Link>
											)}
											<p className="text-gray-600 mb-2">Data de abertura: {order.openningDate}</p>
											<p className="text-gray-800 mb-2">{truncateNotes(order.notes, 100)}</p>
											<div className="flex justify-between items-center">
												{hasPermission(role, ["orders_management"], "update") && (
													<OrderStatus
														currentStatusId={order.orderStatus.id}
														currentStatus={order.orderStatus.orderStatusName}
														orderId={order.id}
														statuses={orderStatus || []}
													/>
												)}
												{hasPermission(role, ["orders_management"], "update") && (
													<EditDeleteOrder orderId={order.id} subjects={subjects || []} orderStatus={orderStatus || []} />
												)}
											</div>
										</div>
									))}
								</div>
							</>
						)}
					</div>
					<div className="flex items-center justify-between pt-0 pb-4">
						<Pagination>
							<PaginationContent>
								<PaginationPrevious
									style={{ cursor: "pointer" }}
									onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
									className={`${currentPage === 1 ? "disabled" : ""}`}
								>
									Anterior
								</PaginationPrevious>

								{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
									<PaginationItem key={page}>
										<PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
											{page}
										</PaginationLink>
									</PaginationItem>
								))}

								<PaginationNext
									style={{ cursor: "pointer" }}
									onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
									className={`${currentPage === totalPages ? "disabled" : ""}`}
								>
									Próximo
								</PaginationNext>
							</PaginationContent>
						</Pagination>
					</div>
				</Card>
			</main>
		</Container>
	);
}
