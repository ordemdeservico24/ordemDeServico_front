"use client";
import { Container } from "@/components/container";
import { ITeam } from "@/interfaces/team.interfaces";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button";
import Image from "next/image"
import ImageProfile from '../../../../assets/profile.png'


export default function Page({ params }: { params: { id: string } }) {
    const [team, setTeam] = useState<ITeam>();

    useEffect(() => {
        fetch(
            `https://ordemdeservicosdev.onrender.com/api/team/get-team/${params.id}`,
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
                setTeam(data);
            });
    }, [params.id]);
    const truncateNotes = (notes: string, maxLength: number) => {
        if (notes.length > maxLength) {
            return notes.substring(0, maxLength) + "...";
        }
        return notes;
    };
    const formattedDates = (date: Date) => {
        return new Date(date).toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
        });
    };

    return (
        <Container>

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
								<CardTitle className="text-[#3b82f6] text-2xl font-bold">Ordens Atribuídas</CardTitle>
								<CardDescription>Cheque todas as informações relacionado aos líderes apresentados.</CardDescription>
                            </CardHeader>

                            <div className="flex px-3 gap-2 sm:gap-4 mt-4 flex-wrap">
                                {team?.orders.map((order, index) => (
                                    <Link
                                        className="bg-primary text-white bg-[#3b82f6] p-4 rounded flex flex-col justify-between gap-2 w-[250px] sm:max-w-sm"
                                        key={index}
                                        href={`/orders/order/${order.id}`}
                                    >
                                        <div className="flex flex-col gap-2">
                                            <p className="font-semibold text-sm sm:text-base">
                                                {order.subject.name}
                                            </p>
                                            <p className="text-xs sm:text-sm">
                                                {truncateNotes(order.notes, 100)}
                                            </p>
                                        </div>
                                        <p className="border-t border-white text-xs sm:text-sm pt-2 text-right">
                                            {formattedDates(order.openningDate)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                            
                            <div className="px-3 mt-5">
                                <p>Membros na equipe: ({team?.members.length})</p>
                                <Table className="mt-4 min-w-full bg-white rounded-xl divide-y divide-gray-200">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Profissão</TableHead>
                                            <TableHead>Telefone</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {team?.members.map((member, index) => (
                                            <TableRow
                                                key={index}
                                                className="cursor-pointer hover:bg-gray-100"
                                            >
                                                <TableCell>
                                                    <p>{member.memberName}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p>{member.memberRole}</p>
                                                </TableCell>
                                                <TableCell>
                                                    <p>{member.memberPhone}</p>
                                                </TableCell>
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
