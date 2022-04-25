import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import getTexturePath from "../../helpers/getTexturePath"
import createCelestialBody from "./createCelestialBody"
import createDescription from "./createDescription"
import createComposer from "./createComposer"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min"

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

        /**
         * Scene for displaying 3D graphics.
         * @type {Scene}
         */
        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(Array(6).fill(getTexturePath("Stars")))

        /**
         * Perspective camera for defining the "eyes" of the scene. We can look at the scene through the camera.
         * @type {PerspectiveCamera}
         */
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
        camera.position.set(-90, 140, 140)

        /**
         * Renderer renders the scene through the camera.
         * @type {WebGLRenderer}
         */
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(WIDTH, HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        /**
         * Orbit controls gives access to orbit around the scene.
         * @type {OrbitControls}
         */
        const controls = new OrbitControls(camera, renderer.domElement)

        /**
         * Ambient light to lighten up the scene artificially, meaning even the dark side of planets is slightly visible.
         * @type {AmbientLight}
         */
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .2)
        scene.add(ambientLight)

        /**
         * Point light is the origin of the solar systems light. The point light is inside of the sun.
         * @type {PointLight}
         */
        const pointLight = new THREE.PointLight(0xFFFFFF, 1.9, 300)
        pointLight.castShadow = true
        pointLight.shadow.mapSize.width = 4096
        pointLight.shadow.mapSize.height = 4096
        pointLight.shadow.camera.near = 10
        pointLight.shadow.camera.far = 9000
        scene.add(pointLight)

        const composerParams = { strength: .9, radius: .9, threshold: .85 }
        /**
         * Composer gives the scene a bloom effect.
         * @type {EffectComposer}
         */
        const composer = createComposer(scene, camera, renderer, composerParams)
        
        mountRef.current?.appendChild(renderer.domElement)

        // Create all relevant celestial bodies in the solar system
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

        sun.body.material.emissive.setHex(0xffd99c)
        sun.body.material.emissiveIntensity = .98
        sun.body.castShadow = false

        const objects = [
            sun, mercury, venus, earth, mars,
            jupiter, saturn, uranus, neptune, pluto
        ]
        const interactable = []

        for (const object of objects) {
            // Add group to scene (celestial body and ring if the body has one)
            scene.add(object.group)
            // Only the body is currently interactable (ring is not interactable)
            interactable.push(object.body)
        }

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('pointerup', onPointerUp)
        document.addEventListener('keydown', onKeyDown)

        // isDragging determines if the user is dragging their mouse
        let isDragging
        // intersect is the first object that the raycast intersects with
        let intersect
        // description is the description of the celestial body the user has clicked
        let description = null
        // cameraTarget is the target where the camera is looking at
        let cameraTarget = sun.body
        /**
         * Raycaster is used to cast a ray and determine if it hits something
         * @type {Raycaster}
         */
        const raycaster = new THREE.Raycaster()
        /**
         * Pointer is the coordinates of the mouse on the browser window
         * @type {Vector2}
         */
        const pointer = new THREE.Vector2()

        /**
         * onPointerMove is called when the user moves their mouse on the browser window. If the mouse is moving,
         * dragging is set to true and the mouse position is tracked. A raycast is then cast from the camera to the
         * point where the mouse is. If the raycast hits something, the intersected object will be highlighted as
         * red (if interactable). If the raycast doesn't hit anything, the latest hit object will be returned to normal.
         * @param event is the mouse, from which the position is fetched
         */
        function onPointerMove(event) {
            isDragging = true
            pointer.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(interactable, false)
            if (intersects.length > 0) {
                if (intersect !== intersects[0].object) {
                    if (intersect) intersect.material.emissive.setHex(intersect.currentHex)
                    intersect = intersects[0].object
                    intersect.currentHex = intersect.material.emissive.getHex()
                    intersect.material.emissive.setHex(0xFFDD00)
                }
            } else {
                if (intersect) intersect.material.emissive.setHex(intersect.currentHex)
                intersect = null
            }
        }

        /**
         * onPointerDown is called when the user presses their mouse button down. If the mouse button is pressed down
         * the user is not dragging.
         */
        function onPointerDown() {
            isDragging = false
        }

        /**
         * onPointerUp is called when the user releases their mouse button up. When this happens a raycast is is cast
         * from the camera  to the point where the mouse is. This point is updated in  onPointerMove-function. If the
         * raycast hits something the target of the camera will be set as the first hit object. A description of the
         * first hit object will be created. If the scene already had a description for some other celestial body, it
         * will be removed. Then the description of the hit object will be displayed. If the user releases their mouse
         * button up and the raycast hits nothing and the user is not dragging (aka orbiting) the description will
         * be removed.
         */
        function onPointerUp() {
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(interactable, false)

            if (!isDragging) {
                if (intersects.length > 0) transitionToTarget(intersects[0].object)
                else scene.remove(description)
            }
        }

        /**
         * Gets camera position and cameraTargets position and animates transition of camera between points.
         */
        function transitionToTarget(target) {
            cameraTarget = target
            const direction = new THREE.Vector3()
            cameraTarget.getWorldPosition(direction)

            const cameraOffset = 80
            const xDistance = Math.random() * 60 + 90

            // Remove any already present descriptions
            scene.remove(description)

            // Start camera transitions to target
            new TWEEN.Tween(camera.position)
                .to({
                    x: direction.x + xDistance,
                    y: direction.y + cameraOffset,
                    z: direction.z + cameraOffset
                }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() =>
                    // Disable orbit controls for transition duration
                    controls.enabled = false
                )
                .onUpdate(() =>
                    // Always look at target while in transition
                    camera.lookAt(direction)
                )
                .onComplete(() => {
                    // Enable orbit controls when transition ends
                    controls.enabled = true
                    controls.update()
                })
                .start()

            // Add targets description to scene
            description = createDescription(font, cameraTarget)
            scene.add(description)
        }

        /**
         * When number is pressed on keyboard cameraTarget will be changed to corresponding planet and tween called.
         * @param event to change cameraTarget to correspond a pressed key
         */
        function onKeyDown(event) {
            let pressedKey = event.key
            switch(pressedKey) {
                case '1': transitionToTarget(sun.body)
                    break
                case '2': transitionToTarget(mercury.body)
                    break
                case '3': transitionToTarget(venus.body)
                    break
                case '4': transitionToTarget(earth.body)
                    break
                case '5': transitionToTarget(mars.body)
                    break
                case '6': transitionToTarget(jupiter.body)
                    break
                case '7': transitionToTarget(saturn.body)
                    break
                case '8': transitionToTarget(uranus.body)
                    break
                case '9': transitionToTarget(neptune.body)
                    break
                case '0': transitionToTarget(pluto.body)
                    break
            }
        }

        // Font of the description will be loaded here, since there is
        // a lot of problems loading it in createDescription.js
        const robotoFontPath = 'fonts/Roboto_Regular.json'
        const fontLoader = new FontLoader()
        let font
        fontLoader.load(robotoFontPath, function (robotoFont) { font = robotoFont })

        window.addEventListener( 'resize', onResize, false )

        /**
         * onResize scales the renderer and aspect ratio of the camera to screen size when the window size changes.
         */
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        /**
         * updateDescription keeps the description of celestial bodies rendered on top of everything (since the
         * description is a mesh in the scene). Additionally the description is positioned a little above the
         * celestial body. The description will always face the camera.
         */
        function updateDescription()  {
            if (description !== null) {
                description.renderOrder = 999
                description.material.depthTest = false
                description.material.depthWrite = false
                description.onBeforeRender = function (renderer) { renderer.clearDepth() }
                description.position.copy(controls.target).add(new THREE.Vector3(0,50,0))
                description.rotation.copy(camera.rotation)
            }
        }

        /**
         * updateCamera track the camera target. This is done via orbit controls.
         */
        function updateCamera() {
            const direction = new THREE.Vector3()

            cameraTarget.getWorldPosition(controls.target)
            controls.update()

            direction.subVectors(camera.position, controls.target)
            // Uncomment to enable zooming
            //const cameraOffset = 80
            //direction.normalize().multiplyScalar(cameraOffset)
            camera.position.copy(direction.add(controls.target))
        }

        /**
         * render updates the matrix world and renders the scene through the camera.
         */
        function render() {
            camera.updateMatrixWorld()
            renderer.render(scene, camera)
        }

        /**
         * animate animates the scene. Animation frames are requested and called continuously. Every celestial body
         * is rotated around their own axis and all other celestial bodies except the sun are rotated around the origin
         * (the sun acts as the origin). Then the description is updated and the camera is updated. Lastly the scene is
         * rendered.
         */
        const animate = function () {
            requestAnimationFrame(animate)
            TWEEN.update()
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
            //render()
            composer.render()
        }

        animate()

        return () => mountRef.current?.removeChild(renderer.domElement)
    }, [])

    return <div ref={mountRef} />
}