"use client";
import { ITeam } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
	const [teams, setTeams] = useState<ITeam[]>([]);

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-teams",
			{
				method: "GET",
			}
		)
			.then((res) => {
				const status = res.status;
				return res.json().then((data) => ({ status, data }));
			})
			.then(({ status, data }) => {
				console.log(status, data);
				setTeams(data);
			});
	}, []);

	return (
		<div>
			<h1 className="font-semibold text-xl">Equipes</h1>
			<div className="mt-4 bg-white min-w-full p-4 rounded-lg flex flex-col gap-4">
				<Link
					href="/teams/create"
					className="bg-[#7F56D8] text-white w-fit font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all"
				>
					Criar equipe
				</Link>
				<table className="px-8 py-4 min-w-full divide-y divide-gray-200 rounded-xl bg-white">
					<thead>
						<tr className="text-left">
							<th>Nome da equipe</th>
							<th>Líder da equipe</th>
							<th>Ordens atribuídas</th>
							<th>Membros na equipe</th>
						</tr>
					</thead>
					<tbody>
						{teams.map((team, index) => (
							<tr
								key={index}
								className="border-b cursor-pointer hover:bg-gray-100"
							>
								<td className="py-4">
									<Link href={`/teams/${team.id}`} passHref>
										<span className="block w-full h-full">
											{team.teamName}
										</span>
									</Link>
								</td>
								<td className="py-4">
									<Link href={`/teams/${team.id}`} passHref>
										<span className="block w-full h-full">
											{team.leader.name}
										</span>
									</Link>
								</td>
								<td className="py-4">
									<Link href={`/teams/${team.id}`} passHref>
										<span className="block w-full h-full">
											{team.orders.length}
										</span>
									</Link>
								</td>
								<td className="py-4">
									<Link href={`/teams/${team.id}`} passHref>
										<span className="block w-full h-full">
											{team.members.length}
										</span>
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
