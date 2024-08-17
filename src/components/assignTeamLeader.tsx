import { ITeamLeader } from "@/interfaces/team.interfaces";
import React, { useEffect, useState } from "react";

export const AssignTeamLeader = () => {
	const [leaders, setLeaders] = useState<ITeamLeader[]>([]);

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-leaders",
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
				setLeaders(data);
			});
	}, []);

	const availableLeaders = Array.isArray(leaders) ? leaders.filter((leader) => !leader.teamId) : [];

	return (
		<>
			<select
				name="teamLeaderId"
				id="teamLeaderId"
				className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full mb-4"
			>
				<option value="">{"Selecione um líder"}</option>
				{availableLeaders.map((leader, index) => (
					<option value={leader.id} key={index}>
						{leader.name}
					</option>
				))}
			</select>
		</>
	);
};
