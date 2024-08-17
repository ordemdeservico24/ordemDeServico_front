"use client";
import React from "react";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"; // Importar componentes da Shadcn UI

interface OrderStatusProps {
    currentStatus: string;
    orderId: string;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({
    currentStatus,
    orderId,
}) => {
    const statuses = ["Aberto", "Em andamento", "Finalizado"];

    const filteredStatuses = statuses.filter(
        (status) => status !== currentStatus
    );

    const handleChange = async (value: string) => {
        toast.promise(
            fetch(
                `https://ordemdeservicosdev.onrender.com/api/order/update-status/${orderId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ orderStatus: value }),
                }
            )
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Falha ao atualizar status");
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log(data);
                }),
            {
                pending: "Atualizando status",
                success: "Status atualizado com sucesso",
                error: "Ocorreu um erro",
            }
        );
    };

    return (
        <div className="flex justify-end">
            <Select onValueChange={handleChange} defaultValue={currentStatus}>
                <SelectTrigger className="py-1 px-2 rounded text-sm bg-[#3b82f6] text-white">
                    {currentStatus}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={currentStatus} disabled>
                        {currentStatus}
                    </SelectItem>
                    {filteredStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
