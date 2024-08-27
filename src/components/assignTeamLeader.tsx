import { ITeamLeader } from "@/interfaces/team.interfaces";
import React, { useEffect, useState } from "react";
import { getCookie } from 'cookies-next';

export const AssignTeamLeader = () => {
	const [leaders, setLeaders] = useState<ITeamLeader[]>([]);
	const token = getCookie('access_token');

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-leaders",
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
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
	}, [token]);

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
