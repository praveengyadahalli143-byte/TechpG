'use client'

import { Suspense, lazy, useState, useEffect, useCallback, useRef } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

const SCENE_URL = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'
const MAX_RETRIES = 4
const RETRY_DELAYS = [1500, 3000, 5000, 8000] // ms between retries

interface SplineSceneProps {
    scene: string
    className?: string
}

/* ─── Animated Robot Emoji Fallback ─── */
function RobotFallback({ loading = true }: { loading?: boolean }) {
    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '20px',
        }}>
            <div style={{ fontSize: '100px', animation: 'float 3s ease-in-out infinite' }}>🤖</div>
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    {/* Pulsing dots */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                        {[0, 0.2, 0.4].map((d, i) => (
                            <div
                                key={i}
                                style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: '#6C63FF',
                                    animation: `dot-pulse 1.2s ease-in-out ${d}s infinite`,
                                }}
                            />
                        ))}
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif", letterSpacing: '1px' }}>
                        Loading 3D scene…
                    </span>
                </div>
            )}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes dot-pulse {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
                    30% { transform: translateY(-8px); opacity: 1; }
                }
            `}</style>
        </div>
    )
}

/* ─── Inner component with retry logic ─── */
function SplineWithRetry({ scene, className }: SplineSceneProps) {
    const [key, setKey] = useState(0)          // bump to remount Spline
    const [retries, setRetries] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [failed, setFailed] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Clear any pending retry timer on unmount
    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

    const scheduleRetry = useCallback(() => {
        if (retries >= MAX_RETRIES) {
            setFailed(true)
            return
        }
        const delay = RETRY_DELAYS[retries] ?? 5000
        timerRef.current = setTimeout(() => {
            setRetries(r => r + 1)
            setKey(k => k + 1)   // remount the Spline component → fresh fetch
        }, delay)
    }, [retries])

    const handleLoad = useCallback(() => {
        setLoaded(true)
        setFailed(false)
    }, [])

    const handleError = useCallback(() => {
        if (!loaded) scheduleRetry()
    }, [loaded, scheduleRetry])

    // Also detect a "stuck" load: if Spline hasn't called onLoad within 12s, retry
    useEffect(() => {
        if (loaded || failed) return
        const stuckTimer = setTimeout(() => {
            if (!loaded) scheduleRetry()
        }, 12000)
        return () => clearTimeout(stuckTimer)
    }, [key, loaded, failed, scheduleRetry])

    if (failed) return <RobotFallback loading={false} />

    return (
        <Spline
            key={key}
            scene={scene}
            className={className}
            onLoad={handleLoad}
            onError={handleError}
        />
    )
}

/* ─── Public export wrapping in Suspense ─── */
export function SplineScene({ scene, className }: SplineSceneProps) {
    return (
        <Suspense fallback={<RobotFallback loading={true} />}>
            <SplineWithRetry scene={scene} className={className} />
        </Suspense>
    )
}

/* ─── Preload helper — call this early to warm the CDN connection ─── */
export function preloadSplineScene(url: string = SCENE_URL) {
    if (typeof window === 'undefined') return
    // DNS prefetch + preconnect for Spline CDN
    const domains = [
        'https://prod.spline.design',
        'https://unpkg.com',
    ]
    domains.forEach(href => {
        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link')
            link.rel = 'preconnect'
            link.href = href
            link.crossOrigin = 'anonymous'
            document.head.appendChild(link)
        }
    })
    // Prefetch the actual scene file
    if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = url
        link.as = 'fetch'
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
    }
}
