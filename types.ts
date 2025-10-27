

export interface Profile {
  id: string;
  name: string;
  role: 'admin' | 'user';
}

export enum LeadStatus {
  AContatar = 'A contatar',
  Contatado = 'Contatado',
  Negociacao = 'Negociação',
  Ganho = 'Ganho',
  Perdido = 'Perdido',
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
}

export interface Observation {
  id: string;
  text: string;
  author: string;
  created_at: string;
}

export interface Source {
  uri: string;
  title: string;
}

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  website: string;
  address: string;
  gmb_rating: number;
  gmb_review_count?: number;
  instagram_profile?: string;
  status: LeadStatus;
  city: string;
  neighborhood: string;
  tags: string[]; // array of tag ids
  listIds: string[]; // array of list ids
  observations: Observation[];
  created_at: string;
  updated_at: string;
  sources?: Source[];
}

export type PartialLead = Partial<Lead>;

export interface Lista {
  id: string;
  user_id: string;
  name: string;
  description: string;
}

export type Page = 'Dashboard' | 'Prospectar' | 'Leads' | 'Listas' | 'Tags' | 'Configurações' | 'Users';