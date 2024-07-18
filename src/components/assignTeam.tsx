import { ITeam } from "@/interfaces/team.interfaces";
import React, { useEffect, useState } from "react";

interface Order {
	orderId: string;
	teamName?: string;
}

export const AssignTeam: React.FC<Order> = ({ orderId, teamName }) => {
	console.log(orderId);
	const [teams, setTeams] = useState<ITeam[]>([]);
	const [selectedTeam, setSelectedTeam] = useState("");

	useEffect(() => {
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/get-all-teams",
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
				setTeams(data);
			});
	}, []);

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTeam(e.target.value);
	};

	const assignTeam = async () => {
		await fetch(`http://localhost:8080/api/order/assign-team/${orderId}`, {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({ teamId: selectedTeam }),
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
			<select
				name="teamId"
				id="teamId"
				className="outline-none border border-[#2a2a2a] rounded px-2 py-1 w-fit mb-4"
				onChange={handleSelectChange}
				value={selectedTeam}
			>
				<option value="">
					{teamName ? teamName : "Selecione uma equipe"}
				</option>
				{teams.map((teams, index) => (
					<option value={teams.id} key={index}>
						{teams.teamName}
					</option>
				))}
			</select>
			<button
				className="bg-[#7F56D8] text-white font-medium rounded px-3 py-1 hover:-translate-y-1 transition-all w-fit ml-4"
				onClick={assignTeam}
			>
				Selecionar
			</button>
		</>
	);
};
