/* =============================================================
   use-posts.js — carga el listado publico de posts (Home)
   ============================================================= */

import { useState, useEffect } from "react"

export const usePosts = (apiUrl) => {
    const [posts, setPosts] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const getPosts = async () => {
            try {
                const peticion = await fetch(`${apiUrl}/posts`)
                const datos = await peticion.json()

                if (!active) return

                if (!peticion.ok) {
                    setError(datos.message)
                    return
                }

                setPosts(datos.data)
            } catch {
                if (active) setError(`Could not connect to the server`)
            }
        }
        getPosts()

        return () => { active = false }
    }, [apiUrl])

    return { posts, setPosts, error, setError }
}
