"use client";
import { ITeam } from "@/interfaces/team.interfaces";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Order {
    orderId: string;
    teamName?: string;
}

export const AssignTeam: React.FC<Order> = ({ orderId, teamName }) => {
    const [teams, setTeams] = useState<ITeam[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<string>("");

    useEffect(() => {
        fetch("https://ordemdeservicosdev.onrender.com/api/team/get-all-teams", {
            method: "GET",
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
    }, []);

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
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
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
                className=" text-white font-medium rounded px-3 py-1 hover:-translate-y-1 transition-all"
                onClick={assignTeam}
            >
                Selecionar
            </Button>
        </div>
    );
};
