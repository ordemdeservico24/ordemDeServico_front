"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { ISecondaryGroup } from "@/interfaces/company.interface";
import { Button } from "@/components/ui/button";

export default function SecondaryGroupsPage() {
  const token = getCookie('access_token');
  const [secondaryGroups, setSecondaryGroups] = useState<ISecondaryGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecondaryGroups = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://ordemdeservicosdev.onrender.com/api/company/get-all-secondaries", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setSecondaryGroups(data);
      } catch (error) {
        console.error("Erro ao buscar os grupos secundários:", error);
        setError("Erro ao carregar dados dos grupos secundários.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecondaryGroups();
  }, [token]);

  return (
    <Container className="overflow-x-auto">
      <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
        {isLoading ? (
        <div className="flex justify-center items-center">
        <svg
          className="h-8 w-8 animate-spin text-gray-600 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
          ) : error ? (
              <div className="text-center text-red-500 p-8">
                <span>{error}</span>
              </div>
            ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[#3b82f6] text-2xl font-bold">Secondary Groups</CardTitle>
                <CardDescription>Cheque todas as informações relacionadas aos grupos secundários.</CardDescription>
              </div>
              <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                Criar Novo Grupo Secundário
              </Button>
            </div>
          </CardHeader>
          <div>
            

            
              <Table className="overflow-x-auto">
                <TableHeader>
                  <TableRow>
                    <TableCell>Nome da Cidade</TableCell>
                    <TableCell>ID do Grupo Primário</TableCell>
                    <TableCell>Terciários</TableCell>
                    <TableCell>Compania</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(secondaryGroups) && secondaryGroups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell>{group.cityName}</TableCell>
                      <TableCell>{group.primaryGroupId}</TableCell>
                      <TableCell>{group.tertiaries?.length || 0} terciários</TableCell>
                      <TableCell>{group.company?.name || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
          </Card>
        )}
      </main>
    </Container>
  );
}
