"use client";
import { AssignTeamLeader } from "@/components/assignTeamLeader";
import { Input } from "@/components/input";
import { ICreateTeam } from "@/interfaces/create-team-request/createTeam.interface";
import Link from "next/link";
import React, { FormEvent } from "react";

export default function Page() {
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement;
		};

		const request: ICreateTeam = {
			teamName: getInput("teamName").value || "",
			teamLeaderId: getInput("teamLeaderId").value || "",
		};

		await fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/create-team",
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

	return (
		<div>
			<h1 className="font-semibold text-xl">Criar nova equipe</h1>
			<div className="mt-4 bg-white min-w-full p-4 rounded-lg flex flex-col gap-4">
				<Link
					href="/teams"
					className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-fit"
				>
					Voltar
				</Link>
				<form
					action="#"
					onSubmit={(e) => onSubmit(e)}
					className="mt-4 flex flex-col justify-center items-center"
				>
					<div className="flex flex-col items-center w-96">
						<Input
							type="text"
							name="teamName"
							placeholder="Nome da equipe"
						/>
						<AssignTeamLeader />
						<button
							className="bg-[#7F56D8] text-white font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-fit"
							type="submit"
						>
							Criar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
