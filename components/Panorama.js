import * as THREE from 'three'
import { useEffect, useRef } from 'react'


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
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

        const cubemap = 'cubemap/'
        const images = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']
        const loader = new THREE.CubeTextureLoader()
        /**
         * Load textures from 'cubemap' folder, creating a cubemap for the background of the scene.
         */
        scene.background = loader.setPath(cubemap).load(images)

        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(WIDTH, HEIGHT)

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
            windowHalf.set(WIDTH / 2, HEIGHT / 2)

            camera.aspect = WIDTH / HEIGHT
            camera.updateProjectionMatrix()
            renderer.setSize(WIDTH, HEIGHT)
        }
        // End of credit

        /**
         * Rotate camera depending on the mouse position.
         * Render the scene every second (needed even though the scene is static)
         */
        const animate = function () {
            target.x = (1 - mouse.x) * 0.001
            target.y = (1 - mouse.y) * 0.001
            camera.rotation.x += 0.01 * (target.y - camera.rotation.x)
            camera.rotation.y += 0.01 * (target.x - camera.rotation.y)

            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }

        animate()

        /**
         * Remove the renderer from the mount.
         */
        return () => mountRef.current?.removeChild(renderer.domElement)
    }, [])

    return <div ref={mountRef} style={{position: "fixed"}}/>
}
