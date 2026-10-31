/* =============================================================
   dashboard.jsx — mis posts: editar y borrar (ruta /dashboard, con sesion)
   crear un post nuevo se hace desde el dialog "What's on your mind?"
   ============================================================= */

import { useContext } from "react"
import { Link } from "react-router-dom"
import { SubstackContext } from "../context/substack-context"
import { useMyPosts } from "@/hooks/use-my-posts"
import { useDialog } from "@/hooks/use-dialogs"

export const Dashboard = () => {

    const { VITE_API_URL } = import.meta.env
    const { session } = useContext(SubstackContext)
    const { open } = useDialog()

    const { posts, setPosts, error, setError, loading } = useMyPosts(VITE_API_URL, session?.token)

    // abre el dialog de escritura en modo edit, con este post precargado
    const updatePost = (_id) => {
        const post = posts.find(post => post._id === _id)
        open('write-post', {
            mode: 'edit',
            post,
            onSuccess: (updated) => setPosts(posts.map(p => p._id === updated._id ? updated : p))
        })
    }

    // DELETE: borra un post propio
    const deletePost = async (_id) => {
        setError(``)

        try {
            const peticion = await fetch(`${VITE_API_URL}/posts/${_id}`, {
                method: `DELETE`,
                headers: { Authorization: `Bearer ${session.token}` }
            })
            const datos = await peticion.json()

            if (!peticion.ok) {
                setError(datos.message)
                return
            }

            setPosts(posts.filter(post => post._id !== _id))
        } catch {
            setError(`Could not connect to the server`)
        }
    }

    if (!session) return <section className="Dashboard"><p className="Dashboard-error">Sign in to see your dashboard.</p></section>

    return (
        <section className="Dashboard">

            <div className="Dashboard-header">
                <h1 className="Dashboard-h1">Your dashboard</h1>

                {error && <p className="Dashboard-error" role="alert">{error}</p>}

                <button className="Button-writer" onClick={() => open('write-post', {
                    onSuccess: (created) => setPosts([created, ...posts])
                })}>Write a new post</button>
            </div>

            <div className="Dashboard-content">
                {loading && <p className="Dashboard-loading">Loading...</p>}
                {!loading && posts.length === 0 && !error && <p className="Dashboard-empty">You have not published anything yet.</p>}

                <ul className="Dashboard-list">
                    {posts.map(post => (
                        <li key={post._id} className="Dashboard-item">
                            <div className="Dashboard-info">
                                <Link to={`/posts/${post._id}`}>{post.title || post.content}</Link>
                                <p className="Postcard-time">{new Date(post.createdAt).toLocaleDateString(`en-US`, { dateStyle: `long` })}</p>
                            </div>
                            <div className="Dashboard-actions">
                                <button className="Dashboard-edit" onClick={() => updatePost(post._id)}>Edit</button>
                                <button className="Dashboard-delete" onClick={() => deletePost(post._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </section>
    )
}
