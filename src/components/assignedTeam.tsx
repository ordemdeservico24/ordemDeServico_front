import React, { useEffect, useState } from "react";
import { AssignTeam } from "./assignTeam";

interface AssignedTeamProps {
	assignedTeam: {
		id: string;
		teamLeaderId: string;
		teamName: string;
		createdAt: string;
		updatedAt: string;
	} | null;
	orderId: string;
}

export const AssignedTeam: React.FC<AssignedTeamProps> = ({
	assignedTeam,
	orderId,
}) => {
	return (
		<div>
			{assignedTeam ? (
				<>
					<h1 className="font-medium text-lg py-4">
						Equipe atribuída
					</h1>
					<p>{assignedTeam.teamName}</p>
				</>
			) : (
				<>
					<h1 className="font-medium text-lg py-4">
						Não possui equipe atribuída
					</h1>
					<AssignTeam orderId={orderId} />
				</>
			)}
		</div>
	);
};
