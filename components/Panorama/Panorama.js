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

    const mountRef = useRef(null)

    useEffect(() => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        /**
         * Scene for displaying 3D graphics. Scene has a cubemap of space as background.
         * The space background is generated procedurally. Source: https://tools.wwwtyro.net/space-3d/index.html
         * @type {Scene}
         */
        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(getTexturePath("Cubemap"))

        /**
         * Perspective camera for defining the "eyes" of the scene. We can look at the scene through the camera.
         * @type {PerspectiveCamera}
         */
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)

        /**
         * Renderer renders the scene through the camera.
         * @type {WebGLRenderer}
         */
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(WIDTH, HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.getContext().canvas.addEventListener('webglcontextlost', function(event) {
            event.preventDefault()
            cancelAnimationFrame(requestID)
        })

        mountRef.current?.appendChild(renderer.domElement)

        const mouse = new THREE.Vector2()
        const target = new THREE.Vector2()
        const windowHalf = new THREE.Vector2(WIDTH / 2, HEIGHT / 2)

        document.addEventListener( 'mousemove', onMouseMove, false )
        window.addEventListener( 'resize', onResize, false )

        /**
         * onMouseMove updates the mouse position.
         * @param event is used to get the position form the client.
         */
        function onMouseMove(event) {
            mouse.x = event.clientX - windowHalf.x
            mouse.y = event.clientY - windowHalf.x
        }

        /**
         * onResize resizes the renderer that it will fit the window size always.
         */
        function onResize() {
            windowHalf.set(window.innerWidth / 2, window.innerHeight / 2)

            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        let requestID

        /**
         * animate rotates the camera depending on the mouse position.
         */
        const animate = function () {
            requestID = requestAnimationFrame(animate)

            // Credit: https://jsfiddle.net/0rdekspn/   //
            target.x = (1 - mouse.x) * 0.001
            target.y = (1 - mouse.y) * 0.001
            camera.rotation.x += 0.01 * (target.y - camera.rotation.x)
            camera.rotation.y += 0.01 * (target.x - camera.rotation.y)
            // -----------------------------------------//

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
