import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import getTexturePath from "../../helpers/getTexturePath"
import createCelestialBody from "./createCelestialBody"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";

/**
 * Creates a solar system that can be interacted with.
 *
 * @author Timo Tamminiemi & Eric Keränen
 * @returns {JSX.Element}
 * @module SolarSystemVR
 */
export default function SolarSystemVR() {

    const mountRef = useRef(null)

    useEffect(() => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        /**
         * Scene for displaying 3D graphics. Scene has a cubemap of stars as background.
         * @type {Scene}
         * @namespace SolarSystemVR
         */
        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(Array(6).fill(getTexturePath("Stars")))

        /**
         * Perspective camera for defining the "eyes" of the scene. We can look at the scene through the camera.
         * @type {PerspectiveCamera}
         * @namespace SolarSystemVR
         */
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, .1, 1000)
        camera.position.set(-10, 10, 10)

        /**
         * Renderer renders the scene through the camera. Renderer has shadows enabled.
         * @type {WebGLRenderer}
         * @namespace SolarSystemVR
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
         * Ambient light to lighten up the scene artificially, meaning even the dark sides of celestial bodies
         * are slightly visible.
         * @type {AmbientLight}
         * @namespace SolarSystemVR
         */
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .2)
        scene.add(ambientLight)

        /**
         * Point light is the origin of the solar systems light. The point light is inside of the sun. Point light
         * is the light that makes other objects cast shadows.
         * @type {DirectionalLight}
         * @namespace SolarSystemVR
         */
        const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.9)
        dirLight.castShadow = true
        const shadowResolution = 640
        dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = shadowResolution
        scene.add(dirLight)

        // Create all relevant celestial bodies in the solar system
        const downScaleAmount = 16
        const sun = createCelestialBody("Sun", 16/downScaleAmount, getTexturePath("Sun"), 0)
        const mercury = createCelestialBody("Mercury", 3.2/downScaleAmount, getTexturePath("Mercury"), -28/downScaleAmount)
        const venus = createCelestialBody("Venus", 5.8/downScaleAmount, getTexturePath("Venus"), 44/downScaleAmount)
        const moon = { name: "Moon", size: 1.35/downScaleAmount, texture: getTexturePath("Moon"), position: 10/downScaleAmount, offsetAxis: 'x' }
        const earthMoon = [moon]
        const earth = createCelestialBody("Earth", 6/downScaleAmount, getTexturePath("Earth"), -62/downScaleAmount, earthMoon)
        const phobos = { name: "Phobos", size: 0.25/downScaleAmount, texture: getTexturePath("Phobos"), position: 4/downScaleAmount, offsetAxis: 'x' }
        const deimos = { name: "Deimos", size: 0.125/downScaleAmount, texture: getTexturePath("Deimos"), position: -6/downScaleAmount, offsetAxis: 'x' }
        const marsMoons = [phobos, deimos]
        const mars = createCelestialBody("Mars", 4/downScaleAmount, getTexturePath("Mars"), 78/downScaleAmount, marsMoons)
        const europa = { name: "Europa", size: 1.25/downScaleAmount, texture: getTexturePath("Europa"), position: -16/downScaleAmount, offsetAxis: 'x'}
        const jupiterMoons = [europa]
        const jupiter = createCelestialBody("Jupiter", 12/downScaleAmount, getTexturePath("Jupiter"), -100/downScaleAmount, jupiterMoons)
        const enceladus = { name: "Enceladus", size: 0.65/downScaleAmount, texture: getTexturePath("Enceladus"), position: 15/downScaleAmount, offsetAxis: 'x' }
        const titan = { name: "Titan", size: 2.02/downScaleAmount, texture: getTexturePath("Titan"), position: -20/downScaleAmount, offsetAxis: 'x' }
        const saturnMoons =  [enceladus, titan]
        const saturnRing = { innerRadius: 10/downScaleAmount, outerRadius: 20/downScaleAmount, texture: getTexturePath("Saturn").ring }
        const saturn = createCelestialBody("Saturn", 10/downScaleAmount, getTexturePath("Saturn").body, 138/downScaleAmount, saturnMoons, saturnRing)
        const ariel = { name: "Ariel", size: 0.65/downScaleAmount, texture: getTexturePath("Ariel"), position: -10/downScaleAmount, offsetAxis: 'x' }
        const titania = { name: "Titania", size: 0.741/downScaleAmount, texture: getTexturePath("Titania"), position: 12/downScaleAmount, offsetAxis: 'x' }
        const oberon = { name: "Oberon", size: 0.681/downScaleAmount, texture: getTexturePath("Oberon"), position: 12/downScaleAmount, offsetAxis: 'z' }
        const uranusMoons = [ariel, titania, oberon]
        const uranusRing = { innerRadius: 7/downScaleAmount, outerRadius: 12/downScaleAmount, texture: getTexturePath("Uranus").ring }
        const uranus = createCelestialBody("Uranus", 7/downScaleAmount, getTexturePath("Uranus").body, -176/downScaleAmount, uranusMoons, uranusRing)
        const neptune = createCelestialBody("Neptune", 7/downScaleAmount, getTexturePath("Neptune"), 200/downScaleAmount)
        const charon = { name: "Charon", size: 1.4/downScaleAmount, texture: getTexturePath("Charon"), position: -5/downScaleAmount, offsetAxis: 'z' }
        const plutoMoons = [charon]
        const pluto = createCelestialBody("Pluto", 2.8/downScaleAmount, getTexturePath("Pluto"), -216/downScaleAmount, plutoMoons)

        sun.body.castShadow = false

        const objects = [
            sun, mercury, venus, earth, mars,
            jupiter, saturn, uranus, neptune, pluto
        ]
        const interactable = []
        const group = new THREE.Group()

        for (const object of objects) {
            // Add object group to a separate group (celestial body, moons of celestial body and ring if it has one)
            group.add(object.group)
            // Add body of celestial body to be interactable
            interactable.push(object.body)
            // If the celestial body has moons, add all moons to be interactable
            if(object.moons) for (const moon of object.moons) interactable.push(moon)
            // If the celestial body has a ring, add it to be interactable
            if(object.ring) interactable.push(object.ring)
        }
        // Add the group as a whole to the scene
        scene.add(group)

        /**
         * createVRButton creates the button that can be clicked to access VR mode
         * @returns {Promise<HTMLButtonElement|HTMLAnchorElement>}
         * @namespace SolarSystemVR
         */
        async function createVRButton() {
            const button = await import("three/examples/jsm/webxr/VRButton").then(module => module.VRButton.createButton(renderer))
            document.body.appendChild(button)
            return button
        }
        const button = createVRButton()
        renderer.xr.enabled = true
        /**
         * XRControllerModelFactory provides the model that will be used as the controller in VR
         * @type {XRControllerModelFactory}
         * @namespace SolarSystemVR
         */
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
            rightController.addEventListener('squeeze', onSqueeze)
            leftController.addEventListener('squeeze', onSqueeze)

        })
        // When user exits VR mode reposition the camera and remove event listeners of controllers
        renderer.xr.addEventListener('sessionend', function () {
            scene.remove(cameraGroup)
            cameraGroup.remove(camera)
            rightController.removeEventListener('selectstart', onSelectStart)
            rightController.removeEventListener('selectend', onSelectEnd)
            leftController.removeEventListener('selectstart', onSelectStart)
            leftController.removeEventListener('selectend', onSelectEnd)
            rightController.removeEventListener('squeeze', onSqueeze)
            leftController.removeEventListener('squeeze', onSqueeze)
        })

        // Line geometry for VR controllers
        const geometry = new THREE.BufferGeometry()
        geometry.setFromPoints([new THREE.Vector3(0,0,0 ), new THREE.Vector3(0,0,-1)])
        const line = new THREE.Line(geometry)
        line.name = 'line'
        line.scale.z = 5

        // Create right and left controllers and add line to them
        const rightController = renderer.xr.getController(0)
        rightController.add(line.clone())
        scene.add(rightController)

        const leftController = renderer.xr.getController(1)
        leftController.add(line.clone())
        scene.add(leftController)

        // Create right and left controller grips and add them to controllers
        const rightControllerGrip = renderer.xr.getControllerGrip(0)
        rightControllerGrip.add(controllerModelFactory.createControllerModel(rightControllerGrip))
        scene.add(rightControllerGrip)

        const leftControllerGrip = renderer.xr.getControllerGrip(1)
        leftControllerGrip.add(controllerModelFactory.createControllerModel(leftControllerGrip))
        scene.add(leftControllerGrip)

        /**
         * Raycaster is used to cast a ray and determine if it hits something
         * @type {Raycaster}
         * @namespace SolarSystemVR
         */
        const raycaster = new THREE.Raycaster()
        // temporary matrix for saving controller position
        const tempMatrix = new THREE.Matrix4()
        // array for intersected object in VR
        const intersected = []
        // Speed of irbiting
        let orbitSpeed = 0.1

        /**
         * onSqueeze is called when user presses squeeze trigger on VR controller.
         * Pressing the squeeze button with right controller will speed up the orbiting clockwise of celestial bodies.
         * Pressing the squeeze button with left controller will speed up the orbiting counter clockwise of celestial
         * bodies.
         * @param event is used to get the controller
         * @namespace SolarSystemVR
         */
        function onSqueeze(event) {
            const controller = event.target
            if(controller === rightController) orbitSpeed += .2
            if(controller === leftController) orbitSpeed -= .2
        }

        /**
         * onSelectStart is called when user presses select button on VR controller and then checks if controllers
         * raycast hits any interactable object and if so, attaches the object to controller so it can be inspected
         * or moved while in hand.
         * @param event is used to get the controller
         * @namespace SolarSystemVR
         */
        function onSelectStart(event) {
            const controller = event.target
            const intersections = getIntersections(controller)
            if(intersections.length > 0) {
                const intersect = intersections[0]
                const object = intersect.object
                object.material.emissive.r = .2
                controller.attach( object )
                controller.userData.selected = object
            }
        }

        /**
         * onSelectEnd is called when user releases select button on the VR controller. It checks if there is object
         * attached to controller and if so, it detaches it and adds the object back to scene to the position it was
         * left to.
         * @param event is used to get the controller
         * @namespace SolarSystemVR
         */
        function onSelectEnd(event) {
            const controller = event.target
            if(controller.userData.selected !== undefined) {
                const object = controller.userData.selected
                object.material.emissive.r = 0
                group.attach(object)
                controller.userData.selected = undefined
            }
        }

        /**
         * getIntersections is called when something needs to check if controllers raycast hits any interactable object
         * returns array of intersected objects
         * @param controller is the used to determine is the controller the left one or the right one
         * @returns {Array}
         * @namespace SolarSystemVR
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
         * @param controller is the used to determine is the controller the left one or the right one
         * @namespace SolarSystemVR
         */
        function intersectObjectsVR(controller) {
            if(controller.userData.selected !== undefined) return
            const line = controller.getObjectByName('line')
            const intersections = getIntersections(controller)
            if(intersections.length > 0) {
                const intersect = intersections[0];
                const object = intersect.object;
                object.material.emissive.g = .2;
                intersected.push( object );
                line.scale.z = intersect.distance;
            } else {
                line.scale.z = 20
            }
        }

        /**
         * Empties intersected array and resets highlight color (green)
         * @namespace SolarSystemVR
         */
        function cleanIntersected() {
            while (intersected.length) {
                const object = intersected.pop();
                object.material.emissive.g = 0
            }
        }

        window.addEventListener('resize', onResize, false)

        /**
         * onResize scales the renderer and aspect ratio of the camera to screen size when the window size changes.
         * @namespace SolarSystemVR
         */
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        }

        /**
         * render updates the matrix world and renders the scene through the camera.
         * @namespace SolarSystemVR
         */
        function render() {
            camera.updateMatrixWorld()
            renderer.render(scene, camera)
        }

        /**
         * requestID is only used for performance matters. If the context is lost (which we force when the component
         * unmounts) the latest animation frame will be cancelled.
         * @namespace SolarSystemVR
         */
        let requestID

        /**
         * animate animates the scene. Animation frames are requested and called continuously. Every celestial body
         * is rotated around their own axis and all other celestial bodies except the sun are rotated around the origin
         * (the sun acts as the origin).
         * @namespace SolarSystemVR
         */
        const animate = function () {
            renderer.render(scene, camera)
        }

        /**
         * Rendering loop for VR render, update framerate window and update VR controller functions only when
         * renderer.xr.isPresenting is true, meaning VR mode is on.
         * @namespace SolarSystemVR
         */
        renderer.setAnimationLoop(function() {
            requestID = requestAnimationFrame(animate)

            if(renderer.xr.isPresenting) {
                cleanIntersected()
                intersectObjectsVR(rightController)
                intersectObjectsVR(leftController)

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
                group.rotateY(0.02 * orbitSpeed)

                // Rotate the matrix, which is applied to the moons
                const matrix = new THREE.Matrix4()
                earth.moons[0].position.applyMatrix4(matrix.makeRotationY(0.012 * negateDirection * rotateSpeed))
                mars.moons[0].position.applyMatrix4(matrix.makeRotationY(0.022 * negateDirection * rotateSpeed))
                mars.moons[1].position.applyMatrix4(matrix.makeRotationY(0.023 * negateDirection * rotateSpeed))
                jupiter.moons[0].position.applyMatrix4(matrix.makeRotationY(0.026 * negateDirection * rotateSpeed))
                saturn.moons[0].position.applyMatrix4(matrix.makeRotationY(0.022 * negateDirection * rotateSpeed))
                saturn.moons[1].position.applyMatrix4(matrix.makeRotationY(0.025 * negateDirection * rotateSpeed))
                uranus.moons[0].position.applyMatrix4(matrix.makeRotationY(0.016 * negateDirection * rotateSpeed))
                uranus.moons[1].position.applyMatrix4(matrix.makeRotationY(0.017 * negateDirection * rotateSpeed))
                uranus.moons[2].position.applyMatrix4(matrix.makeRotationY(0.018 * negateDirection * rotateSpeed))
                pluto.moons[0].position.applyMatrix4(matrix.makeRotationY(0.022 * negateDirection * rotateSpeed))
            }
        })

        return async () => {
            const session = renderer.xr.getSession();
            if (session !== null) session.end()
            document.body.removeChild(await button)
            mountRef.current?.removeChild(renderer.domElement)
            // Bad practice to force context loss, but gets the job done
            renderer.forceContextLoss()
        }
    }, [])

    return <div ref={mountRef} />
}