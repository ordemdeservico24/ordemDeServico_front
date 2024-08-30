"use client";
import { Container } from "@/components/container";
import { IUser } from "@/interfaces/user.interface";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import Link from "next/link";

export default function UserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<IUser>();
  const token = getCookie("access_token");

  useEffect(() => {
    fetch(
      `https://ordemdeservicosdev.onrender.com/api/user/get-user/${params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [params.id, token]);

  return (
      <Container className="p-4">
          <main className="grid flex-1 items-start gap-4 sm:px-6 sm:py-0 md:gap-8">
            {user ? (
                <Card className="shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                <CardHeader className="bg-black text-white p-4 flex justify-between items-center">
                    <Link href="/users">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded">
                        Voltar
                    </Button>
                    </Link>
                    <h1 className="text-2xl font-semibold">
                    Usuário - {user.name}
                    </h1>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="border-b border-gray-300 pb-4 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Dados do Usuário</h2>
                    <div className="space-y-2">
                        <p className="text-gray-700">
                        <strong className="font-medium">Nome:</strong> {user.name}
                        </p>
                        <p className="text-gray-700">
                        <strong className="font-medium">Email:</strong> {user.email}
                        </p>
                        <p className="text-gray-700">
                        <strong className="font-medium">Telefone:</strong> {user.phone}
                        </p>
                        <p className="text-gray-700">
                        <strong className="font-medium">Cargo:</strong> {user.role?.roleName}
                        </p>
                    </div>
                    </div>
                </CardContent>
                </Card>
            ) : (
                <div className="text-center mt-10">
                <h1 className="text-xl font-bold text-gray-700">Não há usuário com este id</h1>
                </div>
            )}
        </main>
    </Container>
  );
}
