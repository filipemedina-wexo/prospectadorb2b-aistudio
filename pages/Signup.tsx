

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface SignupProps {
    setAuthPage: (page: 'login' | 'signup') => void;
}

const Signup: React.FC<SignupProps> = ({ setAuthPage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        try {
            await signup(name, email, password);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <p className="text-white font-bold text-xl">P</p>
                    </div>
                    <h1 className="ml-4 text-2xl font-bold text-gray-800">Prospectador B2B</h1>
                </div>
                <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Criar nova conta</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Completo
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email-signup"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                             className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 mb-1">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password-signup"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="block w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Cadastrar
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <button onClick={() => setAuthPage('login')} className="font-medium text-primary hover:text-primary-dark">
                        Faça login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;