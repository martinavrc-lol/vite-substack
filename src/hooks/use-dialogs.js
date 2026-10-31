/* =============================================================
   use-dialogs.js — abrir/cerrar el dialog activo (login o write-post)
   currentView trae { name, payload } o null si no hay ninguno abierto
   ============================================================= */

import { useContext } from "react"
import { DialogContext } from "@/context/dialog-context"

export const useDialog = () => {
    const { dialog, setDialog } = useContext(DialogContext)

    // abre un dialog por nombre, con datos opcionales (ej. el post a editar)
    const open = (view, data = {}) => {
        setDialog({ name: view, payload: data })
    }

    // cierra el dialog activo
    const close = () => {
        setDialog(null)
    }

    return {
        open,
        close,
        currentView: dialog,
        isOpened: dialog !== null
    }
}
