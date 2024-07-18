"use client";
import Link from "next/link";
import React, { FormEvent } from "react";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";
import { Input } from "@/components/input";
import { Container } from "@/components/container";

export default function Page() {
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const getInput = (name: string): HTMLInputElement => {
			return e.currentTarget.querySelector(
				`[name="${name}"]`
			) as HTMLInputElement;
		};

		const request: IRequest = {
			subject: getInput("subject").value || "",
			requesterName: getInput("requesterName").value || "",
			requesterPhone: getInput("requesterPhone").value || "",
			requesterStreet: getInput("requesterStreet").value || "",
			requesterHouseNumber: +getInput("requesterHouseNumber").value || 0,
			requesterComplement: getInput("requesterComplement").value || "",
			requesterZipcode: getInput("requesterZipcode").value || "",
			expirationDate: getInput("expirationDate").value
				? new Date(getInput("expirationDate").value).toISOString()
				: "",
			notes: getInput("notes").value || "",
		};

		await fetch(
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
			});
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
				<form
					action="#"
					onSubmit={(e) => onSubmit(e)}
					className="mt-4 flex flex-wrap"
				>
					<Input type="text" name="subject" placeholder="Assunto" />
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
					<Input type="date" name="expirationDate" />
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
			</Container>
		</>
	);
}
