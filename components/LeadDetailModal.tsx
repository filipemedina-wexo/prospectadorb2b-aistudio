import React, { useState } from 'react';
import type { Lead, Observation, Tag, Lista } from '../types';
import { LeadStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface LeadDetailModalProps {
  lead: Lead;
  tags: Tag[];
  lists: Lista[];
  onClose: () => void;
  onUpdate: (updatedLead: Lead) => Promise<void>;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, tags, lists, onClose, onUpdate }) => {
  const [observationText, setObservationText] = useState('');
  const [activeTab, setActiveTab] = useState<'observations' | 'details'>('observations');

  const handleAddObservation = () => {
    if (!observationText.trim()) return;
    const newObservation: Observation = {
      id: `obs_${Date.now()}`,
      text: observationText,
      author: 'Wishbone', // This should be the current user's name
      created_at: new Date().toISOString(),
    };
    onUpdate({
      ...lead,
      observations: [newObservation, ...lead.observations],
      updated_at: new Date().toISOString(),
    });
    setObservationText('');
  };

  const handleStatusChange = (newStatus: LeadStatus) => {
    onUpdate({ ...lead, status: newStatus, updated_at: new Date().toISOString() });
  };
  
  const handleTagToggle = (tagId: string) => {
    const newTags = lead.tags.includes(tagId) 
        ? lead.tags.filter(id => id !== tagId) 
        : [...lead.tags, tagId];
    onUpdate({...lead, tags: newTags, updated_at: new Date().toISOString() });
  }

  const handleListToggle = (listId: string) => {
    const newListIds = lead.listIds.includes(listId)
      ? lead.listIds.filter(id => id !== listId)
      : [...lead.listIds, listId];
    onUpdate({ ...lead, listIds: newListIds, updated_at: new Date().toISOString() });
  }

  const leadTags = tags.filter(t => lead.tags.includes(t.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
              <p className="text-sm text-gray-500">{lead.address}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className={`w-40 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent py-1 px-3 ${STATUS_COLORS[lead.status].bg} ${STATUS_COLORS[lead.status].text} ${STATUS_COLORS[lead.status].ring.replace('ring-', 'border-')}`}
            >
                {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {leadTags.map(tag => (
                <span key={tag.id} className="px-2 py-1 text-xs font-medium rounded-full" style={{backgroundColor: `${tag.color}20`, color: tag.color}}>
                    {tag.name}
                </span>
            ))}
          </div>
        </div>
        
        <div className="border-b border-gray-200 bg-white">
            <nav className="-mb-px flex space-x-6 px-6">
                <button onClick={() => setActiveTab('observations')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'observations' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Histórico
                </button>
                 <button onClick={() => setActiveTab('details')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Detalhes
                </button>
            </nav>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
           {activeTab === 'observations' && (
                <div>
                    <div className="space-y-4">
                        {lead.observations.map(obs => (
                            <div key={obs.id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">W</div>
                                <div className="flex-1 bg-white p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-800">{obs.text}</p>
                                    <p className="text-xs text-gray-400 mt-1">{obs.author} - {new Date(obs.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                     {lead.observations.length === 0 && <p className="text-sm text-gray-500 text-center py-8">Nenhuma observação adicionada.</p>}
                </div>
            )}
            {activeTab === 'details' && (
                <div className="space-y-4 text-sm bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Telefone</dt>
                        <dd className="col-span-2 text-gray-900">{lead.phone}</dd>
                    </div>
                    <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Website</dt>
                        <dd className="col-span-2 text-primary hover:underline"><a href={`http://${lead.website}`} target="_blank" rel="noopener noreferrer">{lead.website}</a></dd>
                    </div>
                    <div className="grid grid-cols-3">
                        <dt className="font-medium text-gray-500">Nota GMB</dt>
                        <dd className="col-span-2 text-gray-900">{lead.gmb_rating.toFixed(1)}</dd>
                    </div>
                     <div className="pt-4 mt-4 border-t">
                        <h4 className="font-medium text-gray-600 mb-2">Gerenciar Tags</h4>
                         <div className="flex flex-wrap gap-2">
                             {tags.map(tag => (
                                 <button key={tag.id} onClick={() => handleTagToggle(tag.id)} className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${lead.tags.includes(tag.id) ? 'border-transparent' : 'border-gray-300'}`} style={lead.tags.includes(tag.id) ? {backgroundColor: tag.color, color: 'white'} : {}}>
                                     {tag.name}
                                 </button>
                             ))}
                         </div>
                     </div>
                     <div className="pt-4 mt-4 border-t">
                        <h4 className="font-medium text-gray-600 mb-2">Gerenciar Listas</h4>
                         <div className="flex flex-wrap gap-2">
                             {lists.map(list => (
                                 <button key={list.id} onClick={() => handleListToggle(list.id)} className={`px-3 py-1 text-sm font-medium rounded-full border transition-colors ${lead.listIds.includes(list.id) ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                     {list.name}
                                 </button>
                             ))}
                         </div>
                     </div>
                </div>
            )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <textarea
            value={observationText}
            onChange={(e) => setObservationText(e.target.value)}
            placeholder="Adicionar observação..."
            rows={3}
            className="w-full p-2 bg-white border border-gray-300 text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
          ></textarea>
          <button
            onClick={handleAddObservation}
            className="mt-2 w-full px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-sm"
          >
            Salvar Observação
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;