/* =============================================================
   dialog-root.jsx — muestra el dialog activo (si hay alguno)
   segun currentView.name del useDialog
   ============================================================= */

import { useDialog } from "@/hooks/use-dialogs"
import { LoginDialog } from "@/dialogs/login-dialog"
import { WriteDialog } from "@/dialogs/write-dialog"

export const DialogRoot = () => {

    const {currentView, close } = useDialog()

    if (!currentView) return null

    return (
        <div className="Dialog-overlay" onClick={close}>
            <div className="Dialog-box" onClick={(e) => e.stopPropagation()}>
                <button className="Dialog-close" onClick={close} aria-label="Close">×</button>

                {currentView.name === 'login' && <LoginDialog />}
                {currentView.name === 'write-post' && <WriteDialog />}
            </div>
        </div>
    )
}
