/* =============================================================
   use-user-posts.js — posts y notes publicados por un usuario
   ============================================================= */

import { useState, useEffect } from "react"

export const useUserPosts = (apiUrl, id) => {
    const [posts, setPosts] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const getUserPosts = async () => {
            try {
                const peticion = await fetch(`${apiUrl}/posts?author=${id}`)
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
        getUserPosts()

        return () => { active = false }
    }, [apiUrl, id])

    return { posts, error }
}
