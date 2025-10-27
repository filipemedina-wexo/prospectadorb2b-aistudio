import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Profile } from '../types';

const UserModal: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [error, setError] = useState('');
    const { setProfiles } = useAuth();

    const handleSubmit = async () => {
        setError('');
        if (!name || !email || !password) {
            setError('Todos os campos são obrigatórios.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        const newProfile: Profile = {
            id: `mock-user-${Date.now()}`,
            name,
            role
        };
        // In demo mode, we just add the profile to the local list.
        // A real implementation would require a secure backend function for an admin to create users.
        setProfiles(prev => [...prev, newProfile]);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-gray-800">Criar Novo Usuário</h3>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md my-4 text-sm">{error}</p>}
                <div className="space-y-4 mt-4">
                     <div>
                        <label htmlFor="new-user-name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input type="text" id="new-user-name" value={name} onChange={e => setName(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="new-user-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" id="new-user-email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="new-user-password" className="block text-sm font-medium text-gray-700 mb-1">Senha (mínimo 6 caracteres)</label>
                        <input type="password" id="new-user-password" value={password} onChange={e => setPassword(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="new-user-role" className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                        <select id="new-user-role" value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm">
                            <option value="user">Usuário</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm">Cancelar</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-sm">Criar Usuário</button>
                </div>
            </div>
        </div>
    )
}


const Users: React.FC = () => {
    const { profiles, updateProfile, deleteUser, currentProfile } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRoleChange = (profile: Profile, newRole: 'admin' | 'user') => {
        updateProfile({ ...profile, role: newRole });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
             {isModalOpen && <UserModal onClose={() => setIsModalOpen(false)} />}
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-semibold text-gray-800">Gerenciamento de Usuários</h2>
                 <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium flex items-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.75 4.75a.75. 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Criar Usuário
                </button>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {profiles.map(profile => (
                            <tr key={profile.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <select
                                        value={profile.role}
                                        onChange={(e) => handleRoleChange(profile, e.target.value as 'admin' | 'user')}
                                        disabled={profile.id === currentProfile?.id}
                                        className={`text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent py-1 px-3 ${profile.role === 'admin' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-gray-100 text-gray-600 border-gray-200'} disabled:opacity-70 disabled:cursor-not-allowed`}
                                    >
                                        <option value="user">Usuário</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {profile.id !== currentProfile?.id && (
                                        <button onClick={() => {
                                            if (window.confirm(`Tem certeza que deseja excluir o usuário ${profile.name}?`)) {
                                                console.error("Client-side user deletion is not secure/implemented.");
                                            }
                                        }} className="text-red-600 hover:text-red-900 disabled:opacity-50" disabled>
                                            Excluir
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;