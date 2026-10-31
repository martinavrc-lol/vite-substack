/* =============================================================
   use-subscriptions.js — a que escritoras sigo ya
   se usa en Writers para saber si mostrar Follow o Unfollow
   ============================================================= */

import { useState, useEffect } from "react"

export const useSubscriptions = (apiUrl, token) => {
    const [subscriptions, setSubscriptions] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const getSubscriptions = async () => {
            if (!token) return

            try {
                const peticion = await fetch(`${apiUrl}/subscriptions`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const datos = await peticion.json()

                if (!active) return

                if (!peticion.ok) {
                    setError(datos.message)
                    return
                }

                setSubscriptions(datos.data)
            } catch {
                if (active) setError(`Could not connect to the server`)
            }
        }
        getSubscriptions()

        return () => { active = false }
    }, [apiUrl, token])

    return { subscriptions, setSubscriptions, error }
}
