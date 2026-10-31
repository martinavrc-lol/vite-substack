/* =============================================================
   profile.jsx — perfil publico de un usuario (ruta /users/:id)
   su info y sus posts/notes; si no soy yo, boton follow/unfollow
   ============================================================= */

import { useContext } from "react"
import { useParams } from "react-router-dom"
import { SubstackContext } from "../context/substack-context"
import { useUser } from "@/hooks/use-user"
import { useUserPosts } from "@/hooks/use-user-posts"
import { useSubscriptions } from "@/hooks/use-subscriptions"
import { Avatar } from "@/components/avatar"
import { Postcard } from "@/components/postcard"

export const Profile = () => {

    const { VITE_API_URL } = import.meta.env
    const { id } = useParams()
    const { session } = useContext(SubstackContext)

    const { user, error } = useUser(VITE_API_URL, id)
    const { posts } = useUserPosts(VITE_API_URL, id)
    const { subscriptions, setSubscriptions } = useSubscriptions(VITE_API_URL, session?.token)

    const headers = {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${session?.token}`
    }

    const isFollowing = subscriptions.some(sub => sub.author._id === id)
    const canFollow = session && session.user._id !== id

    // sigue a este perfil
    const follow = async () => {
        const peticion = await fetch(`${VITE_API_URL}/subscriptions/${id}`, { method: `POST`, headers })
        if (peticion.ok) setSubscriptions([...subscriptions, { author: { _id: id } }])
    }

    // deja de seguirlo
    const unfollow = async () => {
        const peticion = await fetch(`${VITE_API_URL}/subscriptions/${id}`, { method: `DELETE`, headers })
        if (peticion.ok) setSubscriptions(subscriptions.filter(sub => sub.author._id !== id))
    }

    if (error) return <section className="Profile"><p className="Profile-error" role="alert">{error}</p></section>
    if (!user) return <section className="Profile"><p className="Profile-loading">Loading...</p></section>

    return (
        <section className="Profile">

            <div className="Profile-header">

                <div className="Profile-info">
                    <h1 className="Profile-name">{user.name}</h1>
                    <Avatar name={user.name} avatarUrl={user.avatarUrl} />
                </div>

                {user.bio && <p className="Profile-bio">{user.bio}</p>}

                <div className="Profile-follows">
                    {canFollow && (
                        isFollowing
                            ? <button className="Button Button-ghost Follow" onClick={unfollow}>Unfollow</button>
                            : <button className="Button Follow" onClick={follow}>Follow</button>
                    )}
                    <button className="Button Follow">Message</button>
                </div>
            </div>

            <div className="Profile-posts">
                <h2 className="Profile-heading">Posts</h2>
                <div className="Profile-bar" />
            </div>

            <ul className="Profile-list">
                {posts.map(post => <Postcard key={post._id} {...post} />)}
            </ul>

        </section>
    )
}
