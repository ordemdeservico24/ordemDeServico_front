import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, Bounce } from "react-toastify";
import { getCookie } from 'cookies-next';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/input";
import { OrderSubjectSelect } from "@/components/orderSubjectSelect";
import { IRequest } from "@/interfaces/create-order-request/create-order-request.interface";
import { IOrderGet } from "@/interfaces/order.interface";

interface OrderID {
  orderId: string;
}

export const EditDeleteOrder: React.FC<OrderID> = ({ orderId }) => {
  const [isClient, setIsClient] = useState(false);
  const [order, setOrder] = useState<IOrderGet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const token = getCookie('access_token');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (orderId) {
      fetch(
        `https://ordemdeservicosdev.onrender.com/api/order/get-order/${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setOrder(data))
        .catch((err) => console.error("Failed to fetch order:", err));
    }
  }, [orderId, token]);

  const handleDelete = async () => {
    await fetch(
      `https://ordemdeservicosdev.onrender.com/api/order/delete-order/${orderId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
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
      .then(() => {
        toast.success("Ordem deletada com sucesso!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClose: () => window.location.reload(),
        });
      })
      .catch(() => {
        toast.error("Erro ao deletar ordem.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const getInput = (name: string): HTMLInputElement => {
      return e.currentTarget.querySelector(`[name="${name}"]`) as HTMLInputElement;
    };

    const request: IRequest = {
      subjectId: getInput("subjectId").value || "",
      requesterName: getInput("requesterName").value || "",
      requesterPhone: getInput("requesterPhone").value || "",
      requesterStreet: getInput("requesterStreet").value || "",
      requesterHouseNumber: +getInput("requesterHouseNumber").value || 0,
      requesterComplement: getInput("requesterComplement").value || "",
      requesterZipcode: getInput("requesterZipcode").value || "",
      notes: getInput("notes").value || "",
    };

    toast.promise(
      fetch(
        `https://ordemdeservicosdev.onrender.com/api/order/edit-order/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
        }
      )
        .then((res) => res.json())
        .then(() => {
          toast.success("Ordem editada com sucesso", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          setIsEditing(false);
        }),
      {
        pending: "Editando ordem",
        success: "Ordem editada com sucesso",
        error: "Ocorreu um erro",
      }
    );
  };

  return (
    <div className="flex gap-2 items-center">
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <FaEdit
            className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
            size={20}
            title="Editar ordem"
            onClick={() => setIsEditing(true)}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogDescription>Editar Ordem</DialogDescription>
          </DialogHeader>
          {order && (
            <form onSubmit={onSubmit} className="flex flex-col space-y-4">
              <label htmlFor="subjectId">Categoria:</label>
              <OrderSubjectSelect
                name="subjectId"
                id={order.subject.id}
                expirationDays={order.subject.expirationDays}
                value={order.subject.id}
              />
              <Input
                type="text"
                name="requesterName"
                placeholder="Nome do solicitante"
                value={order.requesterName}
              />
              <Input
                type="tel"
                name="requesterPhone"
                placeholder="Telefone do solicitante"
                value={order.requesterPhone}
              />
              <Input
                type="text"
                name="requesterZipcode"
                placeholder="CEP do solicitante"
                value={order.requesterZipcode}
              />
              <Input
                type="text"
                name="requesterStreet"
                placeholder="Endereço do solicitante"
                value={order.requesterStreet}
              />
              <Input
                type="number"
                name="requesterHouseNumber"
                placeholder="N° da casa do solicitante"
                value={`${order.requesterHouseNumber}`}
              />
              <Input
                type="text"
                name="requesterComplement"
                placeholder="Complemento do solicitante"
                value={order.requesterComplement}
              />
              <Input
                textArea={true}
                name="notes"
                placeholder="Observações"
                value={order.notes}
              />
              <DialogFooter>
                <Button type="submit">Salvar</Button>
                <Button type="button" onClick={() => setIsEditing(false)}>Cancelar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* <Link href={`/orders/order/edit/${orderId}`}>
        <FaEdit
          className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
          size={20}
          title="Editar ordem"
        />
      </Link> */}

      {isClient && (
        <Dialog>
          <DialogTrigger asChild>
            <FaTrash
              className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200"
              size={20}
              title="Excluir ordem"
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogDescription>
                Tem certeza que deseja deletar esta ordem?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit" onClick={handleDelete}>
                Deletar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
