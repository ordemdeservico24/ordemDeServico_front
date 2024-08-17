"use client";
import { Container } from "@/components/container";
import { ITeamLeader } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ICreateLeader } from "@/interfaces/create-leader-request/createLeader.interface";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import Image from "next/image"
import ImageProfile from '../../../../assets/profile.png'

export default function Page() {
  const [leaders, setLeaders] = useState<ITeamLeader[]>([]);

  useEffect(() => {
    fetch("https://ordemdeservicosdev.onrender.com/api/team/get-all-leaders", {
		method: "GET",
		headers: {
			"Content-type": "application/json",
			Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiR3VpbGhlcm1lIiwiaWQiOiJiZWU1MGU4Yy04ZmU0LTQ0NTYtYjgzZS1hZTk5MjBhNjlmMmIiLCJyb2xlSWQiOiIyNzhmNGNlOS0xNGY2LTQxNmQtYWRkZi1kMzJmNWFmNzI0MWYiLCJpYXQiOjE3MjM3NzYwOTV9.CJIubrQDHJSEHa6TgzcG1_2_rkls_V2fEXXUNvo6gAc`,
		},
    })
      .then((res) => {
        const status = res.status;
        return res.json().then((data) => ({ status, data }));
      })
      .then(({ status, data }) => {
        console.log(status, data);
        if (Array.isArray(data)) {
          setLeaders(data);
        } else {
          console.error("Unexpected data format:", data);
          setLeaders([]);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setLeaders([]);
      });
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
	e.preventDefault();

	const getInput = (name: string): HTMLInputElement => {
		return e.currentTarget.querySelector(
			`[name="${name}"]`
		) as HTMLInputElement;
	};

	const request: ICreateLeader = {
		name: getInput("name").value || "",
		email: getInput("email").value || "",
		phone: getInput("phone").value || "",
		role: getInput("role").value || "",
	};

	toast.promise(
		fetch(
			"https://ordemdeservicosdev.onrender.com/api/team/create-leader",
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
			pending: "Criando líder de equipe",
			success: "Líder de equipe criado com sucesso!",
			error: "Ocorreu um erro ao criar líder de equipe",
		}
	);
};

  return (
	  <Container className="p-4">
		  <header className="z-30 flex justify-start items-start border-b flex-col md:flex-row md:justify-between md:items-center gap-2 bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          		<Breadcrumb className="md:flex">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
							<Link href="/home">Dashboard</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
					  <BreadcrumbSeparator />
					  <BreadcrumbItem>
							<BreadcrumbLink asChild>
							<Link href="/teams">Equipes</Link>
							</BreadcrumbLink>
					  </BreadcrumbItem>
					  <BreadcrumbSeparator />
						<BreadcrumbItem>
							<BreadcrumbPage>Líderes</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
			  	</Breadcrumb>
			  	<div className="flex flex-row-reverse md:flex-row items-center gap-3 pb-3">
				  	<h1>Débora Almeida</h1>
				  	<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="overflow-hidden rounded-full"
							>
								<Image
									src={ImageProfile}
									width={36}
									height={36}
									alt="Avatar"
									className="overflow-hidden rounded-full"
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Minha conta</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Configurações</DropdownMenuItem>
							<DropdownMenuItem>Suporte</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Sair</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
			  	</div>
		  </header>

		  <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
				<Tabs defaultValue="all">
					<TabsContent value="all">
						<Card x-chunk="dashboard-06-chunk-0">
							<CardHeader>
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Líderes</CardTitle>
								<CardDescription>Cheque todas as informações relacionado aos líderes apresentados.</CardDescription>
							  <div className="flex items-center justify-between">
								  
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
					<DialogTitle>Adicionar líder</DialogTitle>
					<DialogDescription>
						Adicione as informações do líder.
					</DialogDescription>
					</DialogHeader>
					<form
					action="#"
					onSubmit={(e) => onSubmit(e)}
					className="flex flex-col justify-center items-center"
				>
					<div className="flex flex-col gap-3 items-center max-w-96 w-full">
						<Input
							type="text"
							name="name"
							placeholder="Nome do líder"
							className="w-full"
						/>
						<Input
							type="email"
							name="email"
							placeholder="E-mail"
							className="w-full"
						/>
						<Input
							type="tel"
							name="phone"
							placeholder="Telefone"
							className="w-full"
						/>
						<Input
							type="text"
							name="role"
							placeholder="Profissão"
							className="w-full"
						/>
						<Button
							className=" text-white bg-blue-500 hover:bg-blue-600 font-medium rounded px-12 py-2 hover:-translate-y-1 transition-all w-full"
							type="submit"
						>
							Criar
						</Button>
					</div>
				</form>
				</DialogContent>
									</Dialog>
								</div>
						  </CardHeader>
						  
						  <div className="p-3">
						  <Table className="w-full bg-white shadow-md rounded-lg overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">Nome</TableHead>
            <TableHead className="font-bold">E-mail</TableHead>
            <TableHead className="font-bold">Telefone</TableHead>
            <TableHead className="font-bold">Profissão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaders.map((leader, index) => (
            <TableRow key={index} className="hover:bg-gray-100 cursor-pointer">
              <TableCell>{leader.name}</TableCell>
              <TableCell>{leader.email}</TableCell>
              <TableCell>{leader.phone}</TableCell>
              <TableCell>{leader.role}</TableCell>
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
