/* =============================================================
   use-user.js — carga el perfil publico de un usuario por id
   ============================================================= */

import { useState, useEffect } from "react"

export const useUser = (apiUrl, id) => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const getUser = async () => {
            try {
                const peticion = await fetch(`${apiUrl}/users/${id}`)
                const datos = await peticion.json()

                if (!active) return

                if (!peticion.ok) {
                    setError(datos.message)
                    return
                }

                setUser(datos.data)
            } catch {
                if (active) setError(`Could not connect to the server`)
            }
        }
        getUser()

        return () => { active = false }
    }, [apiUrl, id])

    return { user, error }
}
