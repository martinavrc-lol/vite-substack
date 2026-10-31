/* =============================================================
   dialog-context.js — contexto del dialog activo (login o write-post)
   lo crea App.jsx, lo usa useDialog para abrir/cerrar
   ============================================================= */

import { createContext } from "react"

export const DialogContext = createContext()
