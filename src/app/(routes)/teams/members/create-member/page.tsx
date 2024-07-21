"use client";
import { Container } from "@/components/container";
import { Input } from "@/components/input";
import { ICreateMember } from "@/interfaces/create-member-request/createMember.interface";
import { ITeam } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";

export default function Page() {
	const [teams, setTeams] = useState<ITeam[]>();
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement;
		};

		const request: ICreateMember = {
			memberName: getInput("memberName").value || "",
			memberPhone: getInput("memberPhone").value || "",
			memberRole: getInput("memberRole").value || "",
			teamId: getInput("teamId").value || "",
		};
		await fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/create-member",
			{
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(request),
			}
		)
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then((data) => {
				console.log(data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

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
			<h1 className="font-semibold text-xl">Adicionar membro</h1>
			<Container>
				<Link
					href="/teams/members"
					className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-fit"
				>
					Voltar
				</Link>
				<form
					action="#"
					onSubmit={(e) => onSubmit(e)}
					className="mt-4 flex flex-col justify-center items-center"
				>
					<div className="flex flex-col items-center max-w-96 w-full">
						<Input
							type="text"
							name="memberName"
							placeholder="Nome do membro"
							className="w-full"
						/>
						<Input
							type="tel"
							name="memberPhone"
							placeholder="Telefone"
							className="w-full"
						/>
						<Input
							type="text"
							name="memberRole"
							placeholder="Profissão"
							className="w-full"
						/>
						<select
							name="teamId"
							id="teamId"
							className="outline-none border border-[#2a2a2a] rounded px-2 py-1 w-full mb-4"
						>
							<option value="">Selecione um time</option>
							{teams?.map((team, index) => (
								<option value={team.id} key={index}>
									{team.teamName}
								</option>
							))}
						</select>
						<button
							className="bg-[#7F56D8] text-white font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
							type="submit"
						>
							Criar
						</button>
					</div>
				</form>
			</Container>
		</div>
	);
}
