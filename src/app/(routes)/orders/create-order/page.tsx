"use client";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";
import { Input } from "@/components/input";
import { Container } from "@/components/container";
import { toast } from "react-toastify";
import { ISubject } from "@/interfaces/subject.interface";

export default function Page() {
	const [subjects, setSubjects] = useState<ISubject[]>();

	useEffect(() => {
		fetch(
			`https://ordemdeservicosdev.onrender.com/api/order/get-all-subjects/`,
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
				setSubjects(data);
			});
	}, []);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement;
		};

		const request: IRequest = {
			subjectId: getInput("subjectId").value || "",
			requesterName: getInput("requesterName").value || "",
			requesterPhone: getInput("requesterPhone").value || "",
			requesterStreet: getInput("requesterStreet").value || "",
			requesterHouseNumber: +getInput("requesterHouseNumber").value || 0,
			requesterComplement: getInput("requesterComplement").value || "",
			requesterZipcode: getInput("requesterZipcode").value || "",
			notes: getInput("notes").value || "",
		};

		toast.promise(
			fetch(
				"https://ordemdeservicosdev.onrender.com/api/order/create-order",
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
				pending: "Criando ordem",
				success: "Ordem criada com sucesso",
				error: "Ocorreu um erro",
			}
		);
	};

	return (
		<>
			<h1 className="font-semibold text-xl">
				Cadastrar ordem de serviço
			</h1>
			<Container>
				<Link
					href="/orders"
					className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-fit"
				>
					Voltar
				</Link>
				<div className="flex flex-col items-center">
					<form
						action="#"
						onSubmit={(e) => onSubmit(e)}
						className="mt-4 flex flex-col max-w-96 w-full"
					>
						<select
							name="subjectId"
							id="subjectId"
							className="outline-none border border-[#2a2a2a] rounded px-2 py-1 mb-4"
						>
							{/* Opção para o subject atual */}
							<option value="">Selecione um assunto</option>
							{/* Opções para os demais subjects, filtrando o subject atual */}
							{subjects?.map((subject, index) => (
								<option value={subject.id} key={index}>
									{subject.name} ({subject.expirationDays}{" "}
									dias de prazo)
								</option>
							))}
						</select>
						<Input
							type="text"
							name="requesterName"
							placeholder="Nome do solicitante"
						/>
						<Input
							type="tel"
							name="requesterPhone"
							placeholder="Telefone do solicitante"
						/>
						<Input
							type="text"
							name="requesterStreet"
							placeholder="Endereço do solicitante"
						/>
						<Input
							type="number"
							name="requesterHouseNumber"
							placeholder="N° da casa do solicitante"
						/>
						<Input
							type="text"
							name="requesterComplement"
							placeholder="Complemento do solicitante"
						/>
						<Input
							type="text"
							name="requesterZipcode"
							placeholder="CEP do solicitante"
						/>
						<Input
							textArea={true}
							name="notes"
							placeholder="Observações"
						/>
						<button
							className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-full"
							type="submit"
						>
							Cadastrar
						</button>
					</form>
				</div>
			</Container>
		</>
	);
}
