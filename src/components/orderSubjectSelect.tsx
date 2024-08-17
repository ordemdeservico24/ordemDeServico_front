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
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
				},
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
				<option value={id}>
					{name} ({expirationDays} dias de prazo)
				</option>
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
