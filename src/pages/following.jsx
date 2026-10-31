/* =============================================================
   following.jsx — gente que ya segui (ruta /following, con sesion)
   para descubrir gente nueva: boton Follow en cada Postcard del Home
   ============================================================= */

import { useContext } from "react"
import { Link } from "react-router-dom"
import { SubstackContext } from "../context/substack-context"
import { useSubscriptions } from "@/hooks/use-subscriptions"
import { Avatar } from "@/components/avatar"

export const Following = () => {

    const { VITE_API_URL } = import.meta.env
    const { session } = useContext(SubstackContext)

    const { subscriptions, setSubscriptions, error } = useSubscriptions(VITE_API_URL, session?.token)

    // deja de seguirla
    const unfollow = async (authorId) => {
        const peticion = await fetch(`${VITE_API_URL}/subscriptions/${authorId}`, {
            method: `DELETE`,
            headers: { Authorization: `Bearer ${session?.token}` }
        })
        if (peticion.ok) setSubscriptions(subscriptions.filter(sub => sub.author._id !== authorId))
    }

    if (!session) return <section className="Following"><p className="Following-error">Sign in to see who you follow.</p></section>

    return (
        <section className="Following">

            <div className="Following-header">
                <h1 className="Following-h1">Following</h1>
            </div>

            {error && <p className="Following-error" role="alert">{error}</p>}
            {subscriptions.length === 0 && !error && (
                <p className="Following-empty">You are not following anyone yet. Follow a writer from the home feed.</p>
            )}

            <div className="Following-content">
                <ul className="Following-list">
                    {subscriptions.map(sub => (
                        <li key={sub.author._id} className="Following-item">
                            <Link to={`/users/${sub.author._id}`} className="Following-profile">
                                <Avatar name={sub.author.name} avatarUrl={sub.author.avatarUrl} />
                                <div className="Following-info">
                                    <p className="Following-name">{sub.author.name}</p>
                                </div>
                            </Link>
                            <button className="Following-unfollow" onClick={() => unfollow(sub.author._id)}>Unfollow</button>
                        </li>
                    ))}
                </ul>
            </div>

        </section>
    )
}
