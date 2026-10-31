/* =============================================================
   use-my-posts.js — carga mis propios posts (incluye borradores)
   es el mismo patron de use-posts.js, pero con setPosts expuesto
   para que el dashboard actualice la lista tras crear, editar o borrar
   ============================================================= */

import { useState, useEffect } from "react"

export const useMyPosts = (apiUrl, token) => {
    const [posts, setPosts] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        const getMyPosts = async () => {
            if (!token) return

            setLoading(true)

            try {
                const peticion = await fetch(`${apiUrl}/posts/mine`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const datos = await peticion.json()

                if (!active) return

                if (!peticion.ok) {
                    setError(datos.message)
                    return
                }

                setPosts(datos.data)
            } catch {
                if (active) setError(`Could not connect to the server`)
            } finally {
                if (active) setLoading(false)
            }
        }
        getMyPosts()

        return () => { active = false }
    }, [apiUrl, token])

    return { posts, setPosts, error, setError, loading }
}
