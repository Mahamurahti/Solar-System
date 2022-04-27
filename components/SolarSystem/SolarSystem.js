import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import getTexturePath from "../../helpers/getTexturePath"
import * as keycodes from "../../helpers/getKeyCodes"
import createCelestialBody from "./createCelestialBody"
import createDescription, { descriptionFadeIn, descriptionFadeOut } from "./createDescription"
import createComposer from "./createComposer"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min"

/**
 * Creates a solar system that can be interacted with.
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
         * Scene for displaying 3D graphics. Scene has a cubemap of stars as background.
         * @type {Scene}
         */
        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(Array(6).fill(getTexturePath("Stars")))

        /**
         * Perspective camera for defining the "eyes" of the scene. We can look at the scene through the camera.
         * @type {PerspectiveCamera}
         */
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, .1, 1000)
        camera.position.set(-90, 140, 140)

        /**
         * Renderer renders the scene through the camera. Renderer has shadows enabled.
         * @type {WebGLRenderer}
         */
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        renderer.setSize(WIDTH, HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.getContext().canvas.addEventListener('webglcontextlost', function(event) {
            event.preventDefault()
            cancelAnimationFrame(requestID)
        })

        mountRef.current?.appendChild(renderer.domElement)

        /**
         * Orbit controls gives access to orbit around the scene.
         * @type {OrbitControls}
         */
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = .05
        controls.screenSpacePanning = true
        controls.maxDistance = 600
        // Prevent spastic description behaviour at extremes of polar angles
        controls.maxPolarAngle = Math.PI - .01
        controls.minPolarAngle = .01

        /**
         * Ambient light to lighten up the scene artificially, meaning even the dark sides of celestial bodies
         * are slightly visible.
         * @type {AmbientLight}
         */
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .2)
        scene.add(ambientLight)

        /**
         * Point light is the origin of the solar systems light. The point light is inside of the sun. Point light
         * is the light that makes other objects cast shadows.
         * @type {PointLight}
         */
        const pointLight = new THREE.PointLight(0xFFFFFF, 1.9, 300)
        pointLight.castShadow = true
        const shadowResolution = 5120
        pointLight.shadow.mapSize.width = pointLight.shadow.mapSize.height = shadowResolution
        scene.add(pointLight)

        const composerParams = { strength: .6, radius: .4, threshold: .85 }
        /**
         * Composer gives the scene a bloom effect.
         * @type {EffectComposer}
         */
        const composer = createComposer(scene, camera, renderer, composerParams)

        // Create all relevant celestial bodies in the solar system
        const sun = createCelestialBody("Sun", 16, getTexturePath("Sun"), 0)
        const mercury = createCelestialBody("Mercury", 3.2, getTexturePath("Mercury"), 28)
        const venus = createCelestialBody("Venus", 5.8, getTexturePath("Venus"), 44)
        const moon = { name: "Moon", size: (6 * 0.27), texture: getTexturePath("Moon"), offset: 10, offsetAxis: 'x' }
        const earthMoon = [moon]
        const earth = createCelestialBody("Earth", 6, getTexturePath("Earth"), 62, earthMoon)
        const mars = createCelestialBody("Mars", 4, getTexturePath("Mars"), 78)
        const europa = { name: "Europa", size: (6 * 0.27 * 0.9), texture: getTexturePath("Europa"), offset: -16, offsetAxis: 'x' }
        const jupiterMoons = [europa]
        const jupiter = createCelestialBody("Jupiter", 12, getTexturePath("Jupiter"), 100, jupiterMoons)
        const saturnRing = { innerRadius: 10, outerRadius: 20, texture: getTexturePath("Saturn").ring }
        const enceladus = { name: "Enceladus", size:(6 * 0.27 / 2), texture: getTexturePath("Enceladus"), offset: 20, offsetAxis: 'x' }
        const titan = { name: "Titan", size: 3.5, texture: getTexturePath("Titan"), offset: -20, offsetAxis: 'x' }
        const saturnMoons =  [enceladus, titan]
        const saturn = createCelestialBody("Saturn", 10, getTexturePath("Saturn").body, 138, saturnMoons, saturnRing)
        const uranusRing = { innerRadius: 7, outerRadius: 12, texture: getTexturePath("Uranus").ring }
        const ariel = { name: "Ariel", size: 6 * 0.27 / 2, texture: getTexturePath("Ariel"), offset: -10, offsetAxis: 'x' }
        const titania = { name: "Titania", size: 6 * 0.1235, texture: getTexturePath("Titania"), offset: 12, offsetAxis: 'x' }
        const oberon = { name: "Oberon", size: 6 * 0.1135, texture: getTexturePath("Oberon"), offset: 12, offsetAxis: 'z' }
        const uranusMoons = [ariel, titania, oberon]
        const uranus = createCelestialBody("Uranus", 7, getTexturePath("Uranus").body, 176, uranusMoons, uranusRing)
        const neptune = createCelestialBody("Neptune", 7, getTexturePath("Neptune"), 200)
        const pluto = createCelestialBody("Pluto", 2.8, getTexturePath("Pluto"), 216)

        // Sun has default emission to make bloom effect
        sun.body.material.emissive.setHex(0xffd99c)
        sun.body.material.emissiveIntensity = .98
        sun.body.castShadow = false

        const objects = [
            sun, mercury, venus, earth, mars,
            jupiter, saturn, uranus, neptune, pluto
        ]
        const interactable = []

        for (const object of objects) {
            // Add group to scene (celestial body, moons of celestial body and ring if it has one)
            scene.add(object.group)
            // Add body of celestial body to be interactable
            interactable.push(object.body)
            // If the celestial body has moons, add all moon to be interactable
            if(object.moons) for (const moon of object.moons) interactable.push(moon)
            // If the celestial body has a ring, add it to be interactable
            if(object.ring) interactable.push(object.ring)
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
         * onPointerUp is called when the user releases their mouse button up. onPointerUp-function will execute its
         * functionality only if the user has not dragged their mouse after mouse button is pressed down. If the user
         * has dragged their mouse after mouse button is pressed down, nothing will happen. If the user just presses
         * the mouse button (and doesn't drag) a raycast is fired off to the point of the mouse. If the raycast hits
         * something that is interactable a transition to the object will happen. If nothing was hit and there is a
         * description in the scene, it will be removed.
         */
        function onPointerUp() {
            if (!isDragging) {
                raycaster.setFromCamera(pointer, camera)
                const intersects = raycaster.intersectObjects(interactable, false)

                if (intersects.length > 0) transitionToTarget(intersects[0].object)
                else if (description) descriptionFadeOut(scene, description)
            }
        }

        /**
         * transitionToTarget is called whenever the user has successfully clicked on an interactable object. In this
         * function the target of the camera will change to the clicked object and a tween animation will start.
         * In this animation the camera will move to specified location near the clicked object. y- and z-axis will
         * always have a certain amount of offset, but the x-axis will be random between 90 - 150 units. When the
         * animation starts, orbit controls are disabled, during the animation the camera should always look at the
         * target and any description in the scene is removed (prevents creations of multiple descriptions if spam
         * clicking) and when the animation is complete, the targets description will be created and faded in above
         * the target.
         */
        function transitionToTarget(target) {
            cameraTarget = target
            const direction = new THREE.Vector3()
            cameraTarget.getWorldPosition(direction)

            const cameraOffset = 80
            const xDistance = Math.random() * 60 + 90

            // Start camera transitions to target
            new TWEEN.Tween(camera.position)
                .to({
                    x: direction.x + xDistance,
                    y: direction.y + cameraOffset,
                    z: direction.z + cameraOffset
                }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() => {
                    // Disable orbit controls for transition duration
                    controls.enabled = false
                })
                .onUpdate(() => {
                    // Always look at target while in transition
                    controls.target = direction
                    if (description) scene.remove(description)
                })
                .onComplete(() => {
                    // Enable orbit controls when transition ends
                    controls.enabled = true
                    controls.update()
                    // Add targets description to scene
                    description = createDescription(font, cameraTarget)
                    descriptionFadeIn(scene, description)
                })
                .start()
        }

        /**
         * When number is pressed on keyboard a transition to the specified target will occur.
         * The if statement check that the pressed key must be either from keyboard numbers or numeric keypad keys.
         * @param event to check which number was pressed
         */
        function onKeyDown(event) {
            // Is the pressed number from keyboard numbers or numpad numbers
            const keycode = event.keyCode
            if (keycodes.isKeyboardNumber(keycode) || keycodes.isNumpadNumber(keycode) || keycodes.isSpace(keycode)) {
                const pressedKey = event.key
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
                    case ' ':
                        // Pressing space will lock the zoomLevel. This way the user can easily follow the celestial body
                        lockZoom = !lockZoom
                        if (lockZoom) zoomLevel = controls.target.distanceTo(controls.object.position)
                        break
                }
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
         * updateDescription keeps the description is positioned a little above a celestial body.
         * The description will always face the camera.
         */
        function updateDescription()  {
            if (description !== null) {
                // Description is above the target
                description.position.copy(controls.target).add(new THREE.Vector3(0,80,0))
                description.rotation.copy(camera.rotation)
            }
        }

        let lockZoom = false, zoomLevel

        /**
         * updateCamera tracks the camera target. This is done via orbit controls.
         */
        function updateCamera() {
            cameraTarget.getWorldPosition(controls.target)
            controls.update()

            const direction = new THREE.Vector3()
            direction.subVectors(camera.position, controls.target)

            if (lockZoom) direction.normalize().multiplyScalar(zoomLevel)

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
         * requestID is only used for performance matters. If the context is lost (which we force when the component
         * unmounts) the latest animation frame will be cancelled.
         */
        let requestID

        /**
         * animate animates the scene. Animation frames are requested and called continuously. Every celestial body
         * is rotated around their own axis and all other celestial bodies except the sun are rotated around the origin
         * (the sun acts as the origin). Then the description is updated and the camera is updated. Lastly the scene is
         * rendered.
         */
        const animate = function () {
            requestID = requestAnimationFrame(animate)
            TWEEN.update()
            const orbitSpeed = 0.1
            const negateDirection = Math.PI / -2

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

            // Rotate the matrix, which is applied to the moons
            const matrix = new THREE.Matrix4()
            earth.moons[0].position.applyMatrix4(matrix.makeRotationY(0.012 * negateDirection))
            jupiter.moons[0].position.applyMatrix4(matrix.makeRotationY(0.026 * negateDirection))
            saturn.moons[0].position.applyMatrix4(matrix.makeRotationY(0.022 * negateDirection))
            saturn.moons[1].position.applyMatrix4(matrix.makeRotationY(0.023 * negateDirection))
            uranus.moons[0].position.applyMatrix4(matrix.makeRotationY(0.016 * negateDirection))
            uranus.moons[1].position.applyMatrix4(matrix.makeRotationY(0.017 * negateDirection))
            uranus.moons[2].position.applyMatrix4(matrix.makeRotationY(0.018 * negateDirection))

            updateDescription()
            updateCamera()
            //render()
            composer.render()
        }

        animate()

        return () => {
            mountRef.current?.removeChild(renderer.domElement)
            // Bad practice to force context loss, but gets the job done
            renderer.forceContextLoss()
        }
    }, [])

    return <div ref={mountRef} />
}