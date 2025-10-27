

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Profile } from '../types';

interface SettingsProps {
    currentProfile: Profile;
    onUpdateProfile: (profile: Profile) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentProfile, onUpdateProfile }) => {
    const { updateUserPassword } = useAuth();
    const [name, setName] = useState(currentProfile.name);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const handleProfileUpdate = () => {
        onUpdateProfile({ ...currentProfile, name });
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'As novas senhas não correspondem.' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
            return;
        }
        
        try {
            await updateUserPassword(newPassword);
            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: `Falha ao alterar a senha: ${error.message}` });
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="space-y-8">
                 {message && (
                    <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message.text}
                    </div>
                )}
                {/* Profile */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Perfil</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" value={useAuth().currentUser?.email} disabled className="block w-full px-3 py-2 bg-gray-100 border border-gray-300 text-gray-500 rounded-lg focus:outline-none sm:text-sm cursor-not-allowed" />
                        </div>
                    </div>
                    <div className="mt-6 text-right">
                        <button onClick={handleProfileUpdate} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-sm">Salvar Alterações</button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Alterar Senha</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                            <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="block w-full max-w-sm px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                            <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full max-w-sm px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm" />
                        </div>
                    </div>
                     <div className="mt-6 text-right">
                        <button onClick={handlePasswordChange} className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium shadow-sm">Alterar Senha</button>
                    </div>
                </div>
                 
                {/* Account Deletion */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">Conta</h3>
                     <div className="mt-4">
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Excluir conta
                        </button>
                        <p className="text-xs text-gray-500 mt-1">Esta ação é irreversível.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;