"use client"
import Link from "next/link";
import Image from "next/image";
import Bg from '../assets/bg.jpg';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export default function Page() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
                <div className="flex items-center justify-center py-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid w-[450px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p className="text-balance text-muted-foreground">
                                Coloque suas informações e entre.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                    required
                                />
                                {errors.email && <span className="text-red-500">{errors.email.message?.toString()}</span>}

                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                    <Link
                                        href="#"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="********"
                                    {...register("password")}
                                    required
                                />
                                {errors.password && <span className="text-red-500">{errors.password.message?.toString()}</span>}

                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Não tem uma conta?{" "}
                            <Link href="/register" className="underline">
                                Cadastre-se
                            </Link>
                        </div>
                    </form>
                </div>
                <div className="hidden bg-muted lg:block">
                    <Image
                        src={Bg}
                        alt="Image"
                        width="1920"
                        height="1080"
                        className="h-full w-full object-cover dark:brightness-[0.2]"
                    />
                </div>
            </div>
        </div>
    );
}
