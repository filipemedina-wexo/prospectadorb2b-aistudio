import * as supabaseJs from '@supabase/supabase-js';

// --- AÇÃO NECESSÁRIA ---
// Cole aqui a URL e a Chave Anônima (anon key) do seu projeto Supabase.
// Você pode encontrá-las em "Project Settings" > "API" no seu painel Supabase.
const supabaseUrl = 'COLE_AQUI_SUA_URL_SUPABASE';
const supabaseAnonKey = 'COLE_AQUI_SUA_CHAVE_ANONIMA_SUPABASE';


if (supabaseUrl.startsWith('COLE_AQUI') || supabaseAnonKey.startsWith('COLE_AQUI')) {
    console.warn(`
      ****************************************************************
      *                                                              *
      *  Credenciais do Supabase não configuradas.                    *
      *  O aplicativo está rodando em MODO DE DEMONSTRAÇÃO LOCAL.    *
      *  Os dados serão salvos no seu navegador, mas não em um banco *
      *  de dados online. Para habilitar o modo online, edite o       *
      *  arquivo 'services/supabaseClient.ts'.                       *
      *                                                              *
      ****************************************************************
    `);
}

export const supabase = supabaseJs.createClient(supabaseUrl, supabaseAnonKey);