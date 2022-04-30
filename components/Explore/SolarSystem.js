import * as THREE from "three"
import { useEffect, useRef } from "react"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import getTexturePath from "../../helpers/getTexturePath"
import * as keycodes from "../../helpers/getKeyCodes"
import createCelestialBody from "./createCelestialBody"
import createDescription, { descriptionFadeIn, descriptionFadeOut } from "./createDescription"
import createComposer from "./createComposer"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min"
import styles from "../../styles/SolarSystem.module.sass"
import Stats from "three/examples/jsm/libs/stats.module"
import getDescription from "../../helpers/getDescription"

/**
 * Creates a Solar System that can be interacted with.
 *
 * @author Timo Tamminiemi & Eric Keränen
 * @returns {JSX.Element}
 */
export default function SolarSystem() {

    const mountRef = useRef(null)

    useEffect(()  => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        // ---------------------------------------- SETTING UP SCENE ---------------------------------------- //

        const stats = new Stats()
        document.body.appendChild(stats.dom)

        /**
         * Scene for displaying 3D graphics. Scene has a cubemap of stars as background.
         * @type {Scene}
         */
        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(Array(6).fill(getTexturePath("Stars")))

        const renderDistance = 3000
        /**
         * Perspective camera for defining the "eyes" of the scene. We can look at the scene through the camera.
         * @type {PerspectiveCamera}
         */
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, .1, renderDistance)
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
        renderer.getContext().canvas.addEventListener("webglcontextlost", function(event) {
            event.preventDefault()
            cancelAnimationFrame(requestID)
        })

        mountRef.current?.appendChild(renderer.domElement)

        // ---------------------------------------- CONTROLS ---------------------------------------- //

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

        // ---------------------------------------- LIGHTING ---------------------------------------- //

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
        const pointLight = new THREE.PointLight(0xFFFFFF, .9, renderDistance)
        pointLight.castShadow = true
        const shadowResolution = 5120
        pointLight.shadow.mapSize.width = pointLight.shadow.mapSize.height = shadowResolution
        scene.add(pointLight)

        // ---------------------------------------- POST PROCESSING ---------------------------------------- //

        const composerParams = { strength: .6, radius: .4, threshold: .85 }
        /**
         * Composer gives the scene a bloom effect.
         * @type {EffectComposer}
         */
        const composer = createComposer(scene, camera, renderer, composerParams)

        // ---------------------------------------- SOLAR SYSTEM BUILDING ---------------------------------------- //

        // Create all relevant celestial bodies in the solar system
        const sun = createCelestialBody("Sun", 100, getTexturePath("Sun"), 0)
        const mercury = createCelestialBody("Mercury", 1.8, getTexturePath("Mercury"), -119)
        const venus = createCelestialBody("Venus", 4.75, getTexturePath("Venus"), 136)
        const moon = { name: "Moon", size: 1.35, texture: getTexturePath("Moon"), offset: 7, offsetAxis: "x"}
        const earthMoons = [moon]
        const earth = createCelestialBody("Earth", 5, getTexturePath("Earth"), -150, earthMoons)
        const phobos = { name: "Phobos", size: 0.25, texture: getTexturePath("Phobos"), offset: 4, offsetAxis: "x" }
        const deimos = { name: "Deimos", size: 0.125, texture: getTexturePath("Deimos"), offset: -6, offsetAxis: "x" }
        const marsMoons = [phobos, deimos]
        const mars = createCelestialBody("Mars", 2.66, getTexturePath("Mars"), 175, marsMoons)
        const europa = { name: "Europa", size: 1.25, texture: getTexturePath("Europa"), offset: -156, offsetAxis: "x" }
        const jupiterMoons = [europa]
        const jupiter = createCelestialBody("Jupiter", 56, getTexturePath("Jupiter"), -360, jupiterMoons)
        const saturnRing = { innerRadius: 47, outerRadius: 94, texture: getTexturePath("Saturn").ring }
        const enceladus = { name: "Enceladus", size: 0.65, texture: getTexturePath("Enceladus"), offset: 100, offsetAxis: "x"}
        const titan = { name: "Titan", size: 2.02, texture: getTexturePath("Titan"), offset: -140, offsetAxis: "x" }
        const saturnMoons =  [enceladus, titan]
        const saturn = createCelestialBody("Saturn", 47, getTexturePath("Saturn").body, 625, saturnMoons, saturnRing)
        const uranusRing = { innerRadius: 20.3, outerRadius: 34.8, texture: getTexturePath("Uranus").ring }
        const ariel = { name: "Ariel", size: 0.65, texture: getTexturePath("Ariel"), offset: -39, offsetAxis: "x" }
        const titania = { name: "Titania", size: 0.741, texture: getTexturePath("Titania"), offset: 42, offsetAxis: "x" }
        const oberon = { name: "Oberon", size: 0.681, texture: getTexturePath("Oberon"), offset: 37, offsetAxis: "z" }
        const uranusMoons = [ariel, titania, oberon]
        const uranus = createCelestialBody("Uranus", 20.3, getTexturePath("Uranus").body, -1060, uranusMoons, uranusRing)
        const neptune = createCelestialBody("Neptune", 19.4, getTexturePath("Neptune"), 1605)
        const charon = { name: "Charon", size: 1.4, texture: getTexturePath("Charon"), offset: -5, offsetAxis: "z" }
        const plutoMoons = [charon]
        const pluto = createCelestialBody("Pluto", 2.8, getTexturePath("Pluto"), -2050, plutoMoons)

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
            // If the celestial body has moons, add all moons to be interactable
            if(object.moons) for (const moon of object.moons) interactable.push(moon)
            // If the celestial body has a ring, add it to be interactable
            if(object.ring) interactable.push(object.ring)
        }

        // ---------------------------------------- MOUSE EVENTS ---------------------------------------- //

        document.addEventListener("pointermove", onPointerMove)
        document.addEventListener("pointerdown", onPointerDown)
        document.addEventListener("pointerup", onPointerUp)
        document.addEventListener("keydown", onKeyDown)

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
         * red (if interactable). If the raycast doesn"t hit anything, the latest hit object will be returned to normal.
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
         * the mouse button (and doesn"t drag) a raycast is fired off to the point of the mouse. If the raycast hits
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

        // ---------------------------------------- TRANSITION ANIMATION ---------------------------------------- //

        /**
         * transitionToTarget is called whenever the user has successfully clicked on an interactable object. In this
         * function the target of the camera will change to the clicked object and a tween animation will start (cancels
         * all other tween animations before starting any new ones). In this animation the camera will move to specified
         * location near the clicked object. y- and z-axis will always have a certain amount of offset, but the x-axis
         * will be random between 275 - 315 units. When the animation starts, orbit controls are disabled, during the
         * animation the camera should always look at the target and any description in the scene is removed (prevents
         * creations of multiple descriptions if spam clicking) and when the animation is complete, the targets
         * description will be created and faded in above the target.
         */
        function transitionToTarget(target) {
            // Cancel all other animations before starting transition
            TWEEN.removeAll()

            cameraTarget = target
            const direction = new THREE.Vector3()
            cameraTarget.getWorldPosition(direction)

            const cameraOffset = 100
            const xDistance = Math.random() * 40 + 275

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

        // ---------------------------------------- TOASTS ---------------------------------------- //

        /**
         * Toast is a small text box where the latest key event will be shown. Triggers only when using keys from
         * keyboard.
         * @type {HTMLElement}
         */
        const toast = document.getElementById("toast")
        const timeout = () => toast.style.opacity = "0"
        function showToast(message) {
            toast.innerHTML = message
            toast.style.opacity = "1"
            setTimeout(() => timeout(), 1000)
        }

        // ---------------------------------------- KEY EVENTS ---------------------------------------- //

        /**
         * When a key is pressed, check if the key is any of the keys that are being used in the solar system key
         * bindings. If yes, trigger key event, if no, don"t do anything.
         * Numbers from 0-9 are reserved for planets and the Sun and the upper row of letters (Q-P) are reserved for
         * planets moons. Control is reserved for camera locking and Space for orbit locking.
         * @param event to check which key was pressed
         */
        function onKeyDown(event) {
            const keycode = event.keyCode
            if (
                keycodes.isKeyboardNumber(keycode) ||
                keycodes.isNumpadNumber(keycode) ||
                keycodes.isSpace(keycode) ||
                keycodes.isQWERTYUIOP(keycode) ||
                keycodes.isControl(keycode)
            ) {
                function handleKeypress(target) {
                    transitionToTarget(target)
                    showToast(target.name.toUpperCase())
                }
                const pressedKey = event.key
                switch(pressedKey) {
                    case "1": return handleKeypress(sun.body)
                    case "2": return handleKeypress(mercury.body)
                    case "3": return handleKeypress(venus.body)
                    case "4": return handleKeypress(earth.body)
                    case "5": return handleKeypress(mars.body)
                    case "6": return handleKeypress(jupiter.body)
                    case "7": return handleKeypress(saturn.body)
                    case "8": return handleKeypress(uranus.body)
                    case "9": return handleKeypress(neptune.body)
                    case "0": return handleKeypress(pluto.body)
                    case "q": return handleKeypress(earth.moons[0])
                    case "w": return handleKeypress(mars.moons[0])
                    case "e": return handleKeypress(mars.moons[1])
                    case "r": return handleKeypress(jupiter.moons[0])
                    case "t": return handleKeypress(saturn.moons[0])
                    case "y": return handleKeypress(saturn.moons[1])
                    case "u": return handleKeypress(uranus.moons[0])
                    case "i": return handleKeypress(uranus.moons[1])
                    case "o": return handleKeypress(uranus.moons[2])
                    case "p": return handleKeypress(pluto.moons[0])
                    case "Control":
                        // Pressing control will lock the zoomLevel.
                        // This way the user can easily follow the celestial body
                        lockZoom = !lockZoom
                        if (lockZoom) zoomLevel = controls.target.distanceTo(camera.position)
                        showToast(lockZoom ? "CAMERA LOCKED" : "CAMERA UNLOCKED")
                        break
                    case " ":
                        // Pressing space will lock orbiting.
                        // This way the user can easily read the description above the celestial body
                        stopOrbit = !stopOrbit
                        showToast(stopOrbit ? "ORBITING STOPPED" : "ORBITING RESUMED")
                        break
                }
            }
        }

        // Font of the description will be loaded here, since there is
        // a lot of problems loading it in createDescription.js
        let font
        const fontLoader = new FontLoader()
        fontLoader.load("fonts/Roboto_Regular.json", function (robotoFont) { font = robotoFont })

        // ---------------------------------------- WINDOW RESIZING ---------------------------------------- //

        window.addEventListener( "resize", onResize, false )

        /**
         * onResize scales the renderer and aspect ratio of the camera to screen size when the window size changes.
         */
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        // ---------------------------------------- RENDERING ---------------------------------------- //

        /**
         * updateDescription keeps the description is positioned a little above a celestial body.
         * The description will always face the camera.
         */
        function updateDescription()  {
            if (description !== null) {
                // Description is above the target
                const radius = cameraTarget.geometry.parameters.radius
                const yOffset = radius > 40 ? 180 : 160
                description.position.copy(controls.target).add(new THREE.Vector3(0, yOffset, 0))
                description.rotation.copy(camera.rotation)
            }
        }

        /**
         * lockZoom lock the zoom level to a certain amount, which means if the planet is orbiting, the camera will not
         * just look at the target but follow it also on the zoom level which it was locked in.
         * @type {boolean}
         */
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
         * stopOrbit lock the orbiting of planets in place. Controls the speed of orbit, which is 0 if true.
         * @type {boolean}
         */
        let stopOrbit = false

        /**
         * animate animates the scene. Animation frames are requested and called continuously. Every celestial body
         * is rotated around their own axis and all other celestial bodies except the sun are rotated around the origin
         * (the sun acts as the origin). Then the description is updated and the camera is updated. Lastly the scene is
         * rendered.
         */
        const animate = function () {
            requestID = requestAnimationFrame(animate)
            TWEEN.update()
            stats.update()
            const orbitSpeed = stopOrbit ? 0 : 0.05
            const negateDirection = Math.PI / -2
            const rotateSpeed = 0.2

            // Around own axis rotation
            sun.body.rotateY(0.004 * rotateSpeed)
            mercury.body.rotateY(0.004 * rotateSpeed)
            venus.body.rotateY(0.002 * rotateSpeed)
            earth.body.rotateY(0.02 * rotateSpeed)
            mars.body.rotateY(0.018 * rotateSpeed)
            jupiter.body.rotateY(0.04 * rotateSpeed)
            saturn.body.rotateY(0.038 * rotateSpeed)
            uranus.body.rotateY(0.03 * rotateSpeed)
            neptune.body.rotateY(0.032 * rotateSpeed)
            pluto.body.rotateY(0.008 * rotateSpeed)

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
            earth.moons[0].position.applyMatrix4(matrix.makeRotationY(0.016 * negateDirection * rotateSpeed))
            mars.moons[0].position.applyMatrix4(matrix.makeRotationY(0.022 * negateDirection * rotateSpeed))
            mars.moons[1].position.applyMatrix4(matrix.makeRotationY(0.023 * negateDirection * rotateSpeed))
            jupiter.moons[0].position.applyMatrix4(matrix.makeRotationY(0.026 * negateDirection * rotateSpeed))
            saturn.moons[0].position.applyMatrix4(matrix.makeRotationY(0.022 * negateDirection * rotateSpeed))
            saturn.moons[1].position.applyMatrix4(matrix.makeRotationY(0.025 * negateDirection * rotateSpeed))
            uranus.moons[0].position.applyMatrix4(matrix.makeRotationY(0.016 * negateDirection * rotateSpeed))
            uranus.moons[1].position.applyMatrix4(matrix.makeRotationY(0.017 * negateDirection * rotateSpeed))
            uranus.moons[2].position.applyMatrix4(matrix.makeRotationY(0.018 * negateDirection * rotateSpeed))
            pluto.moons[0].position.applyMatrix4(matrix.makeRotationY(0.022 * negateDirection * rotateSpeed))

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

    /**
     * handleClick handles the click of the button that shows the key bindings the scene has.
     */
    function handleClick() {
        const controlsText = document.getElementById("controls_text")
        const controlsButton = document.getElementById("controls_button")
        const opacity = controlsText.style.opacity
        if (opacity === "1") {
            controlsText.style.opacity = "0"
            controlsButton.style.transform = "rotate(360deg)"
        } else {
            controlsText.style.opacity = "1"
            controlsButton.style.transform = "rotate(180deg)"
        }
        controlsButton.blur()
    }

    return (
        <>
            <p className={styles.toast} id="toast">TOAST</p>
            <div className={styles.controls_container}>
                <p className={styles.controls_text} id="controls_text">{getDescription("Controls")}</p>
                <button className={styles.controls_button} id="controls_button" onClick={handleClick}>&lt;</button>
            </div>
            <div ref={mountRef} />
        </>
    )
}