
import React, { useState, useMemo } from 'react';
import type { Lista, Lead, Tag, Profile } from '../types';
import { LeadStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface ListsProps {
  lists: Lista[];
  leads: Lead[];
  tags: Tag[];
  currentProfile: Profile;
  profiles: Profile[];
  addList: (name: string, description: string) => void;
  deleteList: (listId: string) => void;
  updateLead: (updatedLead: Lead) => void;
  deleteLead: (leadId: string) => void;
  setSelectedLead: (lead: Lead | null) => void;
}

const Lists: React.FC<ListsProps> = ({ lists, leads, tags, currentProfile, profiles, addList, deleteList, updateLead, deleteLead, setSelectedLead }) => {
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [selectedList, setSelectedList] = useState<Lista | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addList(newListName, newListDescription);
    setNewListName('');
    setNewListDescription('');
  };

  const getLeadCount = (listId: string) => {
    return leads.filter(lead => lead.listIds.includes(listId)).length;
  };

  const getLeadsInList = (listId: string) => {
    return leads.filter(lead => lead.listIds.includes(listId));
  };

  const profileMap = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile.id] = profile.name;
      return acc;
    }, {} as Record<string, string>);
  }, [profiles]);

  const handleStatusChange = (lead: Lead, newStatus: LeadStatus) => {
    updateLead({ ...lead, status: newStatus, updated_at: new Date().toISOString() });
  };

  // Calculate leads in list (always, even if selectedList is null)
  const leadsInList = useMemo(() => {
    if (!selectedList) return [];
    return leads.filter(lead => lead.listIds.includes(selectedList.id));
  }, [selectedList, leads]);

  // Filter leads based on search term (always, even if selectedList is null)
  const filteredLeads = useMemo(() => {
    return leadsInList.filter(lead =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [leadsInList, searchTerm]);

  // If a list is selected, show the leads in that list using the Leads page template
  if (selectedList) {

    return (
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedList(null);
              setSearchTerm('');
            }}
            className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
          >
            ← Voltar para Listas
          </button>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-800">{selectedList.name}</h2>
            <p className="text-sm text-gray-500">{selectedList.description}</p>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                {currentProfile.role === 'admin' && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proprietário</th>}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50" onDoubleClick={() => setSelectedLead(lead)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    <div className="text-sm text-gray-500">{lead.website}</div>
                  </td>
                  {currentProfile.role === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profileMap[lead.user_id] || 'Desconhecido'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead, e.target.value as LeadStatus)}
                      className={`text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent py-1 px-3 ${STATUS_COLORS[lead.status].bg} ${STATUS_COLORS[lead.status].text} ${STATUS_COLORS[lead.status].ring.replace('ring-', 'border-')}`}
                    >
                      {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.map(tagId => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <span key={tag.id} className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.updated_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => setSelectedLead(lead)} className="text-primary hover:text-primary-dark mr-4">Ver Detalhes</button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)) {
                          deleteLead(lead.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLeads.length === 0 && (
          <div className="text-center py-12 bg-white mt-[-1px] rounded-b-lg border border-t-0 border-gray-200 shadow-sm">
            <p className="text-gray-500">Nenhum lead encontrado nesta lista.</p>
          </div>
        )}
      </div>
    );
  }

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
            <div key={list.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedList(list)}>
              <div>
                <p className="font-semibold text-gray-800">{list.name}</p>
                <p className="text-sm text-gray-500">{list.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-600 bg-gray-200 px-2.5 py-1 rounded-full">
                  {getLeadCount(list.id)} leads
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
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