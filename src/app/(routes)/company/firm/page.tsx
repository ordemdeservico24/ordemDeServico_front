"use client";
import { FormEvent, useState } from "react";
import { Container } from "@/components/container";
import Image from "next/image";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useCompanyData } from "@/hooks/company/useCompanyData";
import { Users, Building2 } from "lucide-react";
import { FaBriefcase, FaShoppingCart, FaUser } from "react-icons/fa";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ICompany } from "@/interfaces/company.interface";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function FirmPage() {
	const [error, setError] = useState<string | null>(null);
	const [company, setCompany] = useState<ICompany>();
	const { data, isLoading } = useCompanyData();
	const [photo, setPhoto] = useState<File | null>(null);
	const token = getCookie("access_token");

	const handleEdit = async () => {
		await fetch(`${BASE_URL}/company/get-company`, {
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
				if (data.status === "error" || (status === 400 && data.message) || data.error) {
					toast.error(data.message || data.error);
				}
				setCompany(data);
			});
	};

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setPhoto(e.target.files[0]);
		}
	};

	const editCompany = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
		};

		const request: {
			companyName: string;
			cnpj: string;
		} = {
			companyName: getInput("companyName").value || "",
			cnpj: getInput("cnpj").value || "",
		};

		const formData = new FormData();

		if (photo) {
			formData.append("companyPhoto", photo);
		}
		formData.append("companyName", request.companyName);
		formData.append("cnpj", request.cnpj);
		console.log(formData);
		toast.promise(
			fetch(`${BASE_URL}/company/edit-company/${company?.id}`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			})
				.then(async (res) => {
					if (res.status === 400) {
						const data = await res.json();
						toast.error(data.message);
						throw new Error(data.message);
					}
					if (res.ok) {
						return res.json();
					}
				})
				.then((data) => {
					console.log(data);
				})
				.catch((error) => {
					console.log(error);
					throw error;
				}),
			{
				pending: "Editando...",
				success: {
					render: "Editado com sucesso",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao editar",
			}
		);
	};

	const renderFirmInfo = () => {
		if (error) {
			return <div className="text-red-500">{error}</div>;
		}

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
						<Card className="p-4">
							<h1 className="text-3xl font-bold mb-6">Perfil da Empresa</h1>

							<Card className="mb-6">
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle>Dados Gerais</CardTitle>
									{/* <Dialog>
										<DialogTrigger asChild>
											<Button variant="default" className="bg-blue-500 hover:bg-blue-600" onClick={handleEdit}>
												Editar
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>Editar empresa</DialogTitle>
												<DialogDescription>Modifique as informações da empresa aqui.</DialogDescription>
											</DialogHeader>
											<form action="#" onSubmit={(e) => editCompany(e)} className="flex flex-col gap-2">
												<Input
													type="text"
													name="companyName"
													defaultValue={company?.companyName}
													placeholder="Digite aqui o nome da empresa"
												/>
												<Input type="text" name="cnpj" defaultValue={company?.cnpj} placeholder="Digite aqui o cnpj" />
												<Label htmlFor="companyPhoto">Foto da empresa:</Label>
												<Input
													type="file"
													id="companyPhoto"
													name="companyPhoto"
													accept="image/*"
													onChange={handlePhotoChange}
												/>
												<DialogFooter>
													<Button type="submit" className="bg-blue-500 hover:bg-blue-600">
														Salvar
													</Button>
													<DialogClose asChild>
														<Button type="button" className="bg-blue-500 hover:bg-blue-600">
															Cancelar
														</Button>
													</DialogClose>
												</DialogFooter>
											</form>
										</DialogContent>
									</Dialog> */}
								</CardHeader>
								<CardContent className="flex flex-col md:flex-row items-center gap-6">
									<div className="w-32 h-32 relative">
										<Image
											src={data?.companyPhoto || "/placeholder.svg"}
											alt="Logo da Empresa"
											width={128}
											height={128}
											className="rounded-full"
										/>
									</div>
									<div>
										<p>
											<strong>Nome da Empresa:</strong> {data?.companyName || "Empresa XYZ Ltda."}
										</p>
										<p>
											<strong>CNPJ:</strong> {data?.cnpj || "00.000.000/0001-00"}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card className="mb-6">
								<CardHeader>
									<CardTitle>Estrutura Organizacional</CardTitle>
								</CardHeader>
								<CardContent className="flex justify-between flex-wrap gap-4">
									<div className="flex items-center gap-2">
										<Users className="h-5 w-5 text-muted-foreground" />
										<p>
											<strong>Cargos:</strong> {data?.roles?.length || 0}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<FaShoppingCart className="h-5 w-5 text-muted-foreground" />
										<p>
											<strong>Ordens:</strong> {data?.Order?.length || 0}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<FaBriefcase className="h-5 w-5 text-muted-foreground" />
										<p>
											<strong>Equipes:</strong> {data?.Team?.length || 0}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<FaUser className="h-5 w-5 text-muted-foreground" />
										<p>
											<strong>Usuários/Funcionários:</strong> {data?.User?.length || 1}
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Grupos</CardTitle>
								</CardHeader>
								<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-muted-foreground" />
										<p>
											<strong>Estados:</strong> {data?.primaries?.length || 1}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-muted-foreground" />
										<p>
											<strong>Cidades:</strong> {data?.secondaries?.length || 1}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-muted-foreground" />
										<p>
											<strong>Distritos:</strong> {data?.tertiaries?.length || 1}
										</p>
									</div>
								</CardContent>
							</Card>
						</Card>
					)}
				</main>
			</Container>
		);
	};

	return renderFirmInfo();
}
