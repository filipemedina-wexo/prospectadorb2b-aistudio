

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Lead, Tag } from '../types';
import { LeadStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface DashboardProps {
  leads: Lead[];
  tags: Tag[];
}

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  // FIX: Change icon prop type from JSX.Element to React.ReactNode to resolve namespace error.
  icon: React.ReactNode;
  color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType, icon, color }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      {change && (
        <p className={`text-sm mt-1 ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </p>
      )}
    </div>
    <div className={`rounded-full p-3 ${color}`}>
        {icon}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ leads, tags }) => {

    const leadsByStatus = Object.values(LeadStatus).map(status => ({
        name: status,
        leads: leads.filter(lead => lead.status === status).length
    }));

    const leadsByTag = tags.map(tag => ({
        name: tag.name,
        value: leads.filter(lead => lead.tags.includes(tag.id)).length,
        color: tag.color
    })).filter(t => t.value > 0);

    const recentObservations = leads
        .flatMap(lead => lead.observations.map(obs => ({...obs, leadName: lead.name})))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total de leads" value={leads.length} change="+47 na semana" changeType="increase" color="bg-blue-100" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 1110.5 6a3.75 3.75 0 01-2.25 3.75m-7.5 2.962c0 2.223.894 4.226 2.38 5.666a9.088 9.088 0 0012.24 0c1.486-1.44 2.38-3.443 2.38-5.666M3 18.75a9.088 9.088 0 0112.24 0c1.486-1.44 2.38-3.443 2.38-5.666" /></svg>} />
                <KpiCard title="Leads novos" value={leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} change="+12 hoje" changeType="increase" color="bg-orange-100" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                <KpiCard title="Contatados" value={leads.filter(l => l.status === LeadStatus.Contatado).length} change="-5 na semana" changeType="decrease" color="bg-purple-100" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>} />
                <KpiCard title="Ganhos" value={leads.filter(l => l.status === LeadStatus.Ganho).length} change="+2 na semana" changeType="increase" color="bg-green-100" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-800 text-lg">Leads por Status</h3>
                    <div className="h-80 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadsByStatus} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="name" tick={{fontSize: 12}} />
                                <YAxis tick={{fontSize: 12}}/>
                                <Tooltip wrapperClassName="!rounded-lg !border-gray-200 !shadow-sm" />
                                <Bar dataKey="leads" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <h3 className="font-semibold text-gray-800 text-lg">Histórico Recente</h3>
                     <div className="mt-4 space-y-4">
                        {recentObservations.length > 0 ? recentObservations.map(obs => (
                            <div key={obs.id} className="text-sm">
                                <p className="text-gray-800"><strong className="font-medium">{obs.leadName}</strong></p>
                                <p className="text-gray-500 truncate">"{obs.text}"</p>
                                <p className="text-xs text-gray-400">{new Date(obs.created_at).toLocaleString()}</p>
                            </div>
                        )) : <p className="text-sm text-gray-500">Nenhuma observação recente.</p>}
                     </div>
                </div>
            </div>
             <div className="grid grid-cols-1">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-800 text-lg">Leads por Tag</h3>
                     <div className="h-80 mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={leadsByTag} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {leadsByTag.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip wrapperClassName="!rounded-lg !border-gray-200 !shadow-sm" />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;