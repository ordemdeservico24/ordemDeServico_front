import { ICreateTeam } from "./create-team-request/createTeam.interface";
import { IOrder } from "./order.interface";

export interface ITeam {
	id: string;
	teamLeaderId: string;
	teamName: string;
	leader: ITeamLeader;
	orders: IOrder[];
	members: ITeamMember[];
}

export interface ITeamLeader {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	teamId: string;
	team: ICreateTeam;
}

export interface ITeamMember {
	id: string;
	teamId: string;
	memberRole: string;
	memberPhone: string;
	memberName: string;
}
