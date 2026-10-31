// Rutas de la app, en un solo lugar para no repetir strings sueltos
export const ROUTES = {
    HOME: `/`,
    POST: `/posts/:id`,
    REGISTER: `/register`,
    FOLLOWING: `/following`,
    FEED: `/feed`,
    DASHBOARD: `/dashboard`,
    PROFILE: `/users/:id`
}

// Claves usadas en localStorage
export const SESSION_STORAGE_KEY = `session`
export const THEME_STORAGE_KEY = `theme`