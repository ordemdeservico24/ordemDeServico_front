import React from "react";

interface AssignedTeamProps {
	assignedTeam: {
		id: string;
		teamLeaderId: string;
		teamName: string;
		createdAt: string;
		updatedAt: string;
	} | null;
}

export const AssignedTeam: React.FC<AssignedTeamProps> = ({ assignedTeam }) => {
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
				<h1 className="font-medium text-lg py-4">
					Não possui equipe atribuída
				</h1>
			)}
		</div>
	);
};
