/* =============================================================
   posts.jsx — home: lista publica de posts, solo lectura
   crear un post nuevo se hace desde el dialog "What's on your mind?";
   editar y borrar los propios posts se hace en el Dashboard
   ============================================================= */

import { useContext } from "react"
import { SubstackContext } from "../context/substack-context"
import { usePosts } from "@/hooks/use-posts"
import { useSubscriptions } from "@/hooks/use-subscriptions"
import { useDialog } from "@/hooks/use-dialogs"
import { Postcard } from "@/components/postcard"

export const Posts = () => {

    const { VITE_API_URL } = import.meta.env

    const { session } = useContext(SubstackContext)
    const { open } = useDialog()

    const { posts, error } = usePosts(VITE_API_URL)
    const { subscriptions, setSubscriptions } = useSubscriptions(VITE_API_URL, session?.token)

    const headers = {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${session?.token}`
    }

    const isFollowing = (authorId) => subscriptions.some(sub => sub.author._id === authorId)

    // sigue a una autora desde su post
    const follow = async (authorId) => {
        const peticion = await fetch(`${VITE_API_URL}/subscriptions/${authorId}`, { method: `POST`, headers })
        if (peticion.ok) setSubscriptions([...subscriptions, { author: { _id: authorId } }])
    }

    // deja de seguirla
    const unfollow = async (authorId) => {
        const peticion = await fetch(`${VITE_API_URL}/subscriptions/${authorId}`, { method: `DELETE`, headers })
        if (peticion.ok) setSubscriptions(subscriptions.filter(sub => sub.author._id !== authorId))
    }

    return (
        <section className="Post">

            <div className="Post-header">
                {!session && <h1 className="Post-h1">Welcome to Substack</h1>}
                {session && (
                    <button className="Button-writer" onClick={() => open('write-post')}>What's on your mind?</button>
                )}
            </div>

            {error && <p className="Post-error" role="alert">{error}</p>}

            <div className="Post-content">
                <ul className="Post-list">
                    {posts.map(post => (
                        <Postcard
                            key={post._id}
                            {...post}
                            canFollow={session && post.author?._id !== session.user._id}
                            isFollowing={isFollowing(post.author?._id)}
                            onFollow={follow}
                            onUnfollow={unfollow}
                        />
                    ))}
                </ul>
            </div>

        </section>
    )
}
