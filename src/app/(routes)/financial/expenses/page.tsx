"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { getCookie } from "cookies-next";

export default function ExpensesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const token = getCookie('access_token');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("https://ordemdeservicosdev.onrender.com/api/finance/expenses", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        setCategories(data.categories);
        setTotalExpenses(data.totalAmount);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Erro ao carregar despesas.");
      }
    };

    fetchExpenses();
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
                    <CardTitle className="text-[#3b82f6] text-2xl font-bold">Financeiro Despesas</CardTitle>
                    <CardDescription>Cheque todas as informações relacionadas ao financeiro.</CardDescription>
                  </div>
                  <h1>Total despesas: R$ {(totalExpenses).toFixed(2)}</h1>
                </div>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Categoria</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Quantidade de Itens</TableCell>
                    <TableCell>Data de Criação</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell>{category.items}</TableCell>
                      <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Container>
  );
}
