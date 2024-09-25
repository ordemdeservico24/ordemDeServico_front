"use client";
import { useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { z } from "zod";
import { getCookie } from "cookies-next";

import { IStockItem, ISupplier } from "@/interfaces/stock.interface";

const stockItemSchema = z.object({
  productName: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
  unitOfMeasurement: z.string().min(1, "Unidade de medida é obrigatória"),
  productValue: z.number().min(0, "Valor deve ser maior ou igual a zero"),
  supplierId: z.string().uuid("ID do fornecedor inválido"),
});

const supplierSchema = z.object({
  name: z.string().min(1, "Nome do fornecedor é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Telefone inválido"),
});

export default function StoragePage() {
  const [items, setItems] = useState<IStockItem[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = getCookie('access_token');

  useEffect(() => {
    fetch("https://ordemdeservicosdev.onrender.com/api/storage/get-all-items", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
     .then((res) => res.json())
     .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
     .catch((error) => {
        console.error("Erro ao buscar os dados", error);
        setError("Erro ao carregar dados do estoque.");
        setIsLoading(false);
      });

    fetch("https://ordemdeservicosdev.onrender.com/api/storage/get-all-suppliers", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
     .then((res) => res.json())
     .then((data) => {
        setSuppliers(data);
      })
     .catch((error) => {
        console.error("Erro ao buscar os dados", error);
        setError("Erro ao carregar dados dos fornecedores.");
      });
  }, [token]);

  const onSubmitItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const getInput = (name: string): HTMLInputElement => {
      return e.currentTarget.querySelector(
        `[name="${name}"]`
      ) as HTMLInputElement;
    };

    const formData = {
      productName: getInput("productName").value || "",
      quantity: +getInput("quantity").value || 0,
      unitOfMeasurement: getInput("unitOfMeasurement").value || "",
      productValue: +getInput("productValue").value || 0,
      supplierId: getInput("supplierId").value || "",
    };

    const validation = stockItemSchema.safeParse(formData);

    if (!validation.success) {
      validation.error.errors.forEach((err) =>
        toast.error(err.message)
      );
      return;
    }

    toast.promise(
      fetch(
        "https://ordemdeservicosdev.onrender.com/api/storage/create-item",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )
       .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
       .then((data) => {
          setItems([...items, data]);
        })
       .catch((error) => {
          console.log(error);
        }),
      {
        pending: "Criando item",
        success: "Item criado com sucesso!",
        error: "Ocorreu um erro ao criar item",
      }
    );
  };

  const onSubmitSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const getInput = (name: string): HTMLInputElement => {
      return e.currentTarget.querySelector(
        `[name="${name}"]`
      ) as HTMLInputElement;
    };

    const formData = {
      id: 'some-id',
      name: getInput("name").value || "",
      email: getInput("email").value || "",
      phone: getInput("phone").value || "",
    };

    const validation = supplierSchema.safeParse(formData);

    if (!validation.success) {
      validation.error.errors.forEach((err) =>
        toast.error(err.message)
      );
      return;
    }

    toast.promise(
      fetch(
        "https://ordemdeservicosdev.onrender.com/api/storage/create-supplier",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )
       .then((res) => {
          if (res.ok) {
            return res.json();
          }
        })
       .then((data) => {
          setSuppliers([...suppliers, data]);
        })
       .catch((error) => {
          console.log(error);
        }),
      {
        pending: "Criando fornecedor",
        success: "Fornecedor criado com sucesso!",
        error: "Ocorreu um erro ao criar fornecedor",
      }
    );
  };

  function formatTotalMeasurement(item: IStockItem): string {
    let measurement = item.totalMeasurement;
  
    switch (item.unitOfMeasurement) {
      case "meter":
        return `${measurement} metros`;
      case "liter":
        return `${measurement} litros`;
      case "unit":
        return "-";
      default:
        return measurement.toString();
    }
  }

  return (
    <Container className="overflow-x-auto">
      <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
        <Tabs defaultValue="all">
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#3b82f6] text-2xl font-bold">Estoque</CardTitle>
                    <CardDescription>Cheque todas as informações relacionadas ao estoque.</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" className="bg-blue-500 hover:bg-blue-600">Adicionar Item</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
                          <DialogDescription>
                            Preencha os campos abaixo para adicionar um novo item ao estoque.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={onSubmitItem} className="flex flex-col justify-center items-center">
                          <div className="flex flex-col items-center max-w-96 w-full space-y-4">
                            <Input
                              type="text"
                              name="productName"
                              placeholder="Nome do produto"
                              required
                              className="w-full"
                            />
                            <Input
                              type="number"
                              name="quantity"
                              placeholder="Quantidade"
                              required
                              className="w-full"
                            />
                            <Input
                              type="text"
                              name="unitOfMeasurement"
                              placeholder="Unidade de Medida"
                              required
                              className="w-full"
                            />
                            <Input
                              type="number"
                              name="productValue"
                              placeholder="Valor"
                              required
                              className="w-full"
                            />
                            <Input
                              type="text"
                              name="supplierId"
                              placeholder="ID do Fornecedor"
                              required
                              className="w-full"
                            />
                            <Button
                              className="font-medium rounded my-4 px-12 py-2 hover:-translate-y-1 transition-all w-full bg-blue-500 hover:bg-blue-600"
                              type="submit"
                            >
                              Adicionar Item
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" className="bg-blue-500 hover:bg-blue-600">Adicionar Fornecedor</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Adicionar Fornecedor</DialogTitle>
                          <DialogDescription>
                            Preencha os campos abaixo para adicionar um novo fornecedor.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={onSubmitSupplier} className="flex flex-col justify-center items-center">
                          <div className="flex flex-col items-center max-w-96 w-full space-y-4">
                            <Input
                              type="text"
                              name="name"
                              placeholder="Nome do fornecedor"
                              required
                              className="w-full"
                            />
                            <Input
                              type="email"
                              name="email"
                              placeholder="E-mail"
                              required
                              className="w-full"
                            />
                            <Input
                              type="tel"
                              name="phone"
                              placeholder="Telefone"
                              required
                              className="w-full"
                            />
                            <Button
                              className="font-medium rounded my-4 px-12 py-2 hover:-translate-y-1 transition-all w-full bg-blue-500 hover:bg-blue-600"
                              type="submit"
                            >
                              Adicionar Fornecedor
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
              
                </div>
              </CardHeader>
              <div>
              <Table className="overflow-x-auto">
                  <TableHeader>
                    <TableRow>
                      <TableCell>Nome do Produto</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Total em Medida</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Fornecedor</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatTotalMeasurement(item)}</TableCell>
                        <TableCell>R$ {item.productValue.toFixed(2)}</TableCell>
                        <TableCell>{item.supplier?.name}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              </div>
            </Card>
      </TabsContent>

      <TabsContent value="suppliers">
        <Card>
          <CardHeader>
            <CardTitle>Fornecedores</CardTitle>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Nome do Fornecedor</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
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

