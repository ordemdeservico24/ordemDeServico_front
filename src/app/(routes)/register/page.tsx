import Link from "next/link";
import Image from "next/image"
import Bg from '../../../assets/bg.jpg'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Page() {
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
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                            <Label htmlFor="first-name">Nome</Label>
                            <Input id="first-name" placeholder="Bruno" required />
                            </div>
                            <div className="grid gap-2">
                            <Label htmlFor="last-name">Sobrenome</Label>
                            <Input id="last-name" placeholder="Almeida" required />
                            </div>
                            </div>
                                <div className="grid gap-2">
                                <Label htmlFor="telephone">Telefone</Label>
                                <Input
                                id="telephone"
                                type="tel"
                                placeholder="+55 (00) 00000-0000"
                                required
                                />
                            </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            placeholder="seuemail@example.com"
                            required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" />
                            </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Confirmar senha</Label>
                            <Input id="password" type="password" />
                        </div>
                        <Button type="submit" className="w-full">
                            Criar a conta
                        </Button>
                        </div>
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
