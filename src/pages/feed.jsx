/* =============================================================
   feed.jsx — posts de las escritoras que sigo (ruta /feed, con sesion)
   ============================================================= */

import { useContext } from "react"
import { SubstackContext } from "../context/substack-context"
import { useFeed } from "@/hooks/use-feed"
import { Postcard } from "@/components/postcard"

export const Feed = () => {

    const { VITE_API_URL } = import.meta.env
    const { session } = useContext(SubstackContext)

    const { posts, error } = useFeed(VITE_API_URL, session?.token)

    if (!session) return <section className="Feed"><p className="Feed-error">Sign in to see your feed.</p></section>

    return (
        <section className="Feed">

            <div className="Feed-header">
                <h1 className="Feed-h1">Your feed</h1>
            </div>

            {error && <p className="Feed-error" role="alert">{error}</p>}
            {posts.length === 0 && !error && <p className="Feed-empty">Follow a writer to see their posts here.</p>}

            <div className="Feed-content">
                <ul className="Feed-list">
                    {posts.map(post => <Postcard key={post._id} {...post} />)}
                </ul>
            </div>

        </section>
    )
}
