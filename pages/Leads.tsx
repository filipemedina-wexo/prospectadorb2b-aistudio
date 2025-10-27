

import React, { useState, useMemo } from 'react';
import type { Lead, Tag, Profile } from '../types';
import { LeadStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface LeadsProps {
  leads: Lead[];
  tags: Tag[];
  updateLead: (updatedLead: Lead) => void;
  setSelectedLead: (lead: Lead | null) => void;
  currentProfile: Profile;
  profiles: Profile[];
}

const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const { bg, text, ring } = STATUS_COLORS[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ring-1 ring-inset ${ring}`}>
      {status}
    </span>
  );
};

const Leads: React.FC<LeadsProps> = ({ leads, tags, updateLead, setSelectedLead, currentProfile, profiles }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const profileMap = useMemo(() => {
        return profiles.reduce((acc, profile) => {
            acc[profile.id] = profile.name;
            return acc;
        }, {} as Record<string, string>);
    }, [profiles]);
    
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => 
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.phone.toLowerCase().includes(searchTerm.toLowerCase())
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }, [leads, searchTerm]);

    const handleStatusChange = (lead: Lead, newStatus: LeadStatus) => {
        updateLead({ ...lead, status: newStatus, updated_at: new Date().toISOString() });
    };

    return (
        <div className="p-6">
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
                                            <span key={tag.id} className="px-2 py-1 text-xs font-medium rounded-full" style={{backgroundColor: `${tag.color}20`, color: tag.color}}>
                                                {tag.name}
                                            </span>
                                        ) : null;
                                    })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.updated_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedLead(lead)} className="text-primary hover:text-primary-dark">Ver Detalhes</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {filteredLeads.length === 0 && (
                <div className="text-center py-12 bg-white mt-[-1px] rounded-b-lg border border-t-0 border-gray-200 shadow-sm">
                    <p className="text-gray-500">Nenhum lead encontrado.</p>
                </div>
            )}
        </div>
    );
};

export default Leads;