/* =============================================================
   Avatar.jsx — foto de perfil; si no hay avatarUrl, muestra la
   inicial del nombre sobre un color generado a partir del nombre
   ============================================================= */

// genera un color estable a partir del nombre (mismo nombre, mismo color) (ayuda de la IA)
const colorFor = (name = ``) => {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    return `hsl(${hash % 360}, 55%, 55%)`
}

export const Avatar = ({ name, avatarUrl }) => {

    if (avatarUrl) return <img className="Avatar" src={avatarUrl} alt={name} />

    return (
        <span className="Avatar Avatar-fallback" style={{ background: colorFor(name) }}>
            {name?.charAt(0).toUpperCase()}
        </span>
    )
}
