"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Bg from "../../../../../assets/bg.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader } from "lucide-react";
import { useHookFormMask } from "use-mask-input";
import { toast } from "react-toastify";
const BASE_URL = process.env.BASE_URL;
interface FormData {
	name: string;
	phone: string;
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
});

export default function Page() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});
	const registerWithMask = useHookFormMask(register);

	const params = useParams();
	const id = params.id;

	const onSubmit = async (data: FormData) => {
		try {
			const response = await fetch(`${BASE_URL}/user/create-user/${id}?type=employee`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: data.name,
					phone: data.phone,
				}),
			});

			if (!response.ok) {
				toast.error("Failed to create user");
				throw new Error("Failed to create user");
			} else {
				toast.success("Você foi cadastrado com sucesso!");
			}

			const result = await response.json();
		} catch (error) {
			console.error("Error creating user:", error);
		}
	};

	return (
		<div className="flex min-h-screen">
			<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
				<div className="flex items-center justify-center py-12">
					<div className="mx-auto grid w-[450px] gap-6">
						<div className="grid gap-2 text-center">
							<h1 className="text-3xl font-bold">Cadastro</h1>
							<p className="text-balance text-muted-foreground">Coloque suas informações para se cadastrar.</p>
						</div>
						<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
							<div className="grid gap-2 w-full">
								<Label htmlFor="name">Nome completo</Label>
								<Input id="name" {...register("name")} placeholder="Bruno" className={errors.name ? "border-red-500" : ""} />
								{errors.name && <span className="text-red-500">{errors.name.message}</span>}
							</div>
							<div className="grid gap-2">
								<Label htmlFor="phone">Telefone</Label>
								<Input
									id="phone"
									{...registerWithMask("phone", ["(99) 99999-9999"])}
									placeholder="(00) 00000-0000"
									className={errors.phone ? "border-red-500" : ""}
								/>
								{errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
							</div>
							<Button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center">
								{isSubmitting ? <Loader className="animate-spin" /> : "Cadastrar"}
							</Button>
						</form>
					</div>
				</div>
				<div className="hidden bg-muted lg:block">
					<Image src={Bg} alt="Image" width="1920" height="1080" className="h-full w-full object-cover dark:brightness-[0.2]" />
				</div>
			</div>
		</div>
	);
}
