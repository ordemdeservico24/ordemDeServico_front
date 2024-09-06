"use client";
import { Container } from "@/components/container";
import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { getCookie } from 'cookies-next';
import { z } from "zod";
import { IUser } from "@/interfaces/user.interface";
import { ITeam } from "@/interfaces/team.interfaces";

const createMemberSchema = z.object({
  userId: z.string().nonempty("Usuário é obrigatório."),
  teamId: z.string().nonempty("Equipe é obrigatória."),
});

export default function Page() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const token = getCookie('access_token');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const getInput = (name: string): HTMLSelectElement => {
      return e.currentTarget.querySelector(
        `[name="${name}"]`
      ) as HTMLSelectElement;
    };

    const request = {
      userId: getInput("userId").value || "",
      teamId: getInput("teamId").value || "",
    };

    const result = createMemberSchema.safeParse(request);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    toast.promise(
      fetch(
        "https://ordemdeservicosdev.onrender.com/api/team/create-member",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
        }
      )
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
        }),
      {
        pending: "Criando membro de equipe",
        success: "Membro de equipe criado com sucesso!",
        error: "Ocorreu um erro ao criar membro de equipe",
      }
    );
  };

  useEffect(() => {
    fetch(
      "https://ordemdeservicosdev.onrender.com/api/team/get-all-teams",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
      });
  }, [token]);

  useEffect(() => {
    fetch("https://ordemdeservicosdev.onrender.com/api/user/get-all-users", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    })
    .then((res) => res.json())
    .then((data) => {
      setUsers(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      setUsers([]);
    });
  }, [token]);

  return (
    <Container className="p-4">
      <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle className="text-[#3b82f6] text-2xl font-bold">Membros</CardTitle>
                <CardDescription>Cheque todas as informações relacionadas aos membros apresentados.</CardDescription>
                <div className="flex gap-3 items-center justify-between">
                  <div className="relative flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Pesquisar..."
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" className="bg-blue-500 hover:bg-blue-600">Criar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar membro</DialogTitle>
                        <DialogDescription>
                          Selecione o usuário e a equipe para criar um membro.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        action="#"
                        onSubmit={(e) => onSubmit(e)}
                        className="flex flex-col justify-center items-center"
                      >
                        <div className="flex gap-3 flex-col items-center max-w-96 w-full">
                          <select
                            name="userId"
                            className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full"
                          >
                            <option value="">Selecione um usuário</option>
                            {users.map((user, index) => (
                              <option value={user.id} key={index}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                          <select
                            name="teamId"
                            className="outline-none border focus:border-[#2a2a2a] rounded px-2 py-1 w-full"
                          >
                            <option value="">Selecione uma equipe</option>
                            {teams.map((team, index) => (
                              <option value={team.id} key={index}>
                                {team.teamName}
                              </option>
                            ))}
                          </select>
                          <Button
                            className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
                            type="submit"
                          >
                            Criar
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Container>
  );
}
