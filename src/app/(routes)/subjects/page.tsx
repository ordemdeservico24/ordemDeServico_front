"use client";
import { Container } from "@/components/container";
import { ISubject } from "@/interfaces/subject.interface";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
	const [subjects, setSubjects] = useState<ISubject[]>();

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/order/get-all-subjects",
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

	return (
		<>
			<h1 className="font-semibold text-xl">Categorias</h1>
			<div className="max-w-full overflow-x-auto">
				<Container className="overflow-x-auto">
					<div className="flex justify-between text-xs sm:text-base">
						<input
							type="search"
							name=""
							id=""
							placeholder="Pesquisar categoria"
							className="border border-[#E7E7E7] px-2 outline-none"
						/>
						<Link
							href="/subjects/create-subject"
							className="bg-[#7F56D8] text-white font-medium rounded px-4 py-2 hover:-translate-y-1 transition-all"
						>
							Criar
						</Link>
					</div>
					<table className="px-8 py-4 min-w-full divide-y divide-gray-200 rounded-xl bg-white">
						<thead>
							<tr className="text-left whitespace-nowrap">
								<th className="pr-6">Nome da categoria</th>
								<th className="pr-6">Dias para resolução</th>
								<th className="pr-6">Ordens atribuídas</th>
							</tr>
						</thead>
						<tbody>
							{subjects?.map((subject, index) => (
								<tr
									key={index}
									className="border-b cursor-pointer hover:bg-gray-100 whitespace-nowrap"
								>
									<td className="py-4 pr-6">
										<span className="block w-full h-full">
											{subject.name}
										</span>
									</td>
									<td className="py-4 pr-6">
										<span className="block w-full h-full">
											{subject.expirationDays}
										</span>
									</td>
									<td className="py-4 pr-6">
										<span className="block w-full h-full">
											{subject.orders?.length}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Container>
			</div>
		</>
	);
}
