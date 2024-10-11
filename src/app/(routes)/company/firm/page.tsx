"use client";
import { useState } from "react";
import { Container } from "@/components/container";
import Image from "next/image";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { useCompanyData } from "@/hooks/company/useCompanyData";
import { Users, Building2 } from "lucide-react";
import { FaBriefcase, FaShoppingCart, FaUser } from "react-icons/fa";

export default function FirmPage() {
	const [error, setError] = useState<string | null>(null);
	const { data, isLoading } = useCompanyData();

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
							<CardHeader>
								<CardTitle>Dados Gerais</CardTitle>
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
								<p><strong>Nome da Empresa:</strong> {data?.companyName || "Empresa XYZ Ltda."}</p>
								<p><strong>CNPJ:</strong> {data?.cnpj || "00.000.000/0001-00"}</p>
								</div>
							</CardContent>
							</Card>

							<Card className="mb-6">
							<CardHeader>
								<CardTitle>Estrutura Organizacional</CardTitle>
							</CardHeader>
							<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
								<div className="flex items-center gap-2">
								<Users className="h-5 w-5 text-muted-foreground" />
								<p><strong>Funções:</strong> {data?.roles?.length || 0}</p>
								</div>
								<div className="flex items-center gap-2">
								<FaShoppingCart className="h-5 w-5 text-muted-foreground" />
								<p><strong>Ordens:</strong> {data?.Order?.length || 0}</p>
								</div>
								<div className="flex items-center gap-2">
								<FaBriefcase className="h-5 w-5 text-muted-foreground" />
								<p><strong>Equipes:</strong> {data?.Team?.length || 0}</p>
								</div>
								<div className="flex items-center gap-2">
								<FaUser className="h-5 w-5 text-muted-foreground" />
								<p><strong>Usuários:</strong> {data?.User?.length || 1}</p>
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
								<p><strong>Grupos Primários:</strong> {data?.primaries?.length || 1}</p>
								</div>
								<div className="flex items-center gap-2">
								<Building2 className="h-5 w-5 text-muted-foreground" />
								<p><strong>Grupos Secundários:</strong> {data?.secondaries?.length || 1}</p>
								</div>
								<div className="flex items-center gap-2">
								<Building2 className="h-5 w-5 text-muted-foreground" />
								<p><strong>Grupos Terciários:</strong> {data?.tertiaries?.length || 1}</p>
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
