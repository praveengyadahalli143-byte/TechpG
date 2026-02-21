'use client'

import { Suspense, lazy, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
    scene: string
    className?: string
}

function RobotFallback() {
    return (
        <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '16px'
        }}>
            <div style={{ fontSize: '120px', animation: 'float 3s ease-in-out infinite' }}>🤖</div>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    )
}

function SplineWithFallback({ scene, className }: SplineSceneProps) {
    const [failed, setFailed] = useState(false)

    if (failed) return <RobotFallback />

    return (
        <Spline
            scene={scene}
            className={className}
            onError={() => setFailed(true)}
        />
    )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
    return (
        <Suspense fallback={<RobotFallback />}>
            <SplineWithFallback scene={scene} className={className} />
        </Suspense>
    )
}
