"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/container";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { FinancialCategoryItem, FinancialItem } from "@/interfaces/financial.interface";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import AddItemForm from "@/components/AddItem";
import { toast } from "react-toastify";
export default function CategoryDetailPage() {
  const [categoryItem, setCategoryItem] = useState<FinancialCategoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const params = useParams();
  const { id } = params; 

  const token = getCookie("access_token");

  const [isLoading, setIsLoading] = useState(false); 
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryItem = async () => {
      if (!id) {
        console.error("ID da categoria não fornecido.");
        setError("ID da categoria não fornecido.");
        return;
      }

      console.log(`Buscando dados para a categoria com ID: ${id}`);

      try {
        const response = await fetch(`https://ordemdeservicosdev.onrender.com/api/finance/get-category/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`Resposta da API: ${response.status}`);

        if (!response.ok) {
          throw new Error("Falha ao buscar detalhes da categoria.");
        }

        const data: FinancialCategoryItem = await response.json();
        console.log("Dados recebidos:", data);
        setCategoryItem(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes da categoria:", error);
        setError("Erro ao carregar detalhes da categoria.");
      }
    };

    fetchCategoryItem();
  }, [id, token]);

  const handleAddItem = async (item: Partial<FinancialItem>) => {
    const payload: Partial<FinancialItem> = {
      name: item.name,
      amountSpent: item.amountSpent,
      isRecurrent: item.isRecurrent || false,
      installments: item.isRecurrent ? item.installments : null,
      dueDate: item.isRecurrent ? item.dueDate : null,
    };
  
    setIsLoading(true);
    setError(null);
  
    toast.promise(
      fetch(`https://ordemdeservicosdev.onrender.com/api/finance/create-item/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Falha ao adicionar item.");
          }
          return response.json();
        })
        .then((addedItem: FinancialItem) => {
          setCategoryItem((prev) =>
            prev ? { ...prev, items: [...prev.items, addedItem] } : prev
          );
          setIsAddItemDialogOpen(false);
        })
        .catch((error) => {
          console.error("Erro ao adicionar item:", error);
          setError("Erro ao adicionar item.");
        }),
      {
        pending: "Adicionando item...",
        success: "Item adicionado com sucesso!",
        error: "Erro ao adicionar item.",
      }
    );
  
    setIsLoading(false);
  };

  if (error) {
    return (
      <Container>
        <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
          <p className="text-red-500">{error}</p>
        </main>
      </Container>
    );
  }

  if (!categoryItem) {
    return (
      <Container>
        <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
          <p>Carregando...</p>
        </main>
      </Container>
    );
  }

  const totalAmountSpent = categoryItem.items.reduce((sum: number, item: FinancialItem) => sum + item.amountSpent, 0);

  return (
    <Container>
      <main className="flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-[#3b82f6] text-2xl font-bold">
                  {categoryItem.name}
                </CardTitle>
                <CardDescription>
                  {categoryItem.description || "Sem descrição disponível"}
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
                    Editar categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar categoria</DialogTitle>
                    <DialogDescription>
                      Modifique as informações da categoria aqui.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <div className="p-4">
            <p><strong>Valor Total Gasto:</strong> R$ {totalAmountSpent.toFixed(2)}</p>
            <p><strong>Data de Criação:</strong> {new Date(categoryItem.createdAt).toLocaleDateString()}</p>
            <p><strong>Empresa:</strong> {categoryItem.company.companyName} (CNPJ: {categoryItem.company.cnpj})</p>
          </div>
        </Card>

        <Card className="mt-5">
          <CardHeader>
            <div className="w-full flex justify-between items-center">
                <CardTitle className="text-xl font-bold">Itens da Categoria</CardTitle>
                <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Item à Categoria</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo item.
              </DialogDescription>
            </DialogHeader>
            
            <AddItemForm onAdd={handleAddItem} isLoading={isLoading} />
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
                <TableCell>Valor Gasto</TableCell>
                <TableCell>Foto do Item</TableCell>
                <TableCell>Data de Criação</TableCell>
                <TableCell>Recorrente</TableCell>
                <TableCell>Parcelas</TableCell>
                <TableCell>Valor por Parcela</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryItem.items.map((item: FinancialItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description || '-'}</TableCell>
                  <TableCell>R$ {item.amountSpent ? item.amountSpent.toFixed(2) : '0.00'}</TableCell>
                  <TableCell>
                    {item.itemPhoto ? (
                      <img src={item.itemPhoto} alt={item.name} className="max-w-xs" />
                    ) : "Sem foto"}
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{item.isRecurrent ? "Sim" : "Não"}</TableCell>
                  <TableCell>{item.installments || '-'}</TableCell>
                  <TableCell>
                    {item.installmentValue ? `R$ ${item.installmentValue.toFixed(2)}` : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          
        </Card>
      </main>
    </Container>
  );
}
