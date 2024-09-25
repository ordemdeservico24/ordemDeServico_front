"use client";
import { ITeam } from "@/interfaces/team.interfaces";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCookie } from 'cookies-next';

interface Order {
    orderId: string;
    teamName?: string;
}

export const AssignTeam: React.FC<Order> = ({ orderId, teamName }) => {
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const token = getCookie('access_token');

    useEffect(() => {
        fetch("https://ordemdeservicosdev.onrender.com/api/team/get-all-teams", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setTeams(data);
                } else {
                    console.error("A resposta da API não é um array", data);
                    setTeams([]);
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar equipes", error);
                setTeams([]);
            });
    }, [token]);

    const handleSelectChange = (value: string) => {
        setSelectedTeam(value);
    };

    const assignTeam = async () => {
        toast.promise(
            fetch(
                `https://ordemdeservicosdev.onrender.com/api/order/assign-team/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ teamId: selectedTeam }),
                }
            )
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error("Falha ao atribuir equipe");
                })
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                }),
            {
                pending: "Atribuindo equipe...",
                success: "Equipe atribuída com sucesso!",
                error: "Ocorreu um erro ao atribuir equipe",
            }
        );
    };

    return (
        <div className="flex items-center space-x-4">
            <Select onValueChange={handleSelectChange} value={selectedTeam}>
                <SelectTrigger className="outline-none border border-[#2a2a2a] rounded px-2 py-1">
                    <SelectValue placeholder={teamName ? teamName : "Selecione uma equipe"} />
                </SelectTrigger>
                <SelectContent>
                    {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                            {team.teamName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                variant="default" className="bg-blue-500 hover:bg-blue-600"
                onClick={assignTeam}
            >
                Selecionar
            </Button>
        </div>
    );
};
