"use client"
import Link from "next/link";
import Image from "next/image";
import Bg from '../../../assets/bg.jpg';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
    firstName: z
        .string()
        .min(2, "O nome deve ter pelo menos 2 caracteres.")
        .max(30, "O nome pode ter no máximo 30 caracteres.")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "O nome deve conter apenas letras."),
    lastName: z
        .string()
        .min(2, "O sobrenome deve ter pelo menos 2 caracteres.")
        .max(30, "O sobrenome pode ter no máximo 30 caracteres.")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "O sobrenome deve conter apenas letras."),
    telephone: z
        .string()
        .min(10, "O telefone deve ter pelo menos 10 caracteres.")
        .max(15, "O telefone pode ter no máximo 15 caracteres.")
        .regex(/^\+?\d{10,15}$/, "O telefone deve estar no formato correto."),
    email: z
        .string()
        .email("O e-mail deve ser válido.")
        .max(100, "O e-mail pode ter no máximo 100 caracteres."),
    password: z
        .string()
        .min(7, "A senha deve ter pelo menos 7 caracteres.")
        .max(20, "A senha pode ter no máximo 20 caracteres.")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número.")
        .regex(/[@$!%*?&#]/, "A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, & ou #)."),
    confirmPassword: z
        .string()
        .min(8, "A confirmação de senha deve ter pelo menos 8 caracteres."),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});


export default function Page() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[450px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Cadastro</h1>
                            <p className="text-balance text-muted-foreground">
                                Coloque suas informações para se cadastrar.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">Nome</Label>
                                    <Input id="first-name" {...register("firstName")} placeholder="Bruno" required />
                                    {errors.firstName && <span className="text-red-500">{errors.firstName.message?.toString()}</span>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Sobrenome</Label>
                                    <Input id="last-name" {...register("lastName")} placeholder="Almeida" required />
                                    {errors.lastName && <span className="text-red-500">{errors.lastName.message?.toString()}</span>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="telephone">Telefone</Label>
                                <Input id="telephone" {...register("telephone")} type="tel" placeholder="+55 (00) 00000-0000" required />
                                {errors.telephone && <span className="text-red-500">{errors.telephone.message?.toString()}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" {...register("email")} type="email" placeholder="seuemail@example.com" required />
                                {errors.email && <span className="text-red-500">{errors.email.message?.toString()}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input id="password" {...register("password")} type="password" placeholder="********" required />
                                {errors.password && <span className="text-red-500">{errors.password.message?.toString()}</span>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirmar senha</Label>
                                <Input id="confirm-password" {...register("confirmPassword")} type="password" placeholder="********" required />
                                {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message?.toString()}</span>}
                            </div>
                            <Button type="submit" className="w-full">
                                Criar a conta
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Já possui uma conta?{" "}
                            <Link href="/" className="underline">
                                Entrar
                            </Link>
                        </div>
                    </div>
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
