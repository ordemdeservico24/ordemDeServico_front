"use client";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IRole } from "@/interfaces/user.interface";
import { getCookie } from "cookies-next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EditIcon, EyeIcon, PlusIcon, TrashIcon } from "lucide-react";

export default function Page({ params }: { params: { id: string } }) {
	const [role, setRole] = useState<IRole>();
	const token = getCookie("access_token");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch(`https://ordemdeservicosdev.onrender.com/api/user/get-role/${params.id}`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Resposta da API:", data);
				if (!data) {
					toast.error("Ocorreu um erro");
				}
				setRole(data);
			})
			.catch((error) => {
				console.error("Erro ao buscar usuários:", error);
			}).finally(() => {
				setIsLoading(false);
			});
	}, [token, params.id]);

	return (
		<Container className="p-4">
			<main className="grid flex-1 items-start gap-8 sm:px-6 sm:py-0 md:gap-12">
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
					{role ? (
					<>
						<Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
							<CardHeader className="bg-white p-4 flex flex-row-reverse justify-between items-center">
								<Link href="/roles">
									<Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">Voltar</Button>
								</Link>
								<h1 className="text-2xl font-semibold">Cargo - {role.roleName}</h1>
							</CardHeader>
							<CardContent className="p-6 space-y-2">
								<div className="border-b border-gray-300 pb-4 mb-4">
									<h2 className="text-xl font-semibold mb-4">Dados do Cargo</h2>
									<div className="space-y-2">
										<p className="text-gray-700">
											<strong className="font-medium">Nome:</strong> {role.roleName}
										</p>
										<p className="text-gray-700">
											<strong className="font-medium">Abrangência:</strong>{" "}
											{role.roleLevel === "primary" ? "Empresa" : "Distrito"}
										</p>
										<p className="text-gray-700">
											<strong className="font-medium">Usuários com esse cargo:</strong> {role.users?.length}
										</p>
									</div>
								</div>
							</CardContent>
							<CardContent className="px-6 space-y-2">
								<div className="border-b border-gray-300 pb-4 mb-4">
									<h2 className="text-xl text-center font-semibold mb-4">Recursos e Permissões</h2>
									{role?.permissions.map((permission, index) => (
										<div key={index} className="flex gap-4 mb-4 md:mb-8">
											<span className=" text-xs sm:text-sm lg:text-base w-full">{permission.resourceLabel}</span>
											<ul className="list-none flex gap-2 md:gap-4">
												<li className="rounded text-xs capitalize hover:cursor-pointer " title="Criar">
													<PlusIcon
														className={
															permission.operations.includes("create")
																? "opacity-100 size-4 md:size-5"
																: "opacity-20 size-4 md:size-5"
														}
													/>
												</li>
												<li className="rounded text-xs capitalize hover:cursor-pointer " title="Criar">
													<EyeIcon
														className={
															permission.operations.includes("read")
																? "opacity-100 size-4 md:size-5"
																: "opacity-20 size-4 md:size-5"
														}
													/>
												</li>
												<li className="rounded text-xs capitalize hover:cursor-pointer " title="Criar">
													<EditIcon
														className={
															permission.operations.includes("update")
																? "opacity-100 size-4 md:size-5"
																: "opacity-20 size-4 md:size-5"
														}
													/>
												</li>
												<li className="rounded text-xs capitalize hover:cursor-pointer " title="Criar">
													<TrashIcon
														className={
															permission.operations.includes("delete")
																? "opacity-100 size-4 md:size-5"
																: "opacity-20 size-4 md:size-5"
														}
													/>
												</li>
											</ul>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</>
						) : (
					<div className="text-center mt-10">
						<h1 className="text-xl font-bold text-gray-700">Não há cargo com este id</h1>
					</div>
					)}		
				</>
				)}
			</main>
		</Container>
	);
}
