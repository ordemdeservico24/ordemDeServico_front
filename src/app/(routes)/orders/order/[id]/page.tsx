"use client";
import { AssignedTeam } from "@/components/assignedTeam";
import { Container } from "@/components/container";
import { OrderStatus } from "@/components/orderStatus";
import { IOrderGet } from "@/interfaces/order.interface";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function Page({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<IOrderGet>();

    useEffect(() => {
        fetch(
            `https://ordemdeservicosdev.onrender.com/api/order/get-order/${params.id}`,
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
                setOrder(data);
            });
    }, [params.id]);

    return (
        <Container>
            {order ? (
                <Card className="mt-4 py-4 px-6 rounded">
                    <CardHeader>
                        <Link
                            href="/orders"
                            className=" text-white font-medium rounded mb-2 hover:-translate-y-1 transition-all w-fit inline-block"
						>
							<Button>Voltar</Button>
                            
                        </Link>
                        <div className="flex justify-between items-center mb-8 mt-4">
                            <h1 className="font-semibold text-xl">
                                Ordem de Serviço - {order.orderId}
                            </h1>
                            <p className="text-[#84818A] text-xs">
                                Data de abertura: {order.openningDate}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h2 className="font-medium text-xl mb-4">
                            {order.subject.name}
                        </h2>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-[#84818A] text-sm">
                                {order.notes}
                            </p>
                            <OrderStatus
                                currentStatus={order.orderStatus}
                                orderId={order.id}
                            />
                        </div>
                        <div className="flex flex-col gap-4 py-4 border-b-2">
                            <h3 className="text-lg font-medium mb-2">
                                Dados do solicitante
                            </h3>
                            <div className="flex flex-wrap gap-x-16 gap-y-4">
                                <p>
                                    <strong>Nome: </strong>
                                    {order.requesterName}
                                </p>
                                <p>
                                    <strong>Endereço: </strong>
                                    {order.requesterStreet}
                                </p>
                                <p>
                                    <strong>N°: </strong>
                                    {order.requesterHouseNumber}
                                </p>
                                <p>
                                    <strong>Complemento: </strong>
                                    {order.requesterComplement}
                                </p>
                                <p>
                                    <strong>Telefone/celular: </strong>
                                    {order.requesterPhone}
                                </p>
                                <p>
                                    <strong>CEP:</strong> {order.requesterZipcode}
                                </p>
                            </div>
                        </div>
                        <AssignedTeam
                            assignedTeam={order.assignedTeam}
                            orderId={order.id}
                        />
                    </CardContent>
                </Card>
            ) : (
                <h1>Não há ordem de serviço com este id</h1>
            )}
        </Container>
    );
}
