"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@src/assets/logo.png"
import { AuthSection } from './AuthSection';
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";


const SearchSide = dynamic(() => import('@src/components/common/SearchSide'), { ssr: false });

export const Header = () => {

    const pathname = usePathname();
    const showSearch = pathname === "/";
    const authPath = pathname.startsWith("/auth");
    const [open, setOpen] = useState(false);
    const { data: session } = useSession();

    if (authPath) {
        return null;
    }

    return (
        <header className="py-2 px-4 sm:px-6 bg-background-tertiary sticky top-0 w-full z-50 shadow-md">
            <div className="flex items-center justify-between max-w-7xl mx-auto my-2">
                <div className="flex items-center gap-3 min-w-0">
                    <Link href="/" className="flex items-center gap-3 text-background-secondary font-bold truncate">
                        <Image className="w-15 h-auto sm:w-20" src={Logo} alt="Logo" priority />
                        <div className="hidden sm:block font-sans leading-tight text-sm">
                            Centro Cultural
                            <br />
                            Amador Ballumbrioso
                        </div>
                    </Link>
                </div>

                {/* Search: visible on md and up */}
                <div className="flex-1 px-4 hidden md:block">
                    {showSearch && <SearchSide placeholder="Buscar un evento..." />}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        aria-label="Abrir menú"
                        onClick={() => setOpen(true)}
                        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-background-secondary hover:bg-bg-alternative"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="min-w-fit ml-2 hidden md:block">
                        <AuthSection />
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
            <AnimatePresence>
                {open && (
                    <motion.div key="mobile-panel" className="fixed inset-0 z-40 md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

                        <motion.aside
                            role="dialog"
                            aria-modal="true"
                            className="absolute top-0 left-0 w-11/12 max-w-xs h-full bg-background p-4 shadow-lg overflow-auto"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.28 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Link href="/" className="flex items-center gap-2">
                                    <Image className="w-10 h-auto" src={Logo} alt="Logo" priority />
                                    <span className="font-bold text-sm text-background-secondary">Centro Cultural</span>
                                </Link>
                                <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="p-2 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-background-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Session summary */}
                            {/* <div className="mb-4">
                                {session?.user ? (
                                    <div className="flex items-center gap-3 p-3 rounded-md bg-white/80">
                                        <div className="bg-background-little-1 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">{session.user.firstName?.[0]?.toUpperCase() || ''}</div>
                                        <div className="truncate">
                                            <p className="text-sm font-semibold text-background-secondary truncate">{session.user.firstName} {session.user.lastName || ''}</p>
                                            <p className="text-xs text-gray-600 truncate">{session.user.email}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-md bg-white/80">
                                        <p className="text-sm">No has iniciado sesión</p>
                                        <Link href={`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`} className="text-sm text-background-secondary underline">Iniciar sesión</Link>
                                    </div>
                                )}
                            </div> */}

                            {showSearch && <div className="mb-4"><SearchSide placeholder="Buscar un evento..." /></div>}

                            <div className="mt-2">
                                <AuthSection />
                            </div>

                            {/* <nav className="mt-6 space-y-2">
                                <Link href="/" className="block px-3 py-2 rounded-md hover:bg-bg-alternative">Inicio</Link>
                                <Link href="/myevents" className="block px-3 py-2 rounded-md hover:bg-bg-alternative">Mis eventos</Link>
                                <Link href="/profile" className="block px-3 py-2 rounded-md hover:bg-bg-alternative">Perfil</Link>
                            </nav> */}
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    )

}

export default Header;