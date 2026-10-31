/* =============================================================
   write-dialog.jsx — popup para crear o editar un post
   mode "create" (default): POST /posts, usado desde Home
   mode "edit": PUT /posts/:id, usado desde el Dashboard, precarga
   los datos del post recibido por payload
   onSuccess (opcional, por payload): para que quien abrio el dialog
   actualice su propia lista sin volver a pedirla entera
   ============================================================= */

import { useState, useRef, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { SubstackContext } from "@/context/substack-context"
import { useDialog } from "@/hooks/use-dialogs"
import { ROUTES } from "@/const/config"

export const WriteDialog = () => {

    const { VITE_API_URL } = import.meta.env

    const { session } = useContext(SubstackContext)
    const { close, currentView } = useDialog()
    const navigate = useNavigate()

    const { mode = 'create', post, onSuccess } = currentView?.payload ?? {}

    const [error, setError] = useState('')
    // controla solo que campos se ven; article tiene titulo y tags, note no
    const [type, setType] = useState(post?.type ?? 'article')
    const formWrite = useRef(null)

    // convierte "filosofia, vida" en ["filosofia", "vida"]
    const splitTags = (text) => text.split(`,`).map(tag => tag.trim()).filter(Boolean)

    // CREATE o UPDATE segun el mode
    const savePost = async (e) => {
        e.preventDefault()
        setError(``)

        const { content, title, tags, coverImage } = formWrite.current

        const body = type === 'note'
            ? { type, content: content.value }
            : { type, content: content.value, title: title.value, tags: splitTags(tags.value), coverImage: coverImage?.value.trim() || '' }

        const url = mode === 'edit' ? `${VITE_API_URL}/posts/${post._id}` : `${VITE_API_URL}/posts`

        const options = {
            method: mode === 'edit' ? `PUT` : `POST`,
            headers: {
                "Content-Type": `application/json`,
                Authorization: `Bearer ${session?.token}`
            },
            body: JSON.stringify(body)
        }

        try {
            const peticion = await fetch(url, options)
            const datos = await peticion.json()

            if (!peticion.ok) {
                setError(datos.message)
                return
            }

            close()

            if (onSuccess) {
                onSuccess(datos.data)
            } else if (mode === 'create') {
                navigate(ROUTES.DASHBOARD)
            }
        } catch {
            setError(`Could not connect to the server`)
        }
    }

    return (
        <form className="Form Form-wide" ref={formWrite} onSubmit={savePost}>
            <h1>{mode === 'edit' ? 'Edit post' : "What's on your mind?"}</h1>
            <label>
                Type
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="article">Article</option>
                    <option value="note">Note</option>
                </select>
            </label>
            {type === 'article' && (
                <label>Title<input type="text" name="title" defaultValue={post?.title} placeholder="Enter the title" required /></label>
            )}
            {type === 'article' && (
                <label>Cover image URL<input type="text" name="coverImage" defaultValue={post?.coverImage} placeholder="https://..." /></label>
            )}
            <label>
                Content
                <textarea
                    name="content"
                    defaultValue={post?.content}
                    placeholder={type === 'note' ? 'Share a quick thought' : 'Write your text'}
                    required
                ></textarea>
            </label>
            {type === 'article' && (
                <label>Tags<input type="text" name="tags" defaultValue={post?.tags?.join(', ')} placeholder="philosophy, life" /></label>
            )}
            {error && <p className="Status Status-error" role="alert">{error}</p>}
            <input className="Button" type="submit" value={mode === 'edit' ? 'Save changes' : 'Publish'} />
        </form>
    )
}
