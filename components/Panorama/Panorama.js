import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import getTexturePath from "../../helpers/getTexturePath";

/**
 * Creates a Panorama of a star field.
 *
 * @author Eric Keränen
 * @returns {JSX.Element}
 * @constructor
 */
export default function Panorama() {

    /**
     * Reference to which the renderer will be mounted.
     * @type {React.MutableRefObject<null>}
     */
    const mountRef = useRef(null)

    /**
     * Create a simple scene for an environment map.
     * Camera will follow mouse movement.
     */
    useEffect(() => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(getTexturePath("Cubemap"))

        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(WIDTH, HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.getContext().canvas.addEventListener('webglcontextlost', function(event) {
            event.preventDefault()
            cancelAnimationFrame(requestID)
        })

        mountRef.current?.appendChild(renderer.domElement)

        // Credit: https://jsfiddle.net/0rdekspn/
        const mouse = new THREE.Vector2()
        const target = new THREE.Vector2()
        const windowHalf = new THREE.Vector2(WIDTH / 2, HEIGHT / 2)

        document.addEventListener( 'mousemove', onMouseMove, false )
        window.addEventListener( 'resize', onResize, false )

        /**
         * Update mouse position.
         * @param event is used to get the position form the client.
         */
        function onMouseMove(event) {
            mouse.x = event.clientX - windowHalf.x
            mouse.y = event.clientY - windowHalf.x
        }

        /**
         * Resize the renderer that it will fit the window size always.
         */
        function onResize() {
            windowHalf.set(window.innerWidth / 2, window.innerHeight / 2)

            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        let requestID

        /**
         * Rotate camera depending on the mouse position.
         * Render the scene every second (needed even though the scene is static)
         */
        const animate = function () {
            requestID = requestAnimationFrame(animate)

            target.x = (1 - mouse.x) * 0.001
            target.y = (1 - mouse.y) * 0.001
            camera.rotation.x += 0.01 * (target.y - camera.rotation.x)
            camera.rotation.y += 0.01 * (target.x - camera.rotation.y)

            renderer.render(scene, camera)
        }

        animate()

        return () => {
            mountRef.current?.removeChild(renderer.domElement)
            // Bad practice to force context loss, but gets the job done
            renderer.forceContextLoss()
        }
    }, [])

    return <div ref={mountRef} style={{position: "fixed"}}/>
}
