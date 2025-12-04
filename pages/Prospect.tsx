

import React, { useState, useEffect } from 'react';
import { findBusinesses, findInstagramProfile } from '../services/geminiService';
import type { Lead, PartialLead } from '../types';

interface ProspectProps {
  addLeads: (newLeads: PartialLead[]) => void;
  setPage: (page: 'Leads') => void;
  leads: Lead[];
  prospectResults: Partial<Lead>[];
  setProspectResults: React.Dispatch<React.SetStateAction<Partial<Lead>[]>>;
  prospectSearchParams: { segmento: string, cidade: string, bairro: string, onlyMobile: boolean };
  setProspectSearchParams: React.Dispatch<React.SetStateAction<{ segmento: string, cidade: string, bairro: string, onlyMobile: boolean }>>;
  prospectNoMoreResults: boolean;
  setProspectNoMoreResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const Prospect: React.FC<ProspectProps> = ({
  addLeads,
  setPage,
  leads,
  prospectResults,
  setProspectResults,
  prospectSearchParams,
  setProspectSearchParams,
  prospectNoMoreResults,
  setProspectNoMoreResults
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // FIX: Add state to control the visibility of the "new leads" banner.
  const [showNewLeadsBanner, setShowNewLeadsBanner] = useState<boolean>(false);

  const [location, setLocation] = useState<{ lat: number, lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setLocationError(null);
        },
        (err) => {
          console.error("Error getting location:", err);
          setLocationError("Não foi possível obter sua localização. A busca pode ser menos precisa.");
        }
      );
    } else {
      setLocationError("Geolocalização não é suportada por este navegador.");
    }
  }, []);


  const handleSearch = async (isContinuation = false) => {
    setIsLoading(true);
    setError(null);
    // FIX: Hide banner when any search starts.
    setShowNewLeadsBanner(false);
    if (!isContinuation) {
      setProspectResults([]);
      setProspectNoMoreResults(false);
    }

    const existingNames = isContinuation ? prospectResults.map(r => r.name).filter(Boolean) as string[] : [];

    try {
      const businesses = await findBusinesses(prospectSearchParams.segmento, prospectSearchParams.cidade, prospectSearchParams.bairro, location, prospectSearchParams.onlyMobile, existingNames);

      if (businesses.length === 0) {
        if (isContinuation) {
          setProspectNoMoreResults(true);
        }
        return;
      }

      // Enrich with Instagram profiles
      const enrichmentPromises = businesses.map(business => {
        if (!business.instagram_profile || business.instagram_profile === 'N/A' || business.instagram_profile === '') {
          return findInstagramProfile(business.name!, business.website).then(instagramUrl => {
            return { ...business, instagram_profile: instagramUrl };
          });
        }
        return Promise.resolve(business);
      });

      const enrichedBusinesses = await Promise.all(enrichmentPromises);
      setProspectResults(prev => isContinuation ? [...prev, ...enrichedBusinesses] : enrichedBusinesses);
      // FIX: Show banner only after a new search with results.
      if (!isContinuation && enrichedBusinesses.length > 0) {
        setShowNewLeadsBanner(true);
      }

    } catch (e: any) {
      setError(e.message || "Falha ao buscar empresas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLead = (prospect: Partial<Lead>) => {
    addLeads([prospect as Lead]);
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">Buscar novas empresas</h3>
        <p className="text-sm text-gray-500 mt-1">Encontre leads potenciais usando informações do Google.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label htmlFor="segmento" className="block text-sm font-medium text-gray-700 mb-1">Segmento</label>
            <input type="text" id="segmento" value={prospectSearchParams.segmento} onChange={e => setProspectSearchParams(p => ({ ...p, segmento: e.target.value }))} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" placeholder="Ex: Restaurante" />
          </div>
          <div>
            <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input type="text" id="cidade" value={prospectSearchParams.cidade} onChange={e => setProspectSearchParams(p => ({ ...p, cidade: e.target.value }))} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" />
          </div>
          <div>
            <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
            <input type="text" id="bairro" value={prospectSearchParams.bairro} onChange={e => setProspectSearchParams(p => ({ ...p, bairro: e.target.value }))} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" />
          </div>
          <div className="self-end">
            <button
              onClick={() => handleSearch(false)}
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {isLoading && prospectResults.length === 0 ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              )}
              Buscar
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center">
          <input id="only-mobile" type="checkbox" checked={prospectSearchParams.onlyMobile} onChange={e => setProspectSearchParams(p => ({ ...p, onlyMobile: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label htmlFor="only-mobile" className="ml-2 block text-sm text-gray-700">Buscar apenas locais com celular</label>
        </div>
        {locationError && <p className="text-xs text-yellow-700 mt-2">{locationError}</p>}
      </div>

      {error && <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}

      {/* FIX: Use showNewLeadsBanner state to control banner visibility. */}
      {showNewLeadsBanner && (
        <div className="mt-4 bg-blue-100 border-t-4 border-blue-500 rounded-b-lg text-blue-900 px-4 py-3 shadow-md" role="alert">
          <div className="flex">
            <div className="py-1"><svg className="fill-current h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg></div>
            <div>
              <p className="font-bold">{prospectResults.length} novos leads encontrados.</p>
              <p className="text-sm">Clique em "Ver Leads" para gerenciá-los.</p>
              <button onClick={() => setPage('Leads')} className="mt-2 text-sm font-bold text-blue-700 hover:underline">Ver Leads &rarr;</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nota GMB</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instagram</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Adicionar</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && prospectResults.length === 0 && Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                <td className="px-6 py-4 whitespace-nowrap"><div className="h-8 bg-gray-200 rounded w-full"></div></td>
              </tr>
            ))}
            {prospectResults.map((prospect) => (
              <tr key={prospect.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{prospect.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{prospect.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.gmb_rating?.toFixed(1)} ({prospect.gmb_review_count || 0})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.instagram_profile && prospect.instagram_profile !== 'N/A' ? (
                    <a href={prospect.instagram_profile} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Ver Perfil
                    </a>
                  ) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prospect.website && prospect.website !== 'N/A' ? (<a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-xs">{new URL(prospect.website).hostname}</a>) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleAddLead(prospect)}
                    disabled={leads.some(l => l.id === prospect.id)}
                    className="w-full text-white bg-primary hover:bg-primary-hover disabled:bg-green-500 disabled:cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    {leads.some(l => l.id === prospect.id) ? 'Adicionado' : 'Adicionar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && prospectResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum resultado encontrado. Tente uma nova busca.</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        {isLoading && prospectResults.length > 0 ? (
          <div className="flex items-center text-primary py-2">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Buscando mais resultados...
          </div>
        ) : prospectNoMoreResults ? (
          <p className="text-gray-500 py-2">Não foram encontrados mais resultados.</p>
        ) : prospectResults.length > 0 ? (
          <button
            onClick={() => handleSearch(true)}
            className="w-full max-w-xs px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Buscar mais
          </button>
        ) : null}
      </div>

    </div>
  );
};

export default Prospect;
