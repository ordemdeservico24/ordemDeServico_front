"use client";
import React from "react";
import { AssignTeam } from "./assignTeam";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { hasPermission } from "@/utils/hasPermissions";
import { useStore } from "@/zustandStore";

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

export const AssignedTeam: React.FC<AssignedTeamProps> = ({ assignedTeam, orderId }) => {
	const { role = [] } = useStore();
	return (
		<div className="space-y-4">
			{assignedTeam ? (
				<Card>
					<CardHeader>
						<h1 className="font-medium text-lg py-4">Equipe atribuída</h1>
					</CardHeader>
					<CardContent>
						<p>
							<strong>Nome da equipe:</strong> {assignedTeam.teamName}
						</p>
						<p>
							<strong>Data de criação:</strong> {new Date(assignedTeam.createdAt).toLocaleDateString()}
						</p>
						<p>
							<strong>Data de atualização:</strong> {new Date(assignedTeam.updatedAt).toLocaleDateString()}
						</p>
					</CardContent>
					<CardFooter>
						{hasPermission(role, "orders_management", "update") && <AssignTeam orderId={orderId} teamName={assignedTeam.teamName} />}
					</CardFooter>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<h1 className="font-medium text-lg py-4">Não possui equipe atribuída</h1>
					</CardHeader>
					<CardContent>
						<p>Nenhuma equipe foi atribuída a esta ordem de serviço.</p>
					</CardContent>
					<CardFooter>{hasPermission(role, "orders_management", "update") && <AssignTeam orderId={orderId} />}</CardFooter>
				</Card>
			)}
		</div>
	);
};
