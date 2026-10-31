/* =============================================================
   post.jsx — detalle de un post (ruta /posts/:id)
   ============================================================= */

import { useParams, Link } from "react-router-dom"
import { usePost } from "@/hooks/use-post"
import { ROUTES } from "@/const/config"

export const Post = () => {

    const { VITE_API_URL } = import.meta.env
    const { id } = useParams()

    const { post, error } = usePost(VITE_API_URL, id)

    if (error) return <section className="PostDetail"><p className="PostDetail-error" role="alert">{error}</p></section>
    if (!post) return <section className="PostDetail"><p className="PostDetail-loading">Loading...</p></section>

    return (
        <section className="PostDetail">

            <div className="PostDetail-header">
                <p className="PostDetail-meta">
                    {post.author?.name} · {new Date(post.createdAt).toLocaleDateString(`en-US`, { dateStyle: `long` })}
                </p>
                {post.title && <h1 className="PostDetail-h1">{post.title}</h1>}
            </div>

            <div className="PostDetail-content">
                <p className="PostDetail-body">{post.content}</p>

                <ul className="PostDetail-tags">
                    {post.tags.map(tag => <li key={tag} className="PostDetail-tag">#{tag}</li>)}
                </ul>
            </div>

            <div className="PostDetail-footer">
                <Link to={ROUTES.HOME} className="PostDetail-back">Back to posts</Link>
            </div>

        </section>
    )
}
