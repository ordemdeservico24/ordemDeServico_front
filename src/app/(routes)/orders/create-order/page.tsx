"use client";
import Link from "next/link";
import React, { FormEvent } from "react";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";


export default function Page() {

	const request: IRequest = {} as IRequest

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const values = e.currentTarget.children
		const numberValues = e.currentTarget.childElementCount
		
		for(let i= 0; i < numberValues; i++){
			const input = values[i] as HTMLInputElement;
			if(input.name){
				//@ts-expect-error 
				request[input.name] = input.value
			}
		}

		await fetch("http://localhost:8080/api/order/create-order", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify(request),
		})
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
				Cadastrar nova ordem de serviço
			</h1>
			<div className="mt-4 bg-white min-w-full p-4 rounded-lg">
				<Link
					href="/orders"
					className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-fit"
				>
					Voltar
				</Link>
				<form action='#' onSubmit={(e)=>onSubmit(e)} className="mt-4 flex flex-wrap">
						<input
							type="text"
							name="subject"
							placeholder="Assunto"
						/>
					<input
						type="text"
						name="requesterName"
						placeholder="Nome do solicitante"
					/>
					<input
						type="tel"
						name="requesterPhone"
						placeholder="Telefone do solicitante"
					/>
					<input
						type="text"
						name="requesterPhone"
						placeholder="Endereço do solicitante"
					/>
					<input
						type="number"
						name="requesterHouseNumber"
						placeholder="N° da casa do solicitante"
					/>
					<input
						type="text"
						name="requesterComplement"
						placeholder="Complemento do solicitante"
					/>
					<input
						type="text"
						name="requesterZipcode"
						placeholder="CEP do solicitante"
					/>
					<input
						type="date"
						name="expirationDate"
					/>
					<textarea
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
		</>
	);
}
