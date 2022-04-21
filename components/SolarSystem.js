import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import getDescription from "../helpers/getDescription"

/**
 * Creates a solar system that can be interacted with
 *
 * @author Timo Tamminiemi & Eric Keränen
 * @returns {JSX.Element}
 * @constructor
 */
export default function SolarSystem() {

    const mountRef = useRef(null)

    const starTexturePath = 'textures/stars.jpg'
    const sunTexturePath = 'textures/sun.jpg'
    const earthTexturePath = 'textures/earth.jpg'
    const jupiterTexturePath = 'textures/jupiter.jpg'
    const marsTexturePath = 'textures/mars.jpg'
    const mercuryTexturePath = 'textures/mercury.jpg'
    const neptuneTexturePath = 'textures/neptune.jpg'
    const plutoTexturePath = 'textures/pluto.jpg'
    const saturnTexturePath = 'textures/saturn.jpg'
    const saturnRingTexturePath = 'textures/saturn ring.png'
    const uranusTexturePath = 'textures/uranus.jpg'
    const uranusRingTexturePath = 'textures/uranus ring.png'
    const venusTexturePath = 'textures/venus.jpg'
    const robotoFontPath = 'fonts/Roboto_Regular.json'

    useEffect(()  => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        /**
         * Create scene with stars as a background cubemap
         *
         * @type {Scene}
         */
        const scene = new THREE.Scene()
        scene.background = new THREE.CubeTextureLoader().load(Array(6).fill(starTexturePath))

        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
        camera.position.set(-90, 140, 140)

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(WIDTH, HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)

        // --- Change to hemisphere light and tweak settings, light comes from the sun --- //
        const dirLight = new THREE.DirectionalLight(0xffffff)
        scene.add(dirLight)

        const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300)
        scene.add(pointLight)
        // --- //

        mountRef.current?.appendChild(renderer.domElement)

        /**
         * Add orbit controls to scene. Orbit controls are used to orbit around selected planet.
         *
         * @type {OrbitControls}
         */
        const controls = new OrbitControls(camera, renderer.domElement)

        /**
         * Used to store all interactable object in scene.
         *
         * @type {Array}
         */
        const objects = []

        const textureLoader = new THREE.TextureLoader()
        const sunGeometry = new THREE.SphereGeometry(16, 30, 30)
        const sunMaterial = new THREE.MeshPhongMaterial({
            map: textureLoader.load(sunTexturePath)
        })
        const sun = new THREE.Mesh(sunGeometry, sunMaterial)
        sun.name = "Sun"
        objects.push(sun)
        scene.add(sun)

        /**
         * Creates a planet with specified instructions given in parameters.
         *
         * @param name of the planet
         * @param size of the planet
         * @param texture of the planet
         * @param position of the planet, dictates only starting position
         * @param ring object where the following has to be specified:
         *        innerRadius dictates the radius of the inner circle of the ring,
         *        outerRadius dictates the radius of the outer circle of the ring,
         *        texture of the ring
         * @returns {{planet: Mesh, planetGroup: Object3D}}
         */
        function createPlanet(name, size, texture, position, ring) {
            const planetGeometry = new THREE.SphereGeometry(size, 30, 30)
            const planetMaterial = new THREE.MeshPhongMaterial({
                map: textureLoader.load(texture)
            })
            const planet = new THREE.Mesh(planetGeometry, planetMaterial)
            const planetGroup = new THREE.Object3D()

            // Group used to group up sphere and ring if planet has one
            planetGroup.add(planet)

            if(ring) {
                const ringGeometry = new THREE.RingGeometry(
                    ring.innerRadius,
                    ring.outerRadius,
                    32
                )
                const ringMaterial = new THREE.MeshPhongMaterial({
                    map: textureLoader.load(ring.texture),
                    side: THREE.DoubleSide
                })
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
                planetGroup.add(ringMesh)
                ringMesh.position.x = position
                ringMesh.rotation.x = -0.5 * Math.PI
            }

            planet.name = name

            // Add planet to list of object in scene
            objects.push(planet)
            scene.add(planetGroup)

            planet.position.x = position

            return { planet, planetGroup }
        }

        // Create planet in solar system (plus pluto)
        const mercury = createPlanet("Mercury", 3.2, mercuryTexturePath, 28)
        const venus = createPlanet("Venus", 5.8, venusTexturePath, 44)
        const earth = createPlanet("Earth", 6, earthTexturePath, 62)
        const mars = createPlanet("Mars", 4, marsTexturePath, 78)
        const jupiter = createPlanet("Jupiter", 12, jupiterTexturePath, 100)
        const saturn = createPlanet("Saturn", 10, saturnTexturePath, 138, {
            innerRadius: 10,
            outerRadius: 20,
            texture: saturnRingTexturePath
        })
        const uranus = createPlanet("Uranus", 7, uranusTexturePath, 176, {
            innerRadius: 7,
            outerRadius: 12,
            texture: uranusRingTexturePath
        })
        const neptune = createPlanet("Neptune", 7, neptuneTexturePath, 200)
        const pluto = createPlanet("Pluto", 2.8, plutoTexturePath, 216)

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('pointerup', onPointerUp)

        let moved, intersect, text, cameraTarget = sun
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
            pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1)
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(objects, false)
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
            pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1)
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(objects, false)
            if (intersects.length > 0) {
                cameraTarget = intersects[0].object
                const fontLoader = new FontLoader();
                fontLoader.load(robotoFontPath, function (font) {
                    scene.remove(text)
                    const fontMaterial = new THREE.LineBasicMaterial({
                        color: 0xff0000,
                    });
                    const message = getDescription(cameraTarget.name)
                    const shapes = font.generateShapes(message, 4);
                    const geometry = new THREE.ShapeGeometry(shapes);
                    geometry.computeBoundingBox();
                    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
                    geometry.translate(xMid, 0, 0);
                    text = new THREE.Mesh(geometry, fontMaterial)
                    description = text
                    scene.add(text)
                })
            } else {
                if (!moved) scene.remove(text)
            }
        }

        let description = null;

        function updateText()  {
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

        window.addEventListener( 'resize', onResize, false )

        /**
         * Scale renderer and aspect ratio to screen size on resize.
         */
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
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
            sun.rotateY(0.004)
            mercury.planet.rotateY(0.004)
            venus.planet.rotateY(0.002)
            earth.planet.rotateY(0.02)
            mars.planet.rotateY(0.018)
            jupiter.planet.rotateY(0.04)
            saturn.planet.rotateY(0.038)
            uranus.planet.rotateY(0.03)
            neptune.planet.rotateY(0.032)
            pluto.planet.rotateY(0.008)

            // Around sun rotation
            mercury.planetGroup.rotateY(0.04 * orbitSpeed)
            venus.planetGroup.rotateY(0.015 * orbitSpeed)
            earth.planetGroup.rotateY(0.01 * orbitSpeed)
            mars.planetGroup.rotateY(0.008 * orbitSpeed)
            jupiter.planetGroup.rotateY(0.002 * orbitSpeed)
            saturn.planetGroup.rotateY(0.0009 * orbitSpeed)
            uranus.planetGroup.rotateY(0.0004 * orbitSpeed)
            neptune.planetGroup.rotateY(0.0001 * orbitSpeed)
            pluto.planetGroup.rotateY(0.00007 * orbitSpeed)

            updateText()
            updateCamera()
            render()
        }

        animate()

        return () => mountRef.current?.removeChild(renderer.domElement)
    }, [])
    return (
        <div ref={mountRef} />
    )
}