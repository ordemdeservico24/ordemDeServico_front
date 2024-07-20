"use client";
import { Container } from "@/components/container";
import { ITeamMember } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
	const [members, setMembers] = useState<ITeamMember[]>([]);
	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-members",
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
				setMembers(data);
			});
	}, []);

	return (
		<div>
			<h1 className="font-semibold text-xl">Membros de equipes</h1>
			<div className="max-w-full overflow-x-auto">
				<Container className="overflow-x-auto">
					<div className="flex justify-between text-xs sm:text-base">
						<input
							type="search"
							name=""
							id=""
							placeholder="Pesquisar membro"
							className="border border-[#E7E7E7] px-2 outline-none"
						/>
						<Link
							href="/teams/members/create-member"
							className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all"
						>
							Adicionar
						</Link>
					</div>
					<table className="px-8 py-4 min-w-full divide-y divide-gray-200 rounded-xl bg-white">
						<thead>
							<tr className="text-left whitespace-nowrap">
								<th className="pr-12">Nome</th>
								<th className="pr-12">Telefone</th>
								<th className="pr-12">Profissão</th>
								<th className="pr-12">Equipe</th>
							</tr>
						</thead>
						<tbody>
							{members.map((member, index) => (
								<tr
									className="border-b cursor-pointer hover:bg-gray-100 whitespace-nowrap"
									key={index}
								>
									<td className="py-4 pr-12">
										{member.memberName}
									</td>
									<td className="py-4 pr-12">
										{member.memberPhone}
									</td>
									<td className="py-4 pr-12">
										{member.memberRole}
									</td>
									<td className="py-4 pr-12">
										{member.team.teamName}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Container>
			</div>
		</div>
	);
}
