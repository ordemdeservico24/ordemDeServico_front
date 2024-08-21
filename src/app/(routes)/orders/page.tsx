"use client"
import { Container } from "@/components/container";
import { EditDeleteOrder } from "@/components/editDeleteOrder";
import { OrderStatus } from "@/components/orderStatus";
import { IOrderGet } from "@/interfaces/order.interface";
import Link from "next/link";
import React, { useEffect, FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";
import { toast } from "react-toastify";
import { ISubject } from "@/interfaces/subject.interface";
import { Search } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
  const [orders, setOrders] = useState<IOrderGet[]>([]);
  const [subjects, setSubjects] = useState<ISubject[]>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://ordemdeservicosdev.onrender.com/api/order/get-all-orders", {
      method: "GET",
      headers: {
		"Content-type": "application/json",
		Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
	},
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError("Dados recebidos não são um array.");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);
  const truncateNotes = (notes: string, maxLength: number) => {
    if (notes.length > maxLength) {
      return notes.substring(0, maxLength) + "...";
    }
    return notes;
  };
  useEffect(() => {
    fetch(
      `https://ordemdeservicosdev.onrender.com/api/order/get-all-subjects/`,
      {
        method: "GET",
        headers: {
			"Content-type": "application/json",
			Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
		},
      }
    )
      .then((res) => {
        const status = res.status;
        return res.json().then((data) => ({ status, data }));
      })
      .then(({ status, data }) => {
        console.log(status, data);
        setSubjects(data);
      });
  }, []);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const getInput = (name: string): HTMLInputElement => {
      return e.currentTarget.querySelector(
        `[name="${name}"]`
      ) as HTMLInputElement;
    };

    const request: IRequest = {
      subjectId: getInput("subjectId").value || "",
      requesterName: getInput("requesterName").value || "",
      requesterPhone: getInput("requesterPhone").value || "",
      requesterStreet: getInput("requesterStreet").value || "",
      requesterHouseNumber: +getInput("requesterHouseNumber").value || 0,
      requesterComplement: getInput("requesterComplement").value || "",
      requesterZipcode: getInput("requesterZipcode").value || "",
      notes: getInput("notes").value || "",
    };

    toast.promise(
      fetch(
        "https://ordemdeservicosdev.onrender.com/api/order/create-order",
        {
          method: "POST",
          headers: {
			"Content-type": "application/json",
			Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiIxNTdhODg5MC1hYjBkLTQ1YWQtOTM2ZS0xYTg5ZjlmOWYzNTMiLCJyb2xlSWQiOiIzYThlMGEwMy03YWE0LTQ2MjktYWRlMS04ODE5YzdjYmMxOTYiLCJpYXQiOjE3MjQyNDMzNDd9.tB6DOfAN1TmILIvIdx6hYy2ENWOooCml6fFEeNmokGA`,
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
        pending: "Criando ordem",
        success: "Ordem criada com sucesso",
        error: "Ocorreu um erro",
      }
    );
  };

  	return (
	  	<Container>
			<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<div className="flex items-center">
						<TabsList>
							<TabsTrigger value="all">Todas</TabsTrigger>
							<TabsTrigger value="active">Aberto</TabsTrigger>
							<TabsTrigger value="draft">Em andamento</TabsTrigger>
							<TabsTrigger value="archived" className="hidden sm:flex">Finalizado</TabsTrigger>
						</TabsList>
						<div className="ml-auto flex items-center gap-2">
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="default" className="bg-blue-500 hover:bg-blue-600">Cadastrar OS</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Cadastrar Ordem de Serviço</DialogTitle>
										<DialogDescription>
											Adicione os dados abaixo e cadastre uma nova ordem de serviço.
										</DialogDescription>
									</DialogHeader>
									<form
										action="#"
										onSubmit={(e) => onSubmit(e)}
										className="flex flex-col gap-4"
									>
										<select
											name="subjectId"
											id="subjectId"
											className="border rounded px-2 py-2 mb-2"
											required
										>
											<option value="">Selecione uma categoria</option>
											{Array.isArray(subjects) ? (
											subjects.map((subject) => (
												<option value={subject.id} key={subject.id}>
												{subject.name} ({subject.expirationDays} dias de prazo)
												</option>
											))
											) : (
											<option value="">Nenhuma categoria encontrada</option>
											)}
										</select>
										<Input
											type="text"
											name="requesterName"
											placeholder="Nome do solicitante"
											required
										/>
										<Input
											type="tel"
											name="requesterPhone"
											placeholder="Telefone do solicitante"
											required
										/>
										<Input
											type="text"
											name="requesterStreet"
											placeholder="Endereço do solicitante"
											required
										/>
										<Input
											type="number"
											name="requesterHouseNumber"
											placeholder="N° da casa do solicitante"
											required
										/>
										<Input
											type="text"
											name="requesterComplement"
											placeholder="Complemento do solicitante"
											required
										/>
										<Input
											type="text"
											name="requesterZipcode"
											placeholder="CEP do solicitante"
											required
										/>
										<Textarea
											name="notes"
											placeholder="Observações"
											className="border rounded px-2 py-1 mb-4"
										/>
										<Button
											className="text-white font-medium rounded px-4 py-2 bg-blue-500 hover:bg-blue-600"
											type="submit"
										>
											Cadastrar
										</Button>
									</form>
								</DialogContent>
							</Dialog>
						</div>
					</div>
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Ordens de Serviço</CardTitle>
								<CardDescription>Cheque todas as ordens de serviços e dados relacionados a mesma.</CardDescription>
								<div className="relative flex-1 md:grow-0">
									<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										type="search"
										placeholder="Pesquisar..."
										className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
									/>
								</div>
							</CardHeader>

							<div className="p-6">
							{error && <p className="text-red-500">{error}</p>}
								{Array.isArray(orders) && orders.length > 0 ? (
									<div className="grid grid-cols-1 w-full sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{orders.map((order) => (
										<div
										key={order.id}
										className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
										>
										<Link href={`/orders/order/${order.id}`}>
											<h2 className="text-lg font-semibold mb-2">
											Ordem de Serviço - {order.orderId}
											</h2>
										</Link>
										<p className="text-gray-600 mb-2">
											Data de abertura: {order.openningDate}
										</p>
										<p className="text-gray-800 mb-2">
											{truncateNotes(order.notes, 100)}
										</p>
										<div className="flex justify-between items-center">
											<OrderStatus
											currentStatus={order.orderStatus}
											orderId={order.id}
											/>
											<EditDeleteOrder orderId={order.id} />
										</div>
										</div>
									))}
									</div>
									) : (
									<p>Nenhuma ordem encontrada.</p>
								)}
							</div> 
						</Card>
					</TabsContent>
				</Tabs>
			</main>
    </Container>
  );
}
