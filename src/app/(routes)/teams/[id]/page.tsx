"use client";
import { Container } from "@/components/container";
import { ITeam } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
	const [team, setTeam] = useState<ITeam>();

	useEffect(() => {
		fetch(
			`https://ordemdeservicosdev.onrender.com/api/team/get-team/${params.id}`,
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
				setTeam(data);
			});
	}, [params.id]);

	const truncateNotes = (notes: string, maxLength: number) => {
		if (notes.length > maxLength) {
			return notes.substring(0, maxLength) + "...";
		}
		return notes;
	};

	const formattedDates = (date: Date) => {
		return new Date(date).toLocaleString("pt-BR", {
			timeZone: "America/Sao_Paulo",
		});
	};

	return (
		<Container>
			<Link
				href="/teams"
				className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-fit"
			>
				Voltar
			</Link>
			<h1 className="font-semibold text-xl">{team?.teamName}</h1>
			<div>
				<p>Ordens atribuídas ({team?.orders.length})</p>
				<div className="flex gap-1 sm:gap-4 mt-4">
					{team?.orders.map((order, index) => (
						<Link
							className="bg-[#7F56D8] text-white p-4 rounded flex flex-col justify-between gap-2 max-w-52 w-full hover:scale-105 transition-all"
							key={index}
							href={`/orders/order/${order.id}`}
						>
							<div className="flex flex-col gap-2">
								<p className="font-semibold text-xs sm:text-base">
									{order.subject}
								</p>
								<p className="text-[.6rem] sm:text-xs">
									{truncateNotes(order.notes, 100)}
								</p>
							</div>
							<p className="border-t border-white text-[.5rem] sm:text-xs pt-3 text-right">
								{formattedDates(order.openningDate)}
							</p>
						</Link>
					))}
				</div>
			</div>
			<div>
				<p>Membros na equipe: ({team?.members.length})</p>
				<table className="mt-4 px-8 py-4 min-w-full divide-y divide-gray-200 rounded-xl bg-white">
					<thead>
						<tr className="text-left text-sm sm:text-base">
							<th className="px-4">Nome</th>
							<th>Profissão</th>
							<th>Telefone</th>
						</tr>
					</thead>
					<tbody>
						{team?.members.map((member, index) => (
							<tr
								key={index}
								className="cursor-pointer hover:bg-gray-100 text-xs sm:text-base"
							>
								<td className="py-4 px-4">
									<p>{member.memberName}</p>
								</td>
								<td className="py-4">
									<p>{member.memberRole}</p>
								</td>
								<td className="py-4">
									<p>{member.memberPhone}</p>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Container>
	);
}
