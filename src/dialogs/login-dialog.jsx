/* =============================================================
   login-dialog.jsx — version popup del login
   misma logica que la pagina de login, pero cierra el dialog
   en vez de navegar
   ============================================================= */

import { useState, useRef, useContext } from "react"
import { NavLink } from "react-router-dom"
import { SubstackContext } from "@/context/substack-context"
import { useDialog } from "@/hooks/use-dialogs"
import { ROUTES } from "@/const/config"

export const LoginDialog = () => {

    const { VITE_API_URL } = import.meta.env

    const { setSession } = useContext(SubstackContext)
    const { close } = useDialog()

    const [error, setError] = useState('')
    const formLogin = useRef(null)

    // envia el login a la API
    const loginPost = async (e) => {
        e.preventDefault()
        setError(``)

        const { email, password } = formLogin.current

        const find = {
            email: email.value,
            password: password.value
        }

        const options = {
            method: `POST`,
            headers: {
                "Content-Type": `application/json`
            },
            body: JSON.stringify(find)
        }

        try {
            const peticion = await fetch(`${VITE_API_URL}/auth/login`, options)
            const datos = await peticion.json()

            if (!peticion.ok) {
                setError(datos.message)
                return
            }

            // datos.data trae { user , token }
            setSession(datos.data)
            close()
        } catch {
            setError(`Could not connect to the server`)
        }
    }

    return (
        <form className="Form" ref={formLogin} onSubmit={loginPost}>
            <h1>Sign in</h1>
            <label>Email<input type="email" name="email" placeholder="Enter your email" required /></label>
            <label>Password<input type="password" name="password" placeholder="Enter your password" required /></label>
            {error && <p className="Status Status-error" role="alert">{error}</p>}
            <input className="Button" type="submit" value="Sign in" />
            <p className="Form-hint">Don't have an account? <NavLink to={ROUTES.REGISTER} onClick={close}>Create account</NavLink></p>
        </form>
    )
}
