/* =============================================================
   use-feed.js — carga los posts de las escritoras que sigo
   pide el token: solo tiene sentido con sesion iniciada
   ============================================================= */

import { useState, useEffect } from "react"

export const useFeed = (apiUrl, token) => {
    const [posts, setPosts] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const getFeed = async () => {
            if (!token) return

            try {
                const peticion = await fetch(`${apiUrl}/posts/feed`, {
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
            }
        }
        getFeed()

        return () => { active = false }
    }, [apiUrl, token])

    return { posts, error }
}
