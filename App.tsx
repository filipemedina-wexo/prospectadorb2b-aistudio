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
import * as api from './services/apiService';

// --- NOTA PARA O DESENVOLVEDOR ---
// Este aplicativo está atualmente funcionando em "modo de demonstração",
// usando o armazenamento local do navegador (localStorage) para salvar os dados.
// Quando seu backend (API) estiver pronto, siga os comentários "MODO API"
// neste arquivo para substituir a lógica local pelas chamadas de API.

const App: React.FC = () => {
  const { currentProfile, profiles, updateProfile } = useAuth();
  const [page, setPage] = useState<Page>('Dashboard');
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // MODO DEMO LOCAL (atual)
  const [leads, setLeads] = useLocalStorage<Lead[]>('leads', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('tags', []);
  const [lists, setLists] = useLocalStorage<Lista[]>('lists', []);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Prospect page state
  const [prospectResults, setProspectResults] = useState<Partial<Lead>[]>([]);
  const [prospectSearchParams, setProspectSearchParams] = useState<{ segmento: string, cidade: string, bairro: string, onlyMobile: boolean }>({
    segmento: 'Restaurante',
    cidade: 'Porto Alegre',
    bairro: 'Centro',
    onlyMobile: false,
  });
  const [prospectNoMoreResults, setProspectNoMoreResults] = useState<boolean>(false);

  // MODO API (quando o backend estiver pronto)
  /*
  useEffect(() => {
    if (currentProfile) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [leadsData, tagsData, listsData] = await Promise.all([
            api.getLeads(),
            api.getTags(),
            // api.getLists(), // Descomente quando a função existir em apiService
          ]);
          setLeads(leadsData);
          setTags(tagsData);
          // setLists(listsData);
        } catch (error) {
          console.error("Failed to fetch initial data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [currentProfile]);
  */

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

    // MODO API (quando o backend estiver pronto)
    /*
    try {
        const createdLeads = await Promise.all(leadsToAdd.map(lead => api.createLead(lead)));
        setLeads(prev => [...prev, ...createdLeads]);
    } catch (error) {
        console.error("Failed to add leads:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    setLeads(prev => [...prev, ...leadsToAdd]);

    setProspectResults(prev => prev.map(p => {
      if (leadsToAdd.some(l => l.id === p.id)) {
        return { ...p, isAdded: true };
      }
      return p;
    }));

  }, [leads, currentProfile, setLeads]);

  const updateLead = useCallback(async (updatedLead: Lead) => {
    // MODO API (quando o backend estiver pronto)
    /*
    try {
        const returnedLead = await api.updateLead(updatedLead.id, updatedLead);
        setLeads(prev => prev.map(lead => lead.id === returnedLead.id ? returnedLead : lead));
    } catch(error) {
        console.error("Failed to update lead:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
    if (selectedLead && selectedLead.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
  }, [selectedLead, setLeads]);

  const deleteLead = useCallback(async (leadId: string) => {
    // MODO API (quando o backend estiver pronto)
    /*
    try {
        await api.deleteLead(leadId);
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
    } catch(error) {
        console.error("Failed to delete lead:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(null);
    }
  }, [selectedLead, setLeads]);

  const addTag = async (name: string, color: string) => {
    if (!currentProfile) return;

    // MODO API (quando o backend estiver pronto)
    /*
    try {
        const newTag = await api.createTag({ name, color });
        setTags(prev => [...prev, newTag]);
    } catch (error) {
        console.error("Failed to create tag:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      name,
      color,
      user_id: currentProfile.id
    };
    setTags(prev => [...prev, newTag]);
  };

  const deleteTag = async (tagId: string) => {
    // MODO API (quando o backend estiver pronto)
    /*
    try {
        await api.deleteTag(tagId); // Supondo que a função exista em apiService
        setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (error) {
        console.error("Failed to delete tag:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    setLeads(prev => prev.map(lead => ({
      ...lead,
      tags: lead.tags.filter(id => id !== tagId)
    })));
  };

  const addList = async (name: string, description: string) => {
    if (!currentProfile) return;
    // MODO API (quando o backend estiver pronto)
    /*
    try {
        const newList = await api.createList({ name, description }); // Supondo que a função exista
        setLists(prev => [...prev, newList]);
    } catch (error) {
        console.error("Failed to create list:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    const newList: Lista = {
      id: `list_${Date.now()}`,
      name,
      description,
      user_id: currentProfile.id
    };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = async (listId: string) => {
    // MODO API (quando o backend estiver pronto)
    /*
    try {
        await api.deleteList(listId); // Supondo que a função exista
        setLists(prev => prev.filter(list => list.id !== listId));
    } catch (error) {
        console.error("Failed to delete list:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    setLists(prev => prev.filter(list => list.id !== listId));
    setLeads(prev => prev.map(lead => ({
      ...lead,
      listIds: lead.listIds.filter(id => id !== listId)
    })));
  };

  const handleCreateLead = async (leadData: PartialLead) => {
    if (!currentProfile) return;

    const newLeadData: Lead = {
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

    // MODO API (quando o backend estiver pronto)
    /*
    try {
        const createdLead = await api.createLead(newLeadData);
        setLeads(prev => [createdLead, ...prev]);
        setIsAddLeadModalOpen(false);
    } catch(error) {
        console.error("Failed to create lead:", error);
    }
    */

    // MODO DEMO LOCAL (atual)
    setLeads(prev => [newLeadData, ...prev]);
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
        return <Leads leads={leads} tags={tags} updateLead={updateLead} deleteLead={deleteLead} setSelectedLead={setSelectedLead} currentProfile={currentProfile} profiles={profiles} />;
      case 'Listas':
        return <Lists lists={lists} leads={leads} tags={tags} currentProfile={currentProfile} profiles={profiles} addList={addList} deleteList={deleteList} updateLead={updateLead} deleteLead={deleteLead} setSelectedLead={setSelectedLead} />;
      case 'Tags':
        return <Tags tags={tags} addTag={addTag} deleteTag={deleteTag} />;
      case 'Users':
        return currentProfile.role === 'admin' ? <Users /> : <Dashboard leads={leads} tags={tags} />;
      case 'Configurações':
        return <Settings currentProfile={currentProfile} onUpdateProfile={updateProfile} />;
      default:
        return <Dashboard leads={leads} tags={tags} />;
    }
  };

  const handleAddNew = () => {
    if (page === 'Leads') {
      setIsAddLeadModalOpen(true);
    }
    if (page === 'Tags') {
      // Lógica para adicionar nova Tag, talvez abrir um modal?
    }
    if (page === 'Listas') {
      // Lógica para adicionar nova Lista
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
