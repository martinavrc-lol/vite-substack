/* =============================================================
   Postcard.jsx — tarjeta de post o note, reusada en Home, Feed y Dashboard
   type "note": solo el texto, sin titulo ni tags
   type "article" (default): titulo, extracto y tags, linkea al detalle
   Edit/Delete solo si isOwner y llegan updatePost/deletePost (Dashboard)
   Follow/Unfollow solo si llega canFollow (hoy solo lo pasa el Home)
   ============================================================= */

import { Link } from "react-router-dom"
import { Avatar } from "@/components/avatar"

export const Postcard = (props) => {

    const {
        _id, type, title, content, coverImage, author, createdAt,
        isOwner, updatePost, deletePost,
        canFollow, isFollowing, onFollow, onUnfollow
    } = props

    const isNote = type === 'note'

    return (
        <li className={`Postcard${isNote ? ' Postcard-note' : ''}`}>

            <div className="Postcard-metas">
                <Link to={`/users/${author?._id}`} className="Postcard-pfp">
                    <Avatar name={author?.name} avatarUrl={author?.avatarUrl} />
                    <p className="Postcard-name">
                        {author?.name}
                    </p>
                </Link>
                {canFollow && (
                    isFollowing
                        ? <button className="Button-inline Button-onclick" onClick={() => onUnfollow(author._id)}>Unfollow</button>
                        : <button className="Button-inline" onClick={() => onFollow(author._id)}>Follow</button>
                )}
            </div>

            {isNote ? (
                <p className="Postcard-excerpt">{content}</p>
            ) : (
                <>
                    <div className="Postcard-tumbnail">
                        {coverImage && (
                            <Link to={`/posts/${_id}`} className="Postcard-cover-link" tabIndex={-1} aria-hidden="true">
                                <img className="Postcard-cover" src={coverImage} alt="" loading="lazy" />
                            </Link>
                        )}
                        <div className="Postcard-sub">
                            <Link to={`/posts/${_id}`}><h2 className="Postcard-title">{title}</h2></Link>
                            <p className="Postcard-time">{new Date(createdAt).toLocaleDateString(`en-US`, { dateStyle: `long` })}</p>
                        </div>
                    </div>
                </>
            )}

            {isOwner && (
                <div className="Form-actions">
                    <button className="Button Button-ghost" onClick={() => updatePost(_id)}>Edit</button>
                    <button className="Button Button-danger" onClick={() => deletePost(_id)}>Delete</button>
                </div>
            )}

        </li>
    )
}
