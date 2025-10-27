import React from 'react';
import type { Page } from '../types';

interface HeaderProps {
    currentPage: Page;
    onAddNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onAddNew }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <h2 className="text-2xl font-semibold text-gray-800">{currentPage}</h2>
        <div className="flex items-center space-x-4">
             <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
            </div>
            {currentPage === 'Leads' && (
                 <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm">
                    Export CSV
                </button>
            )}
            <button 
                onClick={onAddNew}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium flex items-center shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                {currentPage === 'Leads' ? 'Novo Lead' : 'Adicionar'}
            </button>
        </div>
    </header>
  );
};

export default Header;