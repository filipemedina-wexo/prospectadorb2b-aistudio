import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Prospect from './pages/Prospect';
import Leads from './pages/Leads';
import Lists from './pages/Lists';
import Tags from './pages/Tags';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LeadDetailModal from './components/LeadDetailModal';
import AddLeadModal from './components/AddLeadModal';
import { useAuth } from './context/AuthContext';
import type { Page, Lead, Tag, Lista, Profile, PartialLead } from './types';
import { LeadStatus } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { INITIAL_TAGS } from './constants';

// --- NOTA PARA O DESENVOLVEDOR ---
// Este aplicativo está atualmente funcionando em "modo de demonstração",
// usando o armazenamento local do navegador (localStorage) para salvar os dados.
// Para conectar a um banco de dados como o MySQL, você precisará criar um
// backend (API). O arquivo `services/apiService.ts` contém exemplos de como
// seu frontend pode se comunicar com essa API. Você precisará substituir
// as chamadas a `useLocalStorage` por chamadas às funções nesse arquivo
// depois que seu backend estiver pronto.

const App: React.FC = () => {
  const { currentProfile, profiles, updateProfile } = useAuth();
  const [page, setPage] = useState<Page>('Dashboard');
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false); // No initial loading from DB

  // Global data stores using local storage
  const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('tags', []);
  const [lists, setLists] = useLocalStorage<Lista[]>('lists', []);
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Prospect page state
  const [prospectResults, setProspectResults] = useState<Partial<Lead>[]>([]);
  const [prospectSearchParams, setProspectSearchParams] = useState<{segmento: string, cidade: string, bairro: string, onlyMobile: boolean}>({
    segmento: 'Restaurante',
    cidade: 'Porto Alegre',
    bairro: 'Centro',
    onlyMobile: false,
  });
  const [prospectNoMoreResults, setProspectNoMoreResults] = useState<boolean>(false);

  // Seed initial data for demo if local storage is empty
  useEffect(() => {
    if (currentProfile) {
        if (tags.length === 0) {
            setTags(INITIAL_TAGS.map((t, i) => ({ ...t, id: `tag-${i}`, user_id: currentProfile.id })));
        }
        if (lists.length === 0) {
            setLists([
                { id: 'list-1', user_id: currentProfile.id, name: 'Clientes Quentes', description: 'Leads com alta probabilidade de fechar.' },
                { id: 'list-2', user_id: currentProfile.id, name: 'Reativar', description: 'Leads antigos para um novo contato.' },
            ]);
        }
    }
  }, [currentProfile, tags.length, lists.length, setTags, setLists]);

  const addLeads = useCallback(async (newLeads: PartialLead[]) => {
    if (!currentProfile) return;

    const leadsToAdd = newLeads
        .filter(nl => !leads.some(l => l.id === nl.id))
        .map((l, index) => ({
             ...l,
             id: `lead_${Date.now()}_${index}`,
             user_id: currentProfile.id,
             name: l.name || 'Nome Desconhecido',
             phone: l.phone || 'N/A',
             website: l.website || 'N/A',
             address: l.address || 'N/A',
             gmb_rating: l.gmb_rating || 0,
             status: l.status || LeadStatus.AContatar,
             city: l.city || '',
             neighborhood: l.neighborhood || '',
             tags: l.tags || [],
             listIds: l.listIds || [],
             observations: l.observations || [],
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString(),
        } as Lead));
    
    if (leadsToAdd.length === 0) return;

    setLeads(prev => [...prev, ...leadsToAdd]);
    // Also mark prospects as added to disable button
    setProspectResults(prev => prev.map(p => {
        if (leadsToAdd.some(l => l.id === p.id)) {
            return { ...p, isAdded: true };
        }
        return p;
    }));


  }, [leads, currentProfile, setLeads]);

  const updateLead = useCallback(async (updatedLead: Lead) => {
    setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    if (selectedLead && selectedLead.id === updatedLead.id) {
        setSelectedLead(updatedLead);
    }
  }, [selectedLead, setLeads]);

  const addTag = async (name: string, color: string) => {
    if (!currentProfile) return;
    const newTag: Tag = {
        id: `tag_${Date.now()}`,
        name,
        color,
        user_id: currentProfile.id
    };
    setTags(prev => [...prev, newTag]);
  };

  const deleteTag = async (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    // Also remove the tag from any leads that have it
    setLeads(prev => prev.map(lead => ({
        ...lead,
        tags: lead.tags.filter(id => id !== tagId)
    })));
  };

  const addList = async (name: string, description: string) => {
    if (!currentProfile) return;
    const newList: Lista = {
        id: `list_${Date.now()}`,
        name,
        description,
        user_id: currentProfile.id
    };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = async (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
    // Also remove the list from any leads that have it
    setLeads(prev => prev.map(lead => ({
        ...lead,
        listIds: lead.listIds.filter(id => id !== listId)
    })));
  };

  const handleCreateLead = async (leadData: PartialLead) => {
    if (!currentProfile) return;
    
    const newLead: Lead = {
        id: `lead_${Date.now()}`,
        user_id: currentProfile.id,
        name: leadData.name || 'Novo Lead',
        phone: leadData.phone || '',
        website: leadData.website || '',
        address: leadData.address || '',
        gmb_rating: 0,
        status: LeadStatus.AContatar,
        city: leadData.city || '',
        neighborhood: leadData.neighborhood || '',
        observations: [],
        tags: [],
        listIds: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    setLeads(prev => [newLead, ...prev]);
    setIsAddLeadModalOpen(false);
  };

  const renderPage = () => {
    if (!currentProfile) return null;

    switch (page) {
      case 'Dashboard':
        return <Dashboard leads={leads} tags={tags} />;
      case 'Prospectar':
        return <Prospect 
          addLeads={addLeads} 
          setPage={setPage as (page: 'Leads') => void} 
          leads={leads}
          prospectResults={prospectResults}
          setProspectResults={setProspectResults}
          prospectSearchParams={prospectSearchParams}
          setProspectSearchParams={setProspectSearchParams}
          prospectNoMoreResults={prospectNoMoreResults}
          setProspectNoMoreResults={setProspectNoMoreResults}
        />;
      case 'Leads':
        return <Leads leads={leads} tags={tags} updateLead={updateLead} setSelectedLead={setSelectedLead} currentProfile={currentProfile} profiles={profiles} />;
      case 'Listas':
        return <Lists lists={lists} addList={addList} deleteList={deleteList} leads={leads} />;
      case 'Tags':
        return <Tags tags={tags} addTag={addTag} deleteTag={deleteTag} />;
       case 'Users':
        return currentProfile.role === 'admin' ? <Users /> : <Dashboard leads={leads} tags={tags}/>;
      case 'Configurações':
        return <Settings currentProfile={currentProfile} onUpdateProfile={updateProfile} />;
      default:
        return <Dashboard leads={leads} tags={tags}/>;
    }
  };

  const handleAddNew = () => {
    if (page === 'Leads') {
        setIsAddLeadModalOpen(true);
    }
  };

  if (!currentProfile) {
    return (
        <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
            {authPage === 'login' ? <Login setAuthPage={setAuthPage} /> : <Signup setAuthPage={setAuthPage} />}
        </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-100 font-sans text-gray-900 flex">
      <Sidebar currentPage={page} setPage={setPage} />
      <div className="flex-1 flex flex-col ml-64">
        <Header currentPage={page} onAddNew={handleAddNew} />
        <main className="flex-1 overflow-y-auto">
          {isLoading ? <div className="flex items-center justify-center h-full"><p>Carregando...</p></div> : renderPage()}
        </main>
      </div>
      {selectedLead && (
        <LeadDetailModal 
            lead={selectedLead}
            tags={tags}
            lists={lists}
            onClose={() => setSelectedLead(null)}
            onUpdate={updateLead}
        />
      )}
      {isAddLeadModalOpen && (
        <AddLeadModal
            onClose={() => setIsAddLeadModalOpen(false)}
            onAddLead={handleCreateLead}
        />
      )}
    </div>
  );
};

export default App;
