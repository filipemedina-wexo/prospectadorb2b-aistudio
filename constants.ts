// FIX: Replaced JSX syntax with React.createElement calls to be compatible with a .ts file.
import React from 'react';
import { LeadStatus } from './types';
import type { Page } from './types';

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; ring: string }> = {
  [LeadStatus.AContatar]: { bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-200' },
  [LeadStatus.Contatado]: { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-200' },
  [LeadStatus.Negociacao]: { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-200' },
  [LeadStatus.Ganho]: { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-200' },
  [LeadStatus.Perdido]: { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-200' },
};

const svgProps = (className: string) => ({
    xmlns: "http://www.w3.org/2000/svg",
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
});

const pathProps = {
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

// FIX: Changed JSX.Element to React.ReactNode to resolve namespace error in a .ts file.
export const NAV_ITEMS: { name: Page; icon: (className: string) => React.ReactNode }[] = [
  { name: 'Dashboard', icon: (className) => React.createElement('svg', svgProps(className), React.createElement('path', {...pathProps, d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6A2.25 2.25 0 0115.75 3.75h2.25A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25H15.75A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75A2.25 2.25 0 0115.75 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118.25 20.25H15.75A2.25 2.25 0 0113.5 18v-2.25z"})) },
  { name: 'Prospectar', icon: (className) => React.createElement('svg', svgProps(className), React.createElement('path', {...pathProps, d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"})) },
  { name: 'Leads', icon: (className) => React.createElement('svg', svgProps(className), React.createElement('path', {...pathProps, d: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 1110.5 6a3.75 3.75 0 01-2.25 3.75m-7.5 2.962c0 2.223.894 4.226 2.38 5.666a9.088 9.088 0 0012.24 0c1.486-1.44 2.38-3.443 2.38-5.666M3 18.75a9.088 9.088 0 0112.24 0c1.486-1.44 2.38-3.443 2.38-5.666"})) },
  { name: 'Listas', icon: (className) => React.createElement('svg', svgProps(className), React.createElement('path', {...pathProps, d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"})) },
  { name: 'Tags', icon: (className) => React.createElement('svg', svgProps(className), React.createElement('path', {...pathProps, d: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"}), React.createElement('path', {...pathProps, d: "M6 6h.008v.008H6V6z"})) },
  { name: 'Users', icon: (className) => React.createElement('svg', svgProps(className), React.createElement('path', {...pathProps, d: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.598m-1.5-6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"})) },
  { name: 'Configurações', icon: (className) => React.createElement('svg', svgProps(className), React.createElement('path', {...pathProps, d: "M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m11.495 0l-1.41-.513M6.094 15.077l.514-1.41M17.906 15.077l-.514-1.41M12 21a9 9 0 100-18 9 9 0 000 18z"})) },
];

export const SEGMENTS = [
  'Restaurante', 'Advocacia', 'Contabilidade', 'Agência de Marketing', 'Clínica Médica', 'Loja de Varejo', 'Consultoria', 'Academia'
];

export const INITIAL_TAGS: { name: string, color: string }[] = [
    { name: 'Cliente em Potencial', color: '#3b82f6' },
    { name: 'Follow-up', color: '#f97316' },
    { name: 'Alto Valor', color: '#eab308' },
    { name: 'Reativar', color: '#8b5cf6' },
];