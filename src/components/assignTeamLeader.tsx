import { ITeamLeader } from "@/interfaces/team.interfaces";
import React, { useEffect, useState } from "react";

export const AssignTeamLeader = () => {
	const [leaders, setLeaders] = useState<ITeamLeader[]>([]);

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-leaders",
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
				setLeaders(data);
			});
	}, []);

	const availableLeaders = leaders.filter((leader) => !leader.teamId);

	return (
		<>
			<select
				name="teamLeaderId"
				id="teamLeaderId"
				className="outline-none border border-[#2a2a2a] rounded px-2 py-1 w-full mb-4"
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
