"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { getCookie } from "cookies-next";
import { IRevenue } from "@/interfaces/financial.interface";
import { Button } from "@/components/ui/button";

export default function RevenuesPage() {
  const [revenues, setRevenues] = useState<IRevenue | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = getCookie('access_token');

  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        const response = await fetch("https://ordemdeservicosdev.onrender.com/api/finance/revenues", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch revenues");
        }

        const data = await response.json();
        setRevenues(data);
      } catch (error) {
        console.error("Error fetching revenues:", error);
        setError("Erro ao carregar receitas.");
      }
    };

    fetchRevenues();
  }, [token]);

  if (error) {
    return (
      <Container className="overflow-x-auto">
        <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
          <p>{error}</p>
        </main>
      </Container>
    );
  }

  return (
    <Container className="overflow-x-auto">
      <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">       
                  <div>
                    <CardTitle className="text-[#3b82f6] text-2xl font-bold">Financeiro Receitas</CardTitle>
                    <CardDescription>Cheque todas as informações relacionadas ao financeiro de receitas.</CardDescription>
                  </div>
                  <h1>Total receitas: R$ {revenues?.totalRevenue.toFixed(2)}</h1>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">

              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Valor</TableCell>
                      <TableCell>Data de Criação</TableCell>
                      <TableCell>Gerar recibo</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenues?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>R$ {item.value.toFixed(2)}</TableCell>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell><Button variant="default" className="bg-blue-500 hover:bg-blue-600">Gerar recibo</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Container>
  );
}
