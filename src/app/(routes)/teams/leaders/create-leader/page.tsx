"use client";
import { Container } from "@/components/container";
import { Input } from "@/components/input";
import { ICreateLeader } from "@/interfaces/create-leader-request/createLeader.interface";
import Link from "next/link";
import React, { FormEvent } from "react";
import { toast } from "react-toastify";

export default function Page() {
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement;
		};

		const request: ICreateLeader = {
			name: getInput("name").value || "",
			email: getInput("email").value || "",
			phone: getInput("phone").value || "",
			role: getInput("role").value || "",
		};

		toast.promise(
			fetch(
				"https://ordemdeservicosdev.onrender.com/api/team/create-leader",
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
				}),
			{
				pending: "Criando líder de equipe",
				success: "Líder de equipe criado com sucesso!",
				error: "Ocorreu um erro ao criar líder de equipe",
			}
		);
	};
	return (
		<div>
			<h1 className="font-semibold text-xl">Adicionar líder</h1>
			<Container>
				<Link
					href="/teams/leaders"
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
							name="name"
							placeholder="Nome do líder"
							className="w-full"
						/>
						<Input
							type="email"
							name="email"
							placeholder="e-mail"
							className="w-full"
						/>
						<Input
							type="tel"
							name="phone"
							placeholder="Telefone"
							className="w-full"
						/>
						<Input
							type="text"
							name="role"
							placeholder="Profissão"
							className="w-full"
						/>
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
