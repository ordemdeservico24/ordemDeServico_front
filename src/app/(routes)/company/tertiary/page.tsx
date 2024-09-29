"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { ITertiaryGroup } from "@/interfaces/company.interface";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TertiaryGroupsPage() {
	const token = getCookie("access_token");
	const [tertiaryGroups, setTertiaryGroups] = useState<ITertiaryGroup[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	useEffect(() => {
		const fetchTertiaryGroups = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const response = await fetch("https://ordemdeservicosdev.onrender.com/api/company/get-all-tertiaries", {
					method: "GET",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}

				const data = await response.json();
				setTertiaryGroups(data);
			} catch (error) {
				console.error("Erro ao buscar os grupos terciários:", error);
				setError("Erro ao carregar dados dos grupos terciários.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTertiaryGroups();
	}, [token]);

	return (
		<Container className="overflow-x-auto">
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Distritos</CardTitle>
								<CardDescription>Veja todas as informações relacionadas aos distritos.</CardDescription>
							</div>
							<Button variant="default" className="bg-blue-500 hover:bg-blue-600">
								Criar Novo Distrito
							</Button>
						</div>
					</CardHeader>
					<div>
						{isLoading ? (
							<div className="text-center p-8">
								<span>Carregando dados...</span>
							</div>
						) : error ? (
							<div className="text-center text-red-500 p-8">
								<span>{error}</span>
							</div>
						) : (
							<Table className="overflow-x-auto">
								<TableHeader>
									<TableRow>
										<TableCell>Nome do Distrito</TableCell>
										<TableCell>Cidade</TableCell>
										<TableCell>Usuários</TableCell>
										<TableCell>Ordens</TableCell>
										<TableCell>Equipes</TableCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.isArray(tertiaryGroups) &&
										tertiaryGroups.map((group) => (
											<TableRow
												key={group.id}
												style={{ cursor: "pointer" }}
												onClick={() => router.push(`/company/tertiary/${group.id}`)}
											>
												<TableCell>{group.districtName}</TableCell>
												<TableCell>{group.secondary.cityName}</TableCell>
												<TableCell>{group.users?.length || 0} usuários</TableCell>
												<TableCell>{group.orders?.length || 0} ordens</TableCell>
												<TableCell>{group.subjects?.length || 0} equipes</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						)}
					</div>
				</Card>
			</main>
		</Container>
	);
}
