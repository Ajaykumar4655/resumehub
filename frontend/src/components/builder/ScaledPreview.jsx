import { useLayoutEffect, useRef, useState } from 'react'

const DOC_WIDTH = 794 // 210mm at 96 DPI
const DOC_HEIGHT = 1123 // 297mm at 96 DPI (exact A4 single page)

export default function ScaledPreview({ children, scale: explicitScale = null }) {
    const outerRef = useRef(null)
    const innerRef = useRef(null)
    const [computedScale, setComputedScale] = useState(explicitScale || 0.6)

    useLayoutEffect(() => {
        if (explicitScale) {
            setComputedScale(explicitScale)
            return
        }

        const outer = outerRef.current
        if (!outer) return

        const updateScale = () => {
            const containerWidth = outer.parentElement ? outer.parentElement.clientWidth : outer.clientWidth
            if (containerWidth > 0) {
                // Leave a little margin (20px) so the shadow and edges fit comfortably
                const newScale = Math.min(0.85, Math.max(0.4, (containerWidth - 24) / DOC_WIDTH))
                setComputedScale(newScale)
            }
        }

        updateScale()

        const observer = new ResizeObserver(updateScale)
        if (outer.parentElement) {
            observer.observe(outer.parentElement)
        }
        observer.observe(outer)

        return () => observer.disconnect()
    }, [explicitScale])

    const width = DOC_WIDTH * computedScale
    const height = DOC_HEIGHT * computedScale

    return (
         <div
            style={{
                width: "100%",
                height: height,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
    
            }}
        >
        <div
            ref={outerRef}
            className="scaled-preview-outer"
            style={{
                width: width,
                height: height,
                margin: "0 auto",
                overflow: "hidden",
                position: "relative",
                flexShrink: 0,
                
            }}
        >
            <div
                ref={innerRef}
                className="scaled-preview-inner"
                style={{
                    width: DOC_WIDTH,
                    height: DOC_HEIGHT,
                    transform: `scale(${computedScale})`,
                    transformOrigin: "top left",
                    overflow: "hidden",
                }}
            >
                {children}
            </div>
        </div>
        </div>
    )
}