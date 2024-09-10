import { ICreateTeam } from "./create-team-request/createTeam.interface";
import { IOrder } from "./order.interface";
import { IUser } from "./user.interface";

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
	teamId: string;
	user: IUser;
	team: ICreateTeam;
}

export interface ITeamMember {
	id: string;
	teamId: string;
	user: IUser;
	team: ICreateTeam;
}
