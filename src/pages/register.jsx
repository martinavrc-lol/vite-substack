/* =============================================================
   Register.jsx — formulario de registro
   crea la cuenta en la API, inicia sesion y lleva a los posts.
   Cualquier cuenta puede publicar, no hay roles.
   ============================================================= */

import { useState , useRef , useContext } from "react"
import { useNavigate } from "react-router-dom"
import { SubstackContext } from "../context/substack-context"
import { useDialog } from "@/hooks/use-dialogs"
import { ROUTES } from "@/const/config"

export const Register = () => {

    const navigate = useNavigate()
    const { VITE_API_URL } = import.meta.env

    const { setSession } = useContext(SubstackContext)
    const { open } = useDialog()

    // mensaje de error que viene de la API (o de la conexion)
    const [ error , setError ] = useState(``)

    const formPost = useRef(null)

    // envia el registro a la API
    const registerPost = async (e) => {
        e.preventDefault()
        setError(``)

        const { name, email, password } = formPost.current

        const newUser = {
            name: name.value,
            email: email.value,
            password: password.value,
        }

        const options = {
            method: `POST`,
            headers: {
                "Content-Type": `application/json`
            },
            body: JSON.stringify(newUser)
        }

        try {
            const peticion = await fetch(`${VITE_API_URL}/auth/register`, options)
            const datos = await peticion.json()

            if (!peticion.ok) {
                setError(datos.message)
                return
            }

            // datos.data trae { user , token }
            setSession(datos.data)
            navigate(ROUTES.HOME)
        } catch {
            setError(`Could not connect to the server`)
        }
    }

    return (
        <section className="Register">
            <form className="Register-form" ref={formPost} onSubmit={registerPost}>
                <h1 className="Register-h1">Create account</h1>
                <label className="Register-field">Name<input type="text" name="name" placeholder="Enter your name" required /></label>
                <label className="Register-field">Email<input type="email" name="email" placeholder="Enter your email" required /></label>
                <label className="Register-field">Password<input type="password" name="password" placeholder="Enter your password" required /></label>
                {error && <p className="Register-error" role="alert">{error}</p>}
                <input className="Register-submit" type="submit" value="Create account" />
                <p className="Register-hint">Already have an account? <button className="Register-hint-link" onClick={() => open('login')}>Sign in</button></p>
            </form>
        </section>
    )
}
