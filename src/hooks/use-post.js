/* =============================================================
   use-post.js — carga un solo post por id (para la pagina de detalle)
   ============================================================= */

import { useState, useEffect } from "react"

export const usePost = (apiUrl, id) => {
    const [post, setPost] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const getPost = async () => {
            try {
                const peticion = await fetch(`${apiUrl}/posts/${id}`)
                const datos = await peticion.json()

                if (!active) return

                if (!peticion.ok) {
                    setError(datos.message)
                    return
                }

                setPost(datos.data)
            } catch {
                if (active) setError(`Could not connect to the server`)
            }
        }
        getPost()

        return () => { active = false }
    }, [apiUrl, id])

    return { post, error }
}
