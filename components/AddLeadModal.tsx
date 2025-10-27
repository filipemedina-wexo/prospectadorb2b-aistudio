
import React, { useState } from 'react';
import type { PartialLead } from '../types';

interface AddLeadModalProps {
  onClose: () => void;
  onAddLead: (leadData: PartialLead) => void;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({ onClose, onAddLead }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!name.trim()) {
            setError('O nome do lead é obrigatório.');
            return;
        }
        onAddLead({
            name,
            phone,
            website,
            address,
            city,
            neighborhood
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-gray-800">Adicionar Novo Lead</h3>
                <p className="text-sm text-gray-500 mt-1">Preencha os detalhes abaixo para criar um novo lead manualmente.</p>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md my-4 text-sm">{error}</p>}
                <div className="space-y-4 mt-6 max-h-[60vh] overflow-y-auto pr-2">
                     <div>
                        <label htmlFor="lead-name" className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-500">*</span></label>
                        <input type="text" id="lead-name" value={name} onChange={e => setName(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lead-phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                            <input type="text" id="lead-phone" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="lead-website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input type="text" id="lead-website" value={website} onChange={e => setWebsite(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="lead-address" className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                        <input type="text" id="lead-address" value={address} onChange={e => setAddress(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lead-city" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                            <input type="text" id="lead-city" value={city} onChange={e => setCity(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="lead-neighborhood" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                            <input type="text" id="lead-neighborhood" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm">Cancelar</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-sm">Salvar Lead</button>
                </div>
            </div>
        </div>
    )
}

export default AddLeadModal;
