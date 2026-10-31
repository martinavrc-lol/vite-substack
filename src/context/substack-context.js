/* =============================================================
   substack-context.js — contexto global de la app
   guarda { user , token } cuando alguien inicia sesion,
   o null si no hay nadie. Tambien lleva el tema (light/dark)
   y su toggle. Lo crea App.jsx y lo leen los componentes.
   ============================================================= */

import { createContext } from 'react'

// contexto global (se usa con useContext en los componentes)
export const SubstackContext = createContext()
