
import React, { useState } from 'react';
import type { Lista, Lead } from '../types';

interface ListsProps {
  lists: Lista[];
  leads: Lead[];
  addList: (name: string, description: string) => void;
  deleteList: (listId: string) => void;
}

const Lists: React.FC<ListsProps> = ({ lists, leads, addList, deleteList }) => {
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addList(newListName, newListDescription);
    setNewListName('');
    setNewListDescription('');
  };

  const getLeadCount = (listId: string) => {
    return leads.filter(lead => lead.listIds.includes(listId)).length;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Criar Nova Lista</h3>
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="list-name" className="block text-sm font-medium text-gray-700 mb-1">Nome da Lista</label>
            <input
              type="text"
              id="list-name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm placeholder-gray-500"
              placeholder="Ex: Clientes Quentes"
            />
          </div>
          <div>
            <label htmlFor="list-description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              id="list-description"
              rows={2}
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm placeholder-gray-500"
              placeholder="Uma breve descrição sobre o propósito desta lista."
            ></textarea>
          </div>
          <div className="text-right">
            <button
              onClick={handleAddList}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-sm"
            >
              Adicionar Lista
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Listas Existentes</h3>
        <div className="mt-4 space-y-3">
          {lists.length > 0 ? lists.map(list => (
            <div key={list.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-800">{list.name}</p>
                <p className="text-sm text-gray-500">{list.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full">
                  {getLeadCount(list.id)} leads
                </span>
                <button onClick={() => deleteList(list.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                  Excluir
                </button>
              </div>
            </div>
          )) : (
            <p className="text-sm text-center text-gray-500 py-4">Nenhuma lista criada ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lists;