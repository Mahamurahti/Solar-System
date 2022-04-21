import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import getTexturePath from "../../helpers/getTexturePath"
import createCelestialBody from "./createCelestialBody"
import createDescription from "./createDescription"

/**
 * Creates a solar system that can be interacted with
 *
 * @author Timo Tamminiemi & Eric Keränen
 * @returns {JSX.Element}
 * @constructor
 */
export default function SolarSystem() {

    const mountRef = useRef(null)

    useEffect(()  => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(Array(6).fill(getTexturePath("Stars")))

        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
        camera.position.set(-90, 140, 140)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(WIDTH, HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)

        const controls = new OrbitControls(camera, renderer.domElement)

        // --- Change to hemisphere light and tweak settings, light comes from the sun --- //
        const dirLight = new THREE.DirectionalLight(0xffffff)
        scene.add(dirLight)

        const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300)
        scene.add(pointLight)
        // ------------------------------------------------------------------------------- //

        mountRef.current?.appendChild(renderer.domElement)

        const sun = createCelestialBody("Sun", 16, getTexturePath("Sun"), 0)
        const mercury = createCelestialBody("Mercury", 3.2, getTexturePath("Mercury"), 28)
        const venus = createCelestialBody("Venus", 5.8, getTexturePath("Venus"), 44)
        const earth = createCelestialBody("Earth", 6, getTexturePath("Earth"), 62)
        const mars = createCelestialBody("Mars", 4, getTexturePath("Mars"), 78)
        const jupiter = createCelestialBody("Jupiter", 12, getTexturePath("Jupiter"), 100)
        const saturnRing = { innerRadius: 10, outerRadius: 20, texture: getTexturePath("Saturn").ring }
        const saturn = createCelestialBody("Saturn", 10, getTexturePath("Saturn").body, 138, saturnRing)
        const uranusRing = { innerRadius: 7, outerRadius: 12, texture: getTexturePath("Uranus").ring }
        const uranus = createCelestialBody("Uranus", 7, getTexturePath("Uranus").body, 176, uranusRing)
        const neptune = createCelestialBody("Neptune", 7, getTexturePath("Neptune"), 200)
        const pluto = createCelestialBody("Pluto", 2.8, getTexturePath("Pluto"), 216)

        const objects = [
            sun, mercury, venus, earth, mars,
            jupiter, saturn, uranus, neptune, pluto
        ]
        const interactable = []

        for (const object of objects) {
            scene.add(object.group)
            interactable.push(object.body)
        }

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('pointerup', onPointerUp)

        let moved, intersect, description = null, cameraTarget = sun.body
        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()

        /**
         * When user hovers mouse over planet, it will be highlighted. This function casts a raycast and checks
         * if it hits something from objects-variable. If it does, it set the emission of the intersected object
         * to a reddish color. Reset emission when not hovered over anything.
         *
         * If the the user has moved the pointer after pressing it down, it means the user is dragging, so set the
         * moved-variable to true.
         *
         * @param event to get the position of the pointer in client
         */
        function onPointerMove(event) {
            moved = true
            pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(interactable, false)
            if (intersects.length > 0) {
                if (intersect !== intersects[0].object) {
                    if (intersect) intersect.material.emissive.setHex(intersect.currentHex)
                    intersect = intersects[0].object
                    intersect.currentHex = intersect.material.emissive.getHex()
                    intersect.material.emissive.setHex(0xff0000)
                }
            } else {
                if (intersect) intersect.material.emissive.setHex(intersect.currentHex)
                intersect = null
            }
        }

        /**
         * When the user presses the mouse button down, the pointer has not moved yet so set it to false.
         */
        function onPointerDown() {
            moved = false
        }

        /**
         * When user clicks over a planet, cameraTarget will change to the clicked planet. This function casts a raycast
         * and checks if it hits something from objects-variable. If it does, change cameraTarget.
         *
         * Additionally creates a description for the planet above the clicked planet. Description is created on click
         * and removed if clicking on another planet or clicking anywhere else than a planet. Dragging will not hide
         * the description. For this the moved-variable is used to determine is the user dragging.
         *
         * @param event to get the position of the pointer in client
         */
        function onPointerUp(event) {
            pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(interactable, false)
            if (intersects.length > 0) {
                cameraTarget = intersects[0].object
                scene.remove(description)
                description = createDescription(font, cameraTarget)
                scene.add(description)
            } else {
                if (!moved) scene.remove(description)
            }
        }

        const robotoFontPath = 'fonts/Roboto_Regular.json'
        const fontLoader = new FontLoader()
        let font
        fontLoader.load(robotoFontPath, function (robotoFont) { font = robotoFont })

        window.addEventListener( 'resize', onResize, false )

        /**
         * Scale renderer and aspect ratio to screen size on resize.
         */
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        function updateDescription()  {
            if (description !== null) {
                description.renderOrder = 999
                description.material.depthTest = false;
                description.material.depthWrite = false;
                description.onBeforeRender = function (renderer) { renderer.clearDepth(); };
                description.position.copy(controls.target).add(new THREE.Vector3(0,50,0))
                description.rotation.copy(camera.rotation)
            }
        }

        /**
         * Update camera position and offset. Camera is always pointing to cameraTarget-variable. cameraTarget-variables
         * position is continuously checked through .getWorldPosition()-method.
         */
        function updateCamera() {
            const direction = new THREE.Vector3()
            //const cameraOffset = 80

            cameraTarget.getWorldPosition(controls.target)
            controls.update()

            direction.subVectors(camera.position, controls.target)
            // Uncomment to enable zooming
            //direction.normalize().multiplyScalar(cameraOffset)
            camera.position.copy(direction.add(controls.target))
        }

        /**
         * Update matrix so that the correct world position of object can be checked. Render scene.
         */
        function render() {
            camera.updateMatrixWorld()
            renderer.render(scene, camera)
        }

        /**
         * Animate whole scene. Rotate planet around their own axis and rotate planets around sun. Update camera lastly.
         */
        const animate = function () {
            requestAnimationFrame(animate)

            const orbitSpeed = 0.1

            // Around own axis rotation
            sun.body.rotateY(0.004)
            mercury.body.rotateY(0.004)
            venus.body.rotateY(0.002)
            earth.body.rotateY(0.02)
            mars.body.rotateY(0.018)
            jupiter.body.rotateY(0.04)
            saturn.body.rotateY(0.038)
            uranus.body.rotateY(0.03)
            neptune.body.rotateY(0.032)
            pluto.body.rotateY(0.008)

            // Around sun rotation
            mercury.group.rotateY(0.04 * orbitSpeed)
            venus.group.rotateY(0.015 * orbitSpeed)
            earth.group.rotateY(0.01 * orbitSpeed)
            mars.group.rotateY(0.008 * orbitSpeed)
            jupiter.group.rotateY(0.002 * orbitSpeed)
            saturn.group.rotateY(0.0009 * orbitSpeed)
            uranus.group.rotateY(0.0004 * orbitSpeed)
            neptune.group.rotateY(0.0001 * orbitSpeed)
            pluto.group.rotateY(0.00007 * orbitSpeed)

            updateDescription()
            updateCamera()
            render()
        }

        animate()

        return () => mountRef.current?.removeChild(renderer.domElement)
    }, [])

    return <div ref={mountRef} />
}