"use client";
import { Input } from "@/components/input";
import Link from "next/link";
import React, { FormEvent, useRef } from "react";

export default function Page() {
	const subjectRef = useRef<HTMLInputElement>(null);
	const requesterNameRef = useRef<HTMLInputElement>(null);
	const requesterPhoneRef = useRef<HTMLInputElement>(null);
	const requesterStreetRef = useRef<HTMLInputElement>(null);
	const requesterHouseNumberRef = useRef<HTMLInputElement>(null);
	const requesterComplementRef = useRef<HTMLInputElement>(null);
	const requesterZipcodeRef = useRef<HTMLInputElement>(null);
	const expirationDateRef = useRef<HTMLInputElement>(null);
	const notesRef = useRef<HTMLTextAreaElement>(null);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(subjectRef.current?.value);
		const formattedDate = new Date(
			expirationDateRef.current?.value
		).toISOString();
		const houseNumber = Number(requesterHouseNumberRef.current?.value);
		await fetch("http://localhost:8080/api/order/create-order", {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				subject: subjectRef.current?.value,
				requesterName: requesterNameRef.current?.value,
				requesterPhone: requesterPhoneRef.current?.value,
				requesterStreet: requesterStreetRef.current?.value,
				requesterHouseNumber: houseNumber,
				requesterComplement: requesterComplementRef.current?.value,
				requesterZipcode: requesterZipcodeRef.current?.value,
				expirationDate: formattedDate,
				notes: notesRef.current?.value,
			}),
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
				<form onSubmit={onSubmit} className="mt-4 flex flex-wrap">
					<input
						type="text"
						name="subject"
						placeholder="Assunto"
						ref={subjectRef}
					/>
					<input
						type="text"
						name="requesterName"
						placeholder="Nome do solicitante"
						ref={requesterNameRef}
					/>
					<input
						type="tel"
						name="requesterPhone"
						placeholder="Telefone do solicitante"
						ref={requesterPhoneRef}
					/>
					<input
						type="text"
						name="requesterStreet"
						placeholder="Endereço do solicitante"
						ref={requesterStreetRef}
					/>
					<input
						type="number"
						name="requesterHouseNumber"
						placeholder="N° da casa do solicitante"
						ref={requesterHouseNumberRef}
					/>
					<input
						type="text"
						name="requesterComplement"
						placeholder="Complemento do solicitante"
						ref={requesterComplementRef}
					/>
					<input
						type="text"
						name="requesterZipcode"
						placeholder="CEP do solicitante"
						ref={requesterZipcodeRef}
					/>
					<input
						type="date"
						name="expirationDate"
						ref={expirationDateRef}
					/>
					<textarea
						name="notes"
						placeholder="Observações"
						ref={notesRef}
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
