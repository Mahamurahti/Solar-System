import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import getTexturePath from "../../helpers/getTexturePath"
import createCelestialBody from "./createCelestialBody"
import Stats from "three/examples/jsm/libs/stats.module";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";

/**
 * Creates a solar system that can be interacted with.
 *
 * @author Timo Tamminiemi & Eric Keränen
 * @returns {JSX.Element}
 * @constructor
 */
export default function SolarSystemVR() {

    const mountRef = useRef(null)

    useEffect(() => {
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
         * Ambient light to lighten up the scene artificially, meaning even the dark sides of celestial bodies
         * are slightly visible.
         * @type {AmbientLight}
         */
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, .2)
        scene.add(ambientLight)

        /**
         * Point light is the origin of the solar systems light. The point light is inside of the sun. Point light
         * is the light that makes other objects cast shadows.
         * @type {DirectionalLight}
         */
        const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.9)
        dirLight.castShadow = true
        const shadowResolution = 640
        dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = shadowResolution
        scene.add(dirLight)

        const stats = new Stats()
        document.body.appendChild(stats.dom)

        // Create all relevant celestial bodies in the solar system
        const sun = createCelestialBody("Sun", 16/16, getTexturePath("Sun"), 0)
        const mercury = createCelestialBody("Mercury", 3.2/16, getTexturePath("Mercury"), -28/16)
        const venus = createCelestialBody("Venus", 5.8/16, getTexturePath("Venus"), 44/16)
        const earthMoon = [{size: 1.35/16, texture: getTexturePath("Moon"), name: "Moon", position: 10/16, offsetAxis: 'x'}]
        const earth = createCelestialBody("Earth", 6/16, getTexturePath("Earth"), -62/16, earthMoon)
        let marsMoons = [{size: 0.25/16, texture: getTexturePath("Phobos"), name: "Phobos", position: 4/16, offsetAxis: 'x'},
        {size: 0.125/16, texture: getTexturePath("Deimos"), name: "Deimos", position: -6/16, offsetAxis: 'x'}]
        const mars = createCelestialBody("Mars", 4/16, getTexturePath("Mars"), 78/16, marsMoons)
        const jupiterMoons = [{size: 1.25/16, texture: getTexturePath("Europa"), name: "Europa", position: -16/16, offsetAxis: 'x'}]
        const jupiter = createCelestialBody("Jupiter", 12/16, getTexturePath("Jupiter"), -100/16, jupiterMoons)
        const saturnRing = { innerRadius: 10/16, outerRadius: 20/16, texture: getTexturePath("Saturn").ring }
        const saturnMoons =  [{size: 0.65/16, texture: getTexturePath("Enceladus"), name: "Enceladus", position: 15/16, offsetAxis: 'x'},
            {size: 2.02/16, texture: getTexturePath("Titan"), name: "Titan", position: -20/16, offsetAxis: 'x'}]
        const saturn = createCelestialBody("Saturn", 10/16, getTexturePath("Saturn").body, 138/16, saturnMoons, saturnRing)
        const uranusRing = { innerRadius: 7/16, outerRadius: 12/16, texture: getTexturePath("Uranus").ring }
        const uranusMoons = [{size: 0.65/16, texture: getTexturePath("Ariel"), name: "Ariel", position: -10/16, offsetAxis: 'x'},
            {size: 0.741/16, texture: getTexturePath("Titania"), name: "Titania", position: 12/16, offsetAxis: 'x'},
            {size: 0.681/16, texture: getTexturePath("Oberon"), name: "Oberon", position: 12/16, offsetAxis: 'z'}]
        const uranus = createCelestialBody("Uranus", 7/16, getTexturePath("Uranus").body, -176/16, uranusMoons, uranusRing)
        const neptune = createCelestialBody("Neptune", 7/16, getTexturePath("Neptune"), 200/16)
        let plutoMoons = [{size: 1.4/16, texture: getTexturePath("Kharon"), name: "Kharon", position: -5/16, offsetAxis: 'z'}]
        const pluto = createCelestialBody("Pluto", 2.8/16, getTexturePath("Pluto"), -216/16, plutoMoons)

        sun.body.castShadow = false

        const objects = [
            sun, mercury, venus, earth, mars,
            jupiter, saturn, uranus, neptune, pluto
        ]
        const interactable = []
        const group = new THREE.Group()

        for (const object of objects) {
            // Add group to scene (celestial body, moons of celestial body and ring if it has one)
            group.add(object.group)
            // Add body of celestial body to be interactable
            interactable.push(object.body)
            // If the celestial body has moons, add all moons to be interactable
            if(object.moons) for (const moon of object.moons) interactable.push(moon)
            // If the celestial body has a ring, add it to be interactable
            if(object.ring) interactable.push(object.ring)
        }
        scene.add(group)

        async function createVRButton() {
            const button = await import("three/examples/jsm/webxr/VRButton").then(module => module.VRButton.createButton(renderer))
            document.body.appendChild(button)
            return button
        }
        const button = createVRButton()
        renderer.xr.enabled = true
        const controllerModelFactory = new XRControllerModelFactory()

        // Camera position when entered in VR
        const cameraGroup = new THREE.Group()
        cameraGroup.position.set(0, 5, 2)

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
        // temporary matrix for saving controller position
        const tempMatrix = new THREE.Matrix4()
        // array for intersected object in VR
        const intersected = []
        // Speed of irbiting
        let orbitSpeed = 0.1

        /**
         * onSqueezeStart is called when user presses squeeze trigger on VR controller
         * then it check if controllers ray cast intersects any interactable object and if so description of object will popup
         * @param event
         */
        function onSqueeze(event) {
            const controller = event.target
            if(controller === rightController) {
                orbitSpeed += .2
            }
            if(controller === leftController) {
                orbitSpeed -= .2
            }
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
                const intersect = intersections[0]
                const object = intersect.object
                object.material.emissive.r = .2
                controller.attach( object )
                controller.userData.selected = object
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
                object.material.emissive.r = 0
                group.attach(object)
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
         * Empties intersected array
         */
        function cleanIntersected() {
            while (intersected.length) {
                const object = intersected.pop();
                object.material.emissive.g = 0
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