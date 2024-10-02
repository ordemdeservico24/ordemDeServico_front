"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { IPrimaryGroup } from "@/interfaces/company.interface";
import { Button } from "@/components/ui/button";

export default function PrimaryGroupsPage() {
  const token = getCookie('access_token');
  const [primaryGroups, setPrimaryGroups] = useState<IPrimaryGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrimaryGroups = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://ordemdeservicosdev.onrender.com/api/company/get-all-primaries", {
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
        setPrimaryGroups(data);
      } catch (error) {
        console.error("Erro ao buscar os grupos primários:", error);
        setError("Erro ao carregar dados dos grupos primários.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrimaryGroups();
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
                <CardTitle className="text-[#3b82f6] text-2xl font-bold">Primary Groups</CardTitle>
                <CardDescription>Cheque todas as informações relacionadas aos grupos primários.</CardDescription>
              </div>
              <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                Criar Novo Grupo Primário
              </Button>
            </div>
          </CardHeader>
          <div>

              <Table className="overflow-x-auto">
                <TableHeader>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nome do Estado</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(primaryGroups) && primaryGroups.map((group) => (
                        <TableRow key={group.id}>
                            <TableCell>{group.id}</TableCell>
                            <TableCell>{group.stateName}</TableCell>
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