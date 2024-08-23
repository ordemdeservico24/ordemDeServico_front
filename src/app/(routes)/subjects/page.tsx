"use client";
import { Container } from "@/components/container";
import { ISubject } from "@/interfaces/subject.interface";
import React, { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function Page() {
  const [subjects, setSubjects] = useState<ISubject[]>([]);

  useEffect(() => {
    fetch("https://ordemdeservicosdev.onrender.com/api/order/get-all-subjects", {
		method: "GET",
		headers: {
			"Content-type": "application/json",
			Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiIxNTdhODg5MC1hYjBkLTQ1YWQtOTM2ZS0xYTg5ZjlmOWYzNTMiLCJyb2xlSWQiOiIzYThlMGEwMy03YWE0LTQ2MjktYWRlMS04ODE5YzdjYmMxOTYiLCJpYXQiOjE3MjQyNDMzNDd9.tB6DOfAN1TmILIvIdx6hYy2ENWOooCml6fFEeNmokGA`,
		},
    })
      .then((res) => {
        const status = res.status;
        return res.json().then((data) => ({ status, data }));
      })
      .then(({ status, data }) => {
        console.log(status, data);
        setSubjects(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados", error);
      });
  }, []);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
	e.preventDefault();

	const getInput = (name: string): HTMLInputElement => {
		return e.currentTarget.querySelector(
			`[name="${name}"]`
		) as HTMLInputElement;
	};

	const request: ISubject = {
		name: getInput("name").value || "",
		expirationDays: +getInput("expirationDays").value || 0,
	};

	toast.promise(
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/order/create-subject",
			{
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
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
			pending: "Criando categoria",
			success: "Categoria criada com sucesso!",
			error: "Ocorreu um erro ao criar categoria",
		}
	);
	};

  return (
	  <Container className="overflow-x-auto">
		  	<main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Categorias</CardTitle>
								<CardDescription>Cheque todas as informações relacionado as categorias apresentadas.</CardDescription>
							  <div className="flex items-center gap-3 justify-between">
								  
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
					<DialogTitle>Criar categoria</DialogTitle>
					<DialogDescription>
						Adicione uma nova categoria e seu prazo nos campos abaixo.
					</DialogDescription>
					</DialogHeader>
					<form
					action="#"
					onSubmit={(e) => onSubmit(e)}
					className="flex flex-col justify-center items-center">
						<div className="flex flex-col items-center max-w-96 w-full">
								<Input
									type="text"
									name="name"
									placeholder="Nome da categoria"
									className="w-full my-2"
								/>
								<Input
									type="number"
									name="expirationDays"
									placeholder="Dias de prazo"
									className="w-full"
								/>
								<Button
									className=" font-medium rounded my-4 px-12 py-2 hover:-translate-y-1 transition-all w-full bg-blue-500 hover:bg-blue-600"
									type="submit">Criar</Button>
							</div>
					</form>	
				</DialogContent>
									</Dialog>
								</div>
							</CardHeader>
						  	<div className="p-3">
								<Table>
									<TableHeader>
									<TableRow>
										<TableHead>Nome da categoria</TableHead>
										<TableHead>Dias para resolução</TableHead>
										<TableHead>Ordens atribuídas</TableHead>
									</TableRow>
									</TableHeader>
									<TableBody>
									{Array.isArray(subjects) && subjects.map((subject, index) => (
										<TableRow key={index} className="cursor-pointer hover:bg-gray-100">
										<TableCell>{subject.name}</TableCell>
										<TableCell>{subject.expirationDays}</TableCell>
										<TableCell>{subject.orders?.length}</TableCell>
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
