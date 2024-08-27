import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileSettingsDialog({ isOpen, onClose }: ProfileSettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Atualize seu perfil colocando as informações abaixo.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <Input type="text" placeholder="Seu nome" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil</label>
            <Input type="file" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input type="email" placeholder="Seu email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <Input type="password" placeholder="Sua senha" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={onClose} className="bg-gray-500 text-white">Cancelar</Button>
            <Button type="submit" className="bg-blue-500 text-white">Confirmar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
