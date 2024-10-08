"use client";
import { Container } from "@/components/container";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "../../../zustandStore";
import { getCookie } from "cookies-next";
import { Briefcase, HelpCircle, User } from "lucide-react";
import { IUser } from "@/interfaces/user.interface";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Home() {
	const [user, setUser] = useState<IUser>();
	const { name, userId } = useStore();
	const token = getCookie("access_token");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);

		fetch(`${BASE_URL}/user/get-user/${userId}`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setUser(data); 
				} else {
					console.error("Resposta da API não é um array:", data);
				}
			})
			.catch((error) => {
				console.error("Erro ao buscar usuário:", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [token, userId]);

	const createdAt = user?.createdAt ? new Date(user.createdAt) : new Date();
	const currentDate = new Date();
	const diffTimeUser = Math.abs(currentDate.getTime() - createdAt.getTime());
	const diffDaysUser = Math.ceil(diffTimeUser / (1000 * 60 * 60 * 24));

	const startCompanyDate = user?.startCompanyDate ? new Date(user.startCompanyDate) : new Date();
	const diffTimeCompany = Math.abs(currentDate.getTime() - startCompanyDate.getTime());
	const diffDaysCompany = Math.ceil(diffTimeCompany / (1000 * 60 * 60 * 24));

	return (
		<Container>
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
					<div className="max-w-7xl mx-auto space-y-6">
						<h1 className="text-3xl font-bold">Olá, {name}!</h1>
						<section>
							<h2 className="text-xl font-semibold mb-4">Visão Geral do Sistema</h2>
							<div className="flex w-full flex-col lg:flex-row gap-6">
								<Card className="w-full">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Dias no Sistema</CardTitle>
										<User className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{diffDaysUser}</div>
									</CardContent>
								</Card>
								<Card className="w-full">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">Tempo na Empresa</CardTitle>
										<Briefcase className="h-4 w-4 text-muted-foreground" />
									</CardHeader>
									<CardContent>
										<div className="text-2xl font-bold">{diffDaysCompany}</div>
										<p className="text-xs text-muted-foreground">dias</p>
									</CardContent>
								</Card>
							</div>
						</section>
						<section>
							<h2 className="text-xl font-semibold mb-4">Dicas e Truques</h2>
							<Card>
								<CardHeader>
									<CardTitle>Você sabia?</CardTitle>
									<CardDescription>Aprenda a usar o sistema de forma mais eficiente com estas dicas rápidas.</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="list-disc pl-5 space-y-2">
										<li>
											Membros de equipe só podem ver a sua própria equipe, diferente dos líderes e gestores que podem ver outras.
										</li>
										<li>Todos os usuários são atrelados a um distrito, e no caso será ao distrito em que ele fez o cadastro.</li>
										<li>
											O sistema é dividido em cargos, e cada cargo possui permissões específicas, onde posteriormente pode ser
											atribuído a um usuário.
										</li>
									</ul>
								</CardContent>
							</Card>
						</section>
						<section>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<HelpCircle className="h-5 w-5 mr-2" />
										Precisa de Ajuda?
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="mb-4">
										Nossa equipe de suporte está sempre pronta para ajudar. Se você tiver dúvidas ou encontrar problemas, não hesite
										em entrar em contato.
									</p>
									<Button className="bg-blue-500 hover:bg-blue-600">Contatar Suporte</Button>
								</CardContent>
							</Card>
						</section>
					</div>
				)}
			</main>
		</Container>
	);
}
