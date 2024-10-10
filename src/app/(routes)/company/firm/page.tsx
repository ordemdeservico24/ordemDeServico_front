"use client";
import { useState } from "react";
import { Container } from "@/components/container";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useCompanyData } from "@/hooks/company/useCompanyData";

export default function FirmPage() {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { data } = useCompanyData();

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
						<Card className="border border-gray-200 rounded-lg overflow-hidden">
							<CardHeader className="bg-white p-4 flex justify-between items-center">
								<h1 className="text-2xl font-semibold">Perfil da Empresa</h1>
							</CardHeader>
							<CardContent className="p-6 space-y-6">
								<div className="border-b border-gray-300 pb-4 mb-4">
									<h2 className="text-xl font-semibold mb-4">Dados Gerais</h2>
									<div className="space-y-2">
										<p className="text-gray-700">
											<strong className="font-medium">CNPJ:</strong> {data?.cnpj}
										</p>
										<p className="text-gray-700">
											<strong className="font-medium">Nome da Empresa:</strong> {data?.companyName}
										</p>
										{data?.companyPhoto && (
											<Image
												src={data.companyPhoto}
												alt="Logo da Empresa"
												width={100}
												height={100}
												className="w-24 mx-auto my-4 object-contain"
											/>
										)}
									</div>
								</div>

								<div className="mb-4">
									<h3 className="text-xl font-semibold mb-4">Estrutura Organizacional</h3>
									<ul className="space-y-2">
										<li>
											<span className="text-sm sm:text-base lg:text-xl font-semibold">{`Funções: ${data?.roles?.length || 0
												}`}</span>
										</li>
										<li>
											<span className="text-sm sm:text-base lg:text-xl font-semibold">{`Ordens: ${data?.Order?.length || 0
												}`}</span>
										</li>
										<li>
											<span className="text-sm sm:text-base lg:text-xl font-semibold">{`Equipes: ${data?.Team?.length || 0
												}`}</span>
										</li>
										<li>
											<span className="text-sm sm:text-base lg:text-xl font-semibold">{`Usuários: ${data?.User?.length || 0
												}`}</span>
										</li>
									</ul>
								</div>

								<div className="mb-4">
									<h3 className="text-xl font-semibold mb-4">Grupos</h3>
									<ul className="space-y-2">
										<li>
											<span className="text-sm sm:text-base lg:text-xl font-semibold">{`Grupos Primários: ${data?.primaries?.length || 0
												}`}</span>
										</li>
										<li>
											<span className="text-sm sm:text-base lg:text-xl font-semibold">{`Grupos Secundários: ${data?.secondaries?.length || 0
												}`}</span>
										</li>
										<li>
											<span className="text-sm sm:text-base lg:text-xl font-semibold">{`Grupos Terciários: ${data?.tertiaries?.length || 0
												}`}</span>
										</li>
									</ul>
								</div>
							</CardContent>
						</Card>
					)}
				</main>
			</Container>
		);
	};

	return renderFirmInfo();
}
