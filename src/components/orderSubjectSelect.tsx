import { ISubject } from "@/interfaces/subject.interface";
import React, { useEffect, useState } from "react";

export const OrderSubjectSelect: React.FC<ISubject> = ({
	name,
	id,
	expirationDays,
}) => {
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

	return (
		<>
			<select
				name="subjectId"
				id="subjectId"
				className="outline-none border border-[#2a2a2a] rounded px-2 py-1 mb-4"
			>
				{/* Opção para o subject atual */}
				<option value={id}>
					{name} ({expirationDays} dias de prazo)
				</option>
				{/* Opções para os demais subjects, filtrando o subject atual */}
				{subjects
					?.filter((subject) => subject.id !== id)
					.map((subject, index) => (
						<option value={subject.id} key={index}>
							{subject.name} ({subject.expirationDays} dias de
							prazo)
						</option>
					))}
			</select>
		</>
	);
};
