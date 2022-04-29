import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import getTexturePath from "../../helpers/getTexturePath"
import createCelestialBody from "./createCelestialBody"
import createDescription, { descriptionFadeIn, descriptionFadeOut } from "./createDescription"
import createComposer from "./createComposer"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min"
import {VRButton} from "three/examples/jsm/webxr/VRButton";
import Stats from "three/examples/jsm/libs/stats.module";
import {XRControllerModelFactory} from "three/examples/jsm/webxr/XRControllerModelFactory";

/**
 * Creates a solar system that can be interacted with.
 *
 * @author Timo Tamminiemi & Eric Keränen
 * @returns {JSX.Element}
 * @constructor
 */
export default function SolarSystemVR() {

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
        camera.position.set(-10, 10, 10)

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
        const pointLight = new THREE.PointLight(0xFFFFFF, 1.9, 230)
        pointLight.castShadow = true
        const shadowResolution = 640
        pointLight.shadow.mapSize.width = pointLight.shadow.mapSize.height = shadowResolution
        scene.add(pointLight)

        const composerParams = { strength: .6, radius: .4, threshold: .85 }

        const stats = new Stats()
        document.body.appendChild(stats.dom)
        /**
         * Composer gives the scene a bloom effect.
         * @type {EffectComposer}
         */
        const composer = createComposer(scene, camera, renderer, composerParams)

        // Create all relevant celestial bodies in the solar system
        const sun = createCelestialBody("Sun", 16/16, getTexturePath("Sun"), 0)
        const mercury = createCelestialBody("Mercury", 3.2/16, getTexturePath("Mercury"), -28/16)
        const venus = createCelestialBody("Venus", 5.8/16, getTexturePath("Venus"), 44/16)
        const earthMoon = [{size: 1.35/16, texture: getTexturePath("Moon"), name: "Moon", position: 10/16, offsetAxis: 'x'}]
        const earth = createCelestialBody("Earth", 6/16, getTexturePath("Earth"), -62/16, null, earthMoon)
        let marsMoons = [{size: 0.25/16, texture: getTexturePath("Phobos"), name: "Phobos", position: 4/16, offsetAxis: 'x'},
        {size: 0.125/16, texture: getTexturePath("Deimos"), name: "Deimos", position: -6/16, offsetAxis: 'x'}]
        const mars = createCelestialBody("Mars", 4/16, getTexturePath("Mars"), 78/16, null, marsMoons)
        const jupiterMoons = [{size: 1.25/16, texture: getTexturePath("Europa"), name: "Europa", position: -16/16, offsetAxis: 'x'}]
        const jupiter = createCelestialBody("Jupiter", 12/16, getTexturePath("Jupiter"), -100/16, null, jupiterMoons)
        const saturnRing = { innerRadius: 10/16, outerRadius: 20/16, texture: getTexturePath("Saturn").ring }
        const saturnMoons =  [{size: 0.65/16, texture: getTexturePath("Enceladus"), name: "Enceladus", position: 15/16, offsetAxis: 'x'},
            {size: 2.02/16, texture: getTexturePath("Titan"), name: "Titan", position: -20/16, offsetAxis: 'x'}]
        const saturn = createCelestialBody("Saturn", 10/16, getTexturePath("Saturn").body, 138/16, saturnRing, saturnMoons)
        const uranusRing = { innerRadius: 7/16, outerRadius: 12/16, texture: getTexturePath("Uranus").ring }
        const uranusMoons = [{size: 0.65/16, texture: getTexturePath("Ariel"), name: "Ariel", position: -10/16, offsetAxis: 'x'},
            {size: 0.741/16, texture: getTexturePath("Titania"), name: "Titania", position: 12/16, offsetAxis: 'x'},
            {size: 0.681/16, texture: getTexturePath("Oberon"), name: "Oberon", position: 12/16, offsetAxis: 'z'}]
        const uranus = createCelestialBody("Uranus", 7/16, getTexturePath("Uranus").body, -176/16, uranusRing, uranusMoons)
        const neptune = createCelestialBody("Neptune", 7/16, getTexturePath("Neptune"), 200/16)
        let plutoMoons = [{size: 1.4/16, texture: getTexturePath("Kharon"), name: "Kharon", position: -5/16, offsetAxis: 'z'}]
        const pluto = createCelestialBody("Pluto", 2.8/16, getTexturePath("Pluto"), -216/16, null, plutoMoons)

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
            // Add group to scene (celestial body, moons and ring if the body has one)
            scene.add(object.group)
            // Only the body and moons are currently interactable (ring is not interactable)
            interactable.push(object.body)
            if(object.moonMesh) {
                for (let i =0; i<object.moonMesh.length; i++) {
                    interactable.push(object.moonMesh[i])
                }
            }
        }

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('pointerup', onPointerUp)
        document.addEventListener('keydown', onKeyDown)
        document.body.appendChild(VRButton.createButton(renderer))
        renderer.xr.enabled = true
        const controllerModelFactory = new XRControllerModelFactory()

        // Camera position when entered in VR
        const cameraGroup = new THREE.Group()
        cameraGroup.position.set(0, 1, 2)

        // When user enters VR mode reposition the camera and add event listeners to controllers
        renderer.xr.addEventListener('sessionstart', function () {
            scene.add(cameraGroup)
            cameraGroup.add(camera)
            rightController.addEventListener('selectstart', onSelectStart)
            rightController.addEventListener('selectend', onSelectEnd)
            leftController.addEventListener('selectstart', onSelectStart)
            leftController.addEventListener('selectend', onSelectEnd)
            rightController.addEventListener('squeezestart', onSqueezeStart)
            rightController.addEventListener('squeezeend', onSqueezeEnd)
            leftController.addEventListener('squeezestart', onSqueezeStart)
            leftController.addEventListener('squeezeend', onSqueezeEnd)


        })
        // When user exits VR mode reposition the camera and remove event listeners of controllers
        renderer.xr.addEventListener('sessionend', function () {
            scene.remove(cameraGroup)
            cameraGroup.remove(camera)
            rightController.removeEventListener('selectstart', onSelectStart)
            rightController.removeEventListener('selectend', onSelectEnd)
            leftController.removeEventListener('selectstart', onSelectStart)
            leftController.removeEventListener('selectend', onSelectEnd)
            rightController.removeEventListener('squeezestart', onSqueezeStart)
            rightController.removeEventListener('squeezeend', onSqueezeEnd)
            leftController.removeEventListener('squeezestart', onSqueezeStart)
            leftController.removeEventListener('squeezeend', onSqueezeEnd)
        })

        // Line geometry for VR controllers
        const geometry = new THREE.BufferGeometry()
        geometry.setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] )
        const line = new THREE.Line( geometry )
        line.name = 'line'
        line.scale.z = 5

        // Create right and left controllers and add line to them
        const rightController = renderer.xr.getController( 0 )
        rightController.add(line.clone())
        scene.add(rightController)

        const leftController = renderer.xr.getController( 1 )
        leftController.add(line.clone())
        scene.add(leftController)

        // Create right and left controller grips and add them to controllers
        const rightControllerGrip = renderer.xr.getControllerGrip( 0 )
        rightControllerGrip.add(controllerModelFactory.createControllerModel(rightControllerGrip))
        scene.add( rightControllerGrip )

        const leftControllerGrip = renderer.xr.getControllerGrip( 1 )
        leftControllerGrip.add(controllerModelFactory.createControllerModel(leftControllerGrip))
        scene.add(leftControllerGrip)

        /**
         * Raycaster is used to cast a ray and determine if it hits something
         * @type {Raycaster}
         */
        const raycaster = new THREE.Raycaster()
        // intersect is the first object that the raycast intersects with
        let intersect
        // description is the description of the celestial body the user has clicked
        let description = null
        // temporary matrix for saving controller position
        const tempMatrix = new THREE.Matrix4()
        // array for intersected object in VR
        const intersected = []

        /**
         * onSqueezeStart is called when user presses squeeze trigger on VR controller
         * then it check if controllers ray cast intersects any interactable object and if so description of object will popup
         * @param event
         */
        function onSqueezeStart(event) {
            const controller = event.target
            const intersections = getIntersections(controller)
            if(intersections.length > 0) {
                intersect = intersections[0].object
                description = createDescription(font, intersect)
                descriptionFadeIn(scene, description)
            }
        }

        /**
         * onSqueezeEnd is called when user releases squeeze trigger on VR controller and then check if there is active
         * description, if there is then it removes it
         * @param event
         */
        function onSqueezeEnd(event) {
            if (description) scene.remove(description)
        }

        /**
         * onSelectStart is called when user presses select button on VR controller and then checks if controllers ray cast hits
         * any interactable object if so attaches the object to controller so it can be inspected or moved while in hand
         * @param event
         */
        function onSelectStart(event) {
            const controller = event.target
            const intersections = getIntersections(controller)
            if(intersections.length > 0) {
                intersect = intersections[0].object
                controller.attach(intersect)
                controller.userData.selected = intersect
            }
        }

        /**
         * onSelectEnd is called when user releases select button on the VR controller. It checks if there is object attached to controller
         * if so it detaches it and adds the object back to scene.
         * @param event
         */
        function onSelectEnd(event) {
            const controller = event.target
            if(controller.userData.selected !== undefined) {
                const object = controller.userData.selected
                interactable.push(object)
                scene.add(object)
                controller.userData.selected = undefined
            }
        }

        /**
         * getIntersections is called when something needs to check if controllers ray cast hits any interactable object
         * returns array of intersected objects
         * @param controller
         * @returns {*[]|*}
         */
        function getIntersections(controller) {
            tempMatrix.identity().extractRotation(controller.matrixWorld)
            raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld)
            raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix)
            return raycaster.intersectObjects(interactable, false)
        }

        /**
         * intersectObjectVR is called when in VR mode to check if any object is not selected by controller
         * and line of controller intersects with an object
         * @param controller
         */
        function intersectObjectsVR(controller) {
            if(controller.userData.selected !== undefined) return
            const line = controller.getObjectByName('line')
            const intersections = getIntersections(controller)
            if(intersections.length > 0) {
                intersect = intersections[0].object
                intersected.push(intersect)
                line.scale.z = intersect.distance
            } else {
                line.scale.z = 5
            }
        }

        /**
         * Empties intersected array
         */
        function cleanIntersected() {
            while ( intersected.length ) {
                const object = intersected.pop();

            }
        }

        // isDragging determines if the user is dragging their mouse
        let isDragging
        // cameraTarget is the target where the camera is looking at
        let cameraTarget = sun.body

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

            const cameraOffset = 10
            const xDistance = Math.random() * 2 + 10

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

            const keys = [69, 73, 79, 80, 81, 82, 84, 85, 87, 89]
            if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || keys.includes(event.keyCode)) {
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
                    case 'q': transitionToTarget(earth.moonMesh[0])
                        break
                    case 'w': transitionToTarget(mars.moonMesh[0])
                        break
                    case 'e': transitionToTarget(mars.moonMesh[1])
                        break
                    case 'r': transitionToTarget(jupiter.moonMesh[0])
                        break
                    case 't': transitionToTarget(saturn.moonMesh[0])
                        break
                    case 'y': transitionToTarget(saturn.moonMesh[1])
                        break
                    case 'u': transitionToTarget(uranus.moonMesh[0])
                        break
                    case 'i': transitionToTarget(uranus.moonMesh[1])
                        break
                    case 'o': transitionToTarget(uranus.moonMesh[2])
                        break
                    case 'p': transitionToTarget(pluto.moonMesh[0])
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

        /**
         * updateCamera tracks the camera target. This is done via orbit controls.
         */
        function updateCamera() {
            cameraTarget.getWorldPosition(controls.target)
            controls.update()

            const direction = new THREE.Vector3()
            direction.subVectors(camera.position, controls.target)
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
            TWEEN.update()
            updateDescription()
            updateCamera()
            render()
            composer.render()
            renderer.render(scene, camera)
        }

        /**
         * Rendering loop for VR render, update framerate window and update VR controller functions only when renderer.xr.isPresenting is true
         */
        renderer.setAnimationLoop(function() {
            requestID = requestAnimationFrame(animate)
            stats.update()
            if(renderer.xr.isPresenting) {
                cleanIntersected()
                intersectObjectsVR(rightController)
                intersectObjectsVR(leftController)
            }


        })

        return () => {
            mountRef.current?.removeChild(renderer.domElement)
            // Bad practice to force context loss, but gets the job done
            renderer.forceContextLoss()
        }
    }, [])

    return <div ref={mountRef} />
}