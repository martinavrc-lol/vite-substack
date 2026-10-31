/* =============================================================
   Header.jsx — cabecera con logo, navegacion y cierre de sesion
   los enlaces cambian si hay sesion iniciada o no
   en mobile (768px para abajo), nav y sesion se esconden detras
   de un boton hamburguesa; el tema queda siempre visible
   ============================================================= */

import { useContext, useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"
import { SubstackContext } from "../context/substack-context"
import { useDialog } from "@/hooks/use-dialogs"
import { Avatar } from "@/components/avatar"
import { ROUTES } from "@/const/config"

export const Header = () => {

    const navigate = useNavigate()

    // sesion global: es null si nadie ha iniciado sesion
    const { session, setSession, theme, toggleTheme } = useContext(SubstackContext)
    const { open } = useDialog()

    // menu hamburguesa: solo tiene efecto visual por debajo de 768px
    const [isOpen, setIsOpen] = useState(false)
    const closeMenu = () => setIsOpen(false)

    // cierra la sesion y vuelve al login
    let logOut = () => {
        setSession(null)
        closeMenu()
        navigate(ROUTES.HOME)
    }

    return (
        <header className="Header">
            <div className="Header-inner">

                <div className="Header-up">
                    <div className="Header-icons">
                        <NavLink className="Header-logo" to={ROUTES.HOME} onClick={closeMenu}>
                            <img className="Header-icon" src="/substack-icon.svg" alt="Substack" />
                        </NavLink>
                        <button
                            className="Header-theme"
                            onClick={toggleTheme}
                            aria-label={theme === `dark` ? `Switch to light theme` : `Switch to dark theme`}
                        >
                            {theme === `dark` ? ( // (ayuda de la IA)
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                            )}
                        </button>
                        <button
                            className="Header-burger"
                            onClick={() => setIsOpen(prev => !prev)}
                            aria-label={isOpen ? `Close menu` : `Open menu`}
                            aria-expanded={isOpen}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                {isOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
                            </svg>
                        </button>
                    </div>

                    <nav className={`Header-nav${isOpen ? ' isOpen' : ''}`}>
                        <NavLink to={ROUTES.HOME} onClick={closeMenu}>Posts</NavLink>
                        {session && <NavLink to={ROUTES.FOLLOWING} onClick={closeMenu}>Following</NavLink>}
                        {session && <NavLink to={ROUTES.FEED} onClick={closeMenu}>Feed</NavLink>}
                        {session && <NavLink to={ROUTES.DASHBOARD} onClick={closeMenu}>Dashboard</NavLink>}
                        {!session && <button onClick={() => { closeMenu(); open('login') }}>Sign in</button>}
                        {!session && <NavLink to={ROUTES.REGISTER} onClick={closeMenu}>Create account</NavLink>}
                    </nav>
                </div>

                <div className={`Header-actions${isOpen ? ' isOpen' : ''}`}>
                    {session && (
                        <>
                            <div className="Header-sign">
                                <Avatar name={session.user.name} avatarUrl={session.user.avatarUrl} />
                                <span className="Header-user">Hi, {session.user.name}</span>
                            </div>
                            <button className="Button Button-ghost strech" onClick={logOut}>Sign out</button>
                        </>
                    )}
                </div>

            </div>
        </header>
    )
}
