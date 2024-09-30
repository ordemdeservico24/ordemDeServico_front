"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
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
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const router = useRouter();
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

  const handleAddCategory = async () => {
    try {
      const response = await fetch("https://ordemdeservicosdev.onrender.com/api/finance/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory), 
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      const createdCategory = await response.json();
      setCategories((prevCategories) => [...prevCategories, createdCategory]); 
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error("Error creating category:", error);
      setError("Erro ao criar categoria.");
    }
  };

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
                      <div className="grid gap-4">
                        <input 
                          type="text" 
                          placeholder="Nome da Categoria" 
                          value={newCategory.name} 
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} 
                          className="border rounded p-2"
                        />
                        <textarea 
                          placeholder="Descrição" 
                          value={newCategory.description} 
                          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} 
                          className="border rounded p-2"
                        />
                        <Button onClick={handleAddCategory} className="bg-blue-500 hover:bg-blue-600">Criar Categoria</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
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
                      <TableRow key={category.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/financial/categories/${category.id}`)}>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description || '-'}</TableCell>
                        <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
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
