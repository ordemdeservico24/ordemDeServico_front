"use client";
import { AssignedTeam } from "@/components/assignedTeam";
import { Container } from "@/components/container";
import { OrderStatus } from "@/components/orderStatus";
import { IOrderGet, IOrderStatus } from "@/interfaces/order.interface";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { hasPermission } from "@/utils/hasPermissions";
import { useStore } from "@/zustandStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Page({ params }: { params: { id: string } }) {
	const [order, setOrder] = useState<IOrderGet>();
	const [orderStatus, setOrderStatus] = useState<IOrderStatus[]>();
	const [isLoading, setIsLoading] = useState(true);
	const token = getCookie("access_token");
	const { role } = useStore();

	useEffect(() => {
		setIsLoading(true);
		fetch(`${BASE_URL}/order/get-order/${params.id}`, {
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
				// console.log(status, data);
				setOrder(data);
			});
		fetch(`${BASE_URL}/order/get-all-orders-status`, {
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
				// console.log(status, data);
				setOrderStatus(data);
			})
			.catch((error) => {
				console.error("Erro ao buscar os dados", error);
			});
		setIsLoading(false);
	}, [params.id, token]);

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
					<>
						{order ? (
							<Card className="shadow-lg p-6 rounded-lg">
								<CardHeader className="border-b pb-4">
									<Link
										href="/orders"
										className=" text-white font-medium rounded mb-2 hover:-translate-y-1 transition-all w-fit inline-block"
									>
										<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
											Voltar
										</Button>
									</Link>
									<div className="flex justify-between items-center mb-8 mt-4">
										<h1 className="font-semibold text-2xl text-gray-800">Ordem de Serviço - {order.orderId}</h1>
										<div className="flex gap-2 items-center">
											<span className="text-gray-700 text-xs font-semibold">Aberto por: {order.createdBy.name}</span>
											<p className="text-gray-500 text-sm">Data de abertura: {order.openningDate}</p>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="mt-5">
										<h2 className="font-medium text-xl text-gray-800">{order.subject ? order.subject.name : "Não possui"}</h2>
										<div className="flex justify-between items-center">
											<p className="text-gray-600 text-sm max-w-md">{order.notes}</p>
											{hasPermission(role, ["orders_management", "teams_management"], "update") && (
												<OrderStatus
													currentStatus={order.orderStatus.orderStatusName}
													currentStatusId={order.orderStatusId}
													orderId={order.id}
													statuses={orderStatus || []}
												/>
											)}
										</div>
									</div>
									<div className="border-t pt-4 space-y-4">
										<h3 className="text-lg font-medium mb-2 text-gray-800">Dados do solicitante</h3>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
											<p>
												<strong>Nome: </strong>
												{order.requesterName}
											</p>
											<p>
												<strong>Endereço: </strong>
												{order.requesterStreet}
											</p>
											<p>
												<strong>N°: </strong>
												{order.requesterHouseNumber}
											</p>
											<p>
												<strong>Complemento: </strong>
												{order.requesterComplement}
											</p>
											<p>
												<strong>Telefone/celular: </strong>
												{order.requesterPhone}
											</p>
											<p>
												<strong>CEP:</strong> {order.requesterZipcode}
											</p>
										</div>
									</div>

									<AssignedTeam assignedTeam={order.assignedTeam} orderId={order.id} />
									{order.orderFinishedData.length ? (
										<Card>
											<CardHeader>
												<h1 className="font-medium text-lg">Informações Adicionais</h1>
											</CardHeader>
											<CardContent>
												{order.orderFinishedData.map((finishedData) => (
													<div
														key={finishedData.id}
														className={`flex flex-col gap-2 mb-4 ${
															order.orderFinishedData.length > 1 ? "border-b-2 border-gray-400" : ""
														}`}
													>
														<div className="flex justify-between">
															<p className="text-gray-600">
																<strong>ID da ordem: </strong>
																{order.orderId}
															</p>
															<p className="text-gray-600">
																<strong>Usuário: </strong>
																{finishedData.finishedBy.name}
															</p>
														</div>
														<div>
															<Label>Descrição:</Label>
															<Textarea
																value={finishedData.description ? finishedData.description : "Não possui"}
																className="mt-1 border-gray-600"
															></Textarea>
														</div>
														<div>
															{finishedData.orderFinishPhoto ? (
																<>
																	<Label>Imagem: </Label>
																	<Image
																		alt="Foto da ordem de serviço após ser atentido"
																		src={finishedData.orderFinishPhoto}
																		width={300}
																		height={300}
																		className="max-w-full h-auto"
																	/>
																</>
															) : (
																<p>Não possui imagem</p>
															)}
														</div>
														{finishedData.usedItems.length ? (
															<div>
																<Label>Itens usados:</Label>
																<Table>
																	<TableHeader>
																		<TableRow>
																			<TableHead>Nome</TableHead>
																			<TableHead>Utilizou</TableHead>
																		</TableRow>
																	</TableHeader>
																	<TableBody>
																		{finishedData.usedItems.map((item) => (
																			<TableRow key={item.id}>
																				<TableCell>{item.itemName}</TableCell>
																				<TableCell>
																					{item.usedMeasurement === 0
																						? `${item.usedQuantity} ${
																								item.usedQuantity > 1 ? "Unidades" : "Unidade"
																						  }`
																						: `${item.usedMeasurement} ${
																								item.usedMeasurement > 1
																									? "Metros/Litros"
																									: "Metro/Litro"
																						  }`}
																				</TableCell>
																			</TableRow>
																		))}
																	</TableBody>
																</Table>
															</div>
														) : (
															""
														)}
													</div>
												))}
											</CardContent>
										</Card>
									) : (
										""
									)}
								</CardContent>
								{order.orderFinishedData.length ? (
									<div className="flex justify-between">
										<div></div>
										<span className="text-gray-600 text-xs font-semibold">
											Atendido por:{" "}
											{order.orderFinishedData.map((orderData) => (
												<>{orderData.finishedBy.name}</>
											))}
										</span>
									</div>
								) : (
									""
								)}
							</Card>
						) : (
							<h1>Não há ordem de serviço com este id</h1>
						)}
					</>
				)}
			</main>
		</Container>
	);
}
