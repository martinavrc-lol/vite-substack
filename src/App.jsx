/* =============================================================
   App.jsx — componente principal
   crea el contexto de la sesion y define las rutas de la app
   ============================================================= */

import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { SubstackContext } from './context/substack-context'
import { DialogContext } from './context/dialog-context'
import { Header } from './components/header'
import { Footer } from './components/footer'
import { DialogRoot } from './dialogs/dialog-root'
import { ROUTES, SESSION_STORAGE_KEY, THEME_STORAGE_KEY } from '@/const/config'

const Posts = lazy(() => import('./pages/posts').then(m => ({ default: m.Posts })))
const Register = lazy(() => import('./pages/register').then(m => ({ default: m.Register })))
const Post = lazy(() => import('./pages/post').then(m => ({ default: m.Post })))
const Following = lazy(() => import('./pages/following').then(m => ({ default: m.Following })))
const Profile = lazy(() => import('./pages/profile').then(m => ({ default: m.Profile })))
const Feed = lazy(() => import('./pages/feed').then(m => ({ default: m.Feed })))
const Dashboard = lazy(() => import('./pages/dashboard').then(m => ({ default: m.Dashboard })))

function App() {

    // sesion global: { user , token } o null si nadie ha iniciado sesion
    const [session, setSession] = useState(() => {
        const saved = localStorage.getItem(SESSION_STORAGE_KEY)
        return saved ? JSON.parse(saved) : null
    })

    const [dialog, setDialog] = useState(null)

    // tema: 'light' o 'dark'; empieza con lo guardado o lo del sistema
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY)
        if (saved) return saved
        return window.matchMedia(`(prefers-color-scheme: dark)`).matches ? `dark` : `light`
    })

    // alterna el tema y lo guarda
    const toggleTheme = () => {
        setTheme(prev => prev === `dark` ? `light` : `dark`)
    }

    useEffect(() => {
        if (session) {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
        } else {
            localStorage.removeItem(SESSION_STORAGE_KEY)
        }
    }, [session])

    useEffect(() => {
        document.documentElement.setAttribute(`data-theme`, theme)
        localStorage.setItem(THEME_STORAGE_KEY, theme)
    }, [theme])

    return (
        <SubstackContext.Provider value={{ session, setSession, theme, toggleTheme }}>
            <DialogContext.Provider value={{dialog, setDialog}}>

            <BrowserRouter>

                <div className='Header-main'>
                    <Header />

                    <main>
                        <div className="Main-content">
                            <Suspense fallback={<p>Loading...</p>}>
                                <Routes>

                                    <Route path={ROUTES.HOME} element={<Posts />} />
                                    <Route path={ROUTES.POST} element={<Post />} />
                                    <Route path={ROUTES.REGISTER} element={<Register />} />
                                    <Route path={ROUTES.FOLLOWING} element={<Following />} />
                                    <Route path={ROUTES.PROFILE} element={<Profile />} />
                                    <Route path={ROUTES.FEED} element={<Feed />} />
                                    <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

                                </Routes>
                            </Suspense>
                        </div>

                        <Footer />
                    </main>
                </div>

                <DialogRoot />

            </BrowserRouter>

            </DialogContext.Provider>

        </SubstackContext.Provider>
    )
}

export default App
