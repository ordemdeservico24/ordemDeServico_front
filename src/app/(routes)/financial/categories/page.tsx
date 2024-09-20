"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCookie } from "cookies-next";
import { FinancialCategory } from "@/interfaces/financial.interface";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const token = getCookie('access_token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://ordemdeservicosdev.onrender.com/api/finance/get-all-categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Erro ao carregar categorias.");
      }
    };

    fetchCategories();
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
                    <CardTitle className="text-[#3b82f6] text-2xl font-bold">Financeiro Categorias</CardTitle>
                    <CardDescription>Cheque todas as informações relacionadas ao financeiro.</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" className="bg-blue-500 hover:bg-blue-600">Adicionar categoria</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar categoria</DialogTitle>
                        <DialogDescription>
                          Adicione as informações para criar uma categoria!!
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Data de Criação</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="cursor-pointer">{category.name}</TableCell>
                      <TableCell className="cursor-pointer">{category.description || '-'}</TableCell>
                      <TableCell className="cursor-pointer">{new Date(category.createdAt).toLocaleDateString()}</TableCell>
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
