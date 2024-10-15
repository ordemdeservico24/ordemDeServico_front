"use client";
import { ITeam } from "@/interfaces/team.interfaces";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { useStore } from "@/zustandStore";
import { hasPermission } from "@/utils/hasPermissions";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Order {
	orderId: string;
	teamName?: string;
}

export const AssignTeam: React.FC<Order> = ({ orderId, teamName }) => {
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [selectedTeam, setSelectedTeam] = useState<string>("");
	const token = getCookie("access_token");
	const { role = [] } = useStore();

	useEffect(() => {
		fetch(`${BASE_URL}/team/get-all-teams`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					setTeams(data);
				} else {
					console.error("A resposta da API não é um array", data);
					setTeams([]);
				}
			})
			.catch((error) => {
				console.error("Erro ao buscar equipes", error);
				setTeams([]);
			});
	}, [token]);

	const handleSelectChange = (value: string) => {
		setSelectedTeam(value);
	};

	const assignTeam = async () => {
		toast.promise(
			fetch(`${BASE_URL}/order/assign-team/${orderId}`, {
				method: "PATCH",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ teamId: selectedTeam }),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}
					throw new Error("Falha ao atribuir equipe");
				})
				.then((data) => {
					// console.log(data);
				})
				.catch((error) => {
					console.log(error);
				}),
			{
				pending: "Atribuindo equipe...",
				success: {
					render: "Equipe atribuída com sucesso!",
					onClose: () => {
						window.location.reload();
					},
					autoClose: 1500,
				},
				error: "Ocorreu um erro ao atribuir equipe",
			}
		);
	};

	return (
		<div className="flex items-center space-x-4">
			{hasPermission(role, "teams_management", "update") && (
				<>
					<Select onValueChange={handleSelectChange} value={selectedTeam}>
						<SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
							<SelectValue placeholder={teamName ? teamName : "Selecione uma equipe"} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">Nenhuma</SelectItem>
							{teams.map((team) => (
								<SelectItem key={team.id} value={team.id}>
									{team.teamName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button variant="default" className="bg-blue-500 hover:bg-blue-600" onClick={assignTeam}>
						Selecionar
					</Button>
				</>
			)}
		</div>
	);
};
