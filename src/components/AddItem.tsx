import { useState } from "react";
import { FinancialItem } from "@/interfaces/financial.interface";
import { Button } from "@/components/ui/button";

interface AddItemFormProps {
  onAdd: (item: Partial<FinancialItem>) => void;
  isLoading: boolean;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd, isLoading }) => {
  const [newItem, setNewItem] = useState<Partial<FinancialItem>>({
    name: '',
    amountSpent: 0,
    isRecurrent: false,
    installments: undefined,
    dueDate: undefined,
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newItem.name || newItem.amountSpent === undefined) {
      setError("Nome e Valor Gasto são obrigatórios.");
      return;
    }

    if (newItem.isRecurrent) {
      if (!newItem.installments || !newItem.dueDate) {
        setError("Parcelas e Data de Vencimento são obrigatórias para itens recorrentes.");
        return;
      }
    }

    const formattedItem = {
      ...newItem,
      dueDate: newItem.dueDate ? new Date(newItem.dueDate).toISOString() : undefined,
    };

    setError(null);
    onAdd(formattedItem);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="mb-4">
        <label className="block text-gray-700">Nome:</label>
        <input
          type="text"
          value={newItem.name || ''}
          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Valor Gasto:</label>
        <input
          type="number"
          step="0.01"
          value={newItem.amountSpent || ''}
          onChange={(e) => setNewItem(prev => ({ ...prev, amountSpent: parseFloat(e.target.value) }))}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={newItem.isRecurrent || false}
          onChange={(e) => setNewItem(prev => ({ ...prev, isRecurrent: e.target.checked }))}
          className="mr-2"
        />
        <label className="text-gray-700">É parcelado?</label>
      </div>
      
      {newItem.isRecurrent && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Parcelas:</label>
            <input
              type="number"
              value={newItem.installments || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, installments: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded"
              required={newItem.isRecurrent}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700">Data de Vencimento:</label>
            <input
              type="date"
              value={newItem.dueDate ? newItem.dueDate.split('T')[0] : ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
              required={newItem.isRecurrent}
            />
          </div>
        </>
      )}
      
      <div className="flex justify-end">
        <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={isLoading}>
          {isLoading ? 'Adicionando...' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
};

export default AddItemForm;
