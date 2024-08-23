"use client";
import Link from "next/link";
import Image from "next/image";
import Bg from "../../../../assets/bg.jpg";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStore } from "../../../../zustandStore";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import { useState } from "react";
import { useHookFormMask } from 'use-mask-input';
import { toast } from "react-toastify";
interface FormData {
	name: string;
	phone: string;
	email: string;
	password: string;
	confirmPassword: string;
}

const schema = z.object({
	name: z
		.string()
		.min(3, "O nome deve ter pelo menos 3 caracteres")
		.max(50, "O nome pode ter no máximo 50 caracteres")
		.regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nome inválido. Use apenas letras e espaços")
		.nonempty("Nome é obrigatório"),
	phone: z
		.string()
		.min(3, "O nome deve ter pelo menos 3 caracteres")
		.max(50, "O nome pode ter no máximo 50 caracteres")
		.nonempty("Telefone é obrigatório"),
	email: z
		.string()
		.email("Email inválido")
		.nonempty("Email é obrigatório"),
	password: z
		.string()
		.min(7, "A senha deve ter no mínimo 7 caracteres")
		.max(16, "A senha pode ter no máximo 16 caracteres")
		.nonempty("Senha é obrigatória")
		.regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula")
		.regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula")
		.regex(/\d/, "A senha deve ter pelo menos um número")
		.regex(/[@$!%*?&#]/, "A senha deve ter pelo menos um caractere especial (@$!%*?&#)"),
	confirmPassword: z
		.string()
		.nonempty("Senha é obrigatória")
}).refine((data) => data.password === data.confirmPassword, {
	message: "As senhas não coincidem",
	path: ["confirmPassword"],
});


export default function Page() {

	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
		resolver: zodResolver(schema),
	});
	
	const registerWithMask = useHookFormMask(register);

    const params = useParams();
    const id = params.id;

	const setUser = useStore((state) => state.setUser);
	const onSubmit = async (data: FormData) => {
		try {
			const response = await fetch(
				`https://ordemdeservicosdev.onrender.com/api/user/create-user/${id}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: data.name,
						phone: data.phone,
						email: data.email,
						password: data.password,
					}),
				}
			);

			if (!response.ok) {
				toast.error("Failed to create user");
				throw new Error("Failed to create user");
			} else {
				toast.success("User created successfully");
			}

			const result = await response.json();

			setUser({
				name: data.name,
				profilePicture: result.profilePicture,
				token: result.token,
            });

            console.log("User created:", result);
		} catch (error) {
			console.error("Error creating user:", error);
		}
    };
    
    const [isPasswordVisible, setIsPasswordVisibile] = useState(false);

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
							<div className="grid gap-2 w-full">
								<Label htmlFor="name">Nome completo</Label>
								<Input
									id="name"
									{...register("name")}
									placeholder="Bruno"
									className={errors.name ? "border-red-500" : ""}
								/>
								{errors.name && <span className="text-red-500">{errors.name.message}</span>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="phone">Telefone</Label>
								<Input
									id="phone"
									{...registerWithMask("phone", ['(99) 99999-9999'])}
									placeholder="(00) 00000-0000"
									className={errors.phone ? "border-red-500" : ""}
								/>
								{errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									{...register("email")}
									placeholder="seuemail@example.com"
									className={errors.email ? "border-red-500" : ""}
								/>
								{errors.email && <span className="text-red-500">{errors.email.message}</span>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={isPasswordVisible ? "text" : "password"}
                                        {...register("password")}
                                        placeholder="********"
                                        className={errors.password ? "border-red-500" : ""}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 ">
                                        <button type="button" onClick={() => setIsPasswordVisibile(!isPasswordVisible)}>
                                            { isPasswordVisible ? <EyeIcon size={20} className="text-slate-600 cursor-pointer" /> : <EyeOffIcon size={20} className="text-slate-600 cursor-pointer" /> }
                                        </button>
                                    </span>
                                </div>
								{errors.password && <span className="text-red-500">{errors.password.message}</span>}
							</div>
							<div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={isPasswordVisible ? "text" : "password"}
                                        {...register("confirmPassword")}
                                        placeholder="********"
                                        className={errors.confirmPassword ? "border-red-500" : ""}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 ">
                                        <button type="button" onClick={() => setIsPasswordVisibile(!isPasswordVisible)}>
                                            { isPasswordVisible ? <EyeIcon size={20} className="text-slate-600 cursor-pointer" /> : <EyeOffIcon size={20} className="text-slate-600 cursor-pointer" /> }
                                        </button>
                                    </span>
                                </div>
								{errors.confirmPassword && (
									<span className="text-red-500">{errors.confirmPassword.message}</span>
								)}
							</div>
							<Button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center">
								{isSubmitting
									?
								<Loader className="animate-spin" />
									:
								("Criar a conta")}
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
