"use client";
import { Container } from "@/components/container";
import { Input } from "@/components/input";
import { OrderSubjectSelect } from "@/components/orderSubjectSelect";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";
import { IOrderGet } from "@/interfaces/order.interface";
import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page({ params }: { params: { id: string } }) {
	const [order, setOrder] = useState<IOrderGet>();

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
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
				`https://ordemdeservicosdev.onrender.com/api/order/edit-order/${params.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
					},
					body: JSON.stringify(request),
				}
			)
				.then((res) => {
					const status = res.status;
					return res.json().then((data) => ({ status, data }));
				})
				.then(({ status, data }) => {
					console.log(status, data);
				}),
			{
				pending: "Editando ordem",
				success: "Ordem editada com sucesso",
				error: "Ocorreu um erro",
			}
		);
	};
	useEffect(() => {
		fetch(
			`https://ordemdeservicosdev.onrender.com/api/order/get-order/${params.id}`,
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiIxNTdhODg5MC1hYjBkLTQ1YWQtOTM2ZS0xYTg5ZjlmOWYzNTMiLCJyb2xlSWQiOiIzYThlMGEwMy03YWE0LTQ2MjktYWRlMS04ODE5YzdjYmMxOTYiLCJpYXQiOjE3MjQyNDMzNDd9.tB6DOfAN1TmILIvIdx6hYy2ENWOooCml6fFEeNmokGA`,
				},
			}
		)
			.then((res) => {
				const status = res.status;
				return res.json().then((data) => ({ status, data }));
			})
			.then(({ status, data }) => {
				console.log(status, data);
				setOrder(data);
			});
	}, [params.id]);
	
	return (
		<Container>
			<Link
				href="/orders"
				className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-fit"
			>
				Voltar
			</Link>
			{order ? (
				<div className="flex flex-col items-center">
					<form
						action="#"
						onSubmit={(e) => onSubmit(e)}
						className="mt-4 flex flex-col max-w-96 w-full"
					>
						<label htmlFor="subjectId">Categoria:</label>
						<OrderSubjectSelect
							name={order.subject.name}
							id={order.subject.id}
							expirationDays={order.subject.expirationDays}
						/>
						<Input
							type="text"
							name="requesterName"
							placeholder="Nome do solicitante"
							value={order.requesterName}
						/>
						<Input
							type="tel"
							name="requesterPhone"
							placeholder="Telefone do solicitante"
							value={order.requesterPhone}
						/>
						<Input
							type="text"
							name="requesterZipcode"
							placeholder="CEP do solicitante"
							value={order.requesterZipcode}
						/>
						<Input
							type="text"
							name="requesterStreet"
							placeholder="Endereço do solicitante"
							value={order.requesterStreet}
						/>
						<Input
							type="number"
							name="requesterHouseNumber"
							placeholder="N° da casa do solicitante"
							value={order.requesterHouseNumber}
						/>
						<Input
							type="text"
							name="requesterComplement"
							placeholder="Complemento do solicitante"
							value={order.requesterComplement}
						/>
						<Input
							textArea={true}
							name="notes"
							placeholder="Observações"
							value={order.notes}
						/>
						<button
							className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all w-full"
							type="submit"
						>
							Cadastrar
						</button>
					</form>
				</div>
			) : (
				<>
					<p>Carregando</p>
				</>
			)}
		</Container>
	);
}
