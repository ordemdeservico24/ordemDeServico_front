"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { IOrderStatus } from "@/interfaces/order.interface";
import { IStockItem } from "@/interfaces/stock.interface";

interface OrderStatusProps {
  currentStatus: string;
  orderId: string;
  statuses: IOrderStatus[];
}
interface IUsedItem {
  itemId: string;
  itemName: string;
  usedQuantity?: number;
  usedMeasurement?: number;
  unitOfMeasurement: string;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ currentStatus, orderId, statuses }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<IOrderStatus | null>(null);
  const [tempStatus, setTempStatus] = useState<string>(currentStatus);
  const [photo, setPhoto] = useState<File | null>(null);
  const [items, setItems] = useState<IStockItem[]>([]);
  const [usedItems, setUsedItems] = useState<IUsedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const token = getCookie("access_token");

  useEffect(() => {
    if (isModalOpen) {
      fetchItems();
    }
  }, [isModalOpen]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://ordemdeservicosdev.onrender.com/api/storage/get-all-items", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Falha ao buscar itens do estoque");
      }
      const data = await response.json();
      console.log("Items fetched:", data);
      setItems(data);
    } catch (error) {
      toast.error("Erro ao carregar itens do estoque");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    const status = statuses.find((status) => status.id === value);
    if (status?.review) {
      setSelectedStatus(status);
      setIsModalOpen(true);
      setTempStatus(currentStatus);
    } else {
      updateOrderStatus(value);
    }
  };

  const prepareUsedItems = (items: IUsedItem[]): IUsedItem[] => {
    return items.map(item => ({
      itemId: item.itemId,
      itemName: item.itemName,
      usedQuantity: item.unitOfMeasurement === "unit" ? item.usedQuantity : item.usedMeasurement,
      unitOfMeasurement: item.unitOfMeasurement
    }));
  };

  const updateOrderStatus = async (value: string) => {
    const formData = new FormData();
    formData.append("orderStatusId", value);
    if (photo) {
      formData.append("orderFinishPhoto", photo);
    }
    
    const preparedUsedItems = prepareUsedItems(usedItems);
    formData.append("usedItems", JSON.stringify(preparedUsedItems));

    toast.promise(
      fetch(`https://ordemdeservicosdev.onrender.com/api/order/update-status/${orderId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
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
        success: {
          render: "Status atualizado com sucesso",
          onClose: () => {
            window.location.reload();
          },
          autoClose: 1500,
        },
        error: "Ocorreu um erro",
      }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleItemSelection = (itemId: string, itemName: string, usedQuantity: number) => {
    const item = items.find((item) => item.id === itemId);
    if (item && usedQuantity <= item.quantity - item.usedQuantity) {
      setUsedItems((prev) => {
        const itemIndex = prev.findIndex((usedItem) => usedItem.itemId === itemId);
        if (itemIndex > -1) {
          const updatedItems = [...prev];
          updatedItems[itemIndex].usedQuantity = usedQuantity;
          return updatedItems;
        } else {
          return [...prev, { 
            itemId, 
            itemName, 
            usedQuantity, 
            unitOfMeasurement: item.unitOfMeasurement 
          }];
        }
      });
    } else {
      toast.error("Quantidade inválida ou maior do que a disponível no estoque.");
    }
  };

  const handleAddItem = (itemId: string, itemName: string, quantityInputRef: React.RefObject<HTMLInputElement>) => {
    const usedQuantity = Math.max(quantityInputRef.current?.valueAsNumber || 0, 0);
    handleItemSelection(itemId, itemName, usedQuantity);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStatus(null);
    setTempStatus(currentStatus);
  };

  const handleConfirmReview = () => {
    if (selectedStatus && photo) {
      updateOrderStatus(selectedStatus.id);
      setIsModalOpen(false);
      setSelectedStatus(null);
    } else {
      toast.error("É obrigatório enviar uma foto para revisar a ordem");
    }
  };

  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex justify-end">
      <Select onValueChange={handleChange} value={tempStatus}>
        <SelectTrigger className="py-1 px-2 rounded text-sm bg-[#3b82f6] text-white">{tempStatus}</SelectTrigger>
        <SelectContent>
          <SelectItem value={currentStatus} disabled>
            {currentStatus}
          </SelectItem>
          {statuses
            .filter((status) => status.id !== currentStatus)
            .map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.orderStatusName}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Revisar Ordem</DialogTitle>
            <DialogDescription>Por favor, revise as informações antes de confirmar a mudança de status.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Foto</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handlePhotoChange} required />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="search">Buscar Itens do Estoque</Label>
              <Input id="search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center">
              <svg
                className="h-8 w-8 animate-spin text-gray-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            ) : (
              <div className="max-h-60 overflow-y-auto">
                {filteredItems.map((item) => {
                  const quantityInputRef = React.createRef<HTMLInputElement>();
                  return (
                    <div key={item.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        id={`item-${item.id}`}
                        onChange={(e) => {
                          if (!e.target.checked) {
                            setUsedItems((prev) => prev.filter((usedItem) => usedItem.itemId !== item.id));
                          }
                        }}
                      />
                      <Label htmlFor={`item-${item.id}`} className="flex-grow">
                        {item.productName} - {item.quantity - item.usedQuantity} {item.unitOfMeasurement} disponíveis
                      </Label>
                      <Input 
                        type="number" 
                        ref={quantityInputRef} 
                        className="w-20" 
                        min="0" 
                        step="0.01"
                        onChange={() => {}}
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleAddItem(item.id, item.productName, quantityInputRef)}
                        className={`ml-2 `}
                        disabled={isLoading}
                      >
                        Add
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmReview}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
