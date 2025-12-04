import * as supabaseJs from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(`
      ****************************************************************
      *                                                              *
      *  Credenciais do Supabase não configuradas.                    *
      *  O aplicativo está rodando em MODO DE DEMONSTRAÇÃO LOCAL.    *
      *  Os dados serão salvos no seu navegador, mas não em um banco *
      *  de dados online. Para habilitar o modo online, configure as *
      *  variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no     *
      *  arquivo '.env'.                                             *
      *                                                              *
      ****************************************************************
    `);
}

export const supabase = supabaseJs.createClient(supabaseUrl, supabaseAnonKey);