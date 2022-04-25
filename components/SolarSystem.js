import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {TWEEN} from "three/examples/jsm/libs/tween.module.min";

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
        objects.push(sun)
        scene.add(sun)

        /**
         * Creates a planet with specified instructions given in parameters.
         *
         * @param size of the planet
         * @param texture of the planet
         * @param position of the planet, dictates only starting position
         * @param ring object where the following has to be specified:
         *        innerRadius dictates the radius of the inner circle of the ring,
         *        outerRadius dictates the radius of the outer circle of the ring,
         *        texture of the ring
         * @returns {{planet: Mesh, planetGroup: Object3D}}
         */
        function createPlanet(size, texture, position, ring) {
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

            // Add planet to list of object in scene
            objects.push(planet)
            scene.add(planetGroup)

            planet.position.x = position

            return { planet, planetGroup }
        }

        // Create planet in solar system (plus pluto)
        const mercury = createPlanet(3.2, mercuryTexturePath, 28)
        const venus = createPlanet(5.8, venusTexturePath, 44)
        const earth = createPlanet(6, earthTexturePath, 62)
        const mars = createPlanet(4, marsTexturePath, 78)
        const jupiter = createPlanet(12, jupiterTexturePath, 100)
        const saturn = createPlanet(10, saturnTexturePath, 138, {
            innerRadius: 10,
            outerRadius: 20,
            texture: saturnRingTexturePath
        })
        const uranus = createPlanet(7, uranusTexturePath, 176, {
            innerRadius: 7,
            outerRadius: 12,
            texture: uranusRingTexturePath
        })
        const neptune = createPlanet(7, neptuneTexturePath, 200)
        const pluto = createPlanet(2.8, plutoTexturePath, 216)

        document.addEventListener('pointermove', onPointerMove)
        document.addEventListener('pointerdown', onPointerDown)
        document.addEventListener('keydown', onKeyDown)

        const raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2()
        let intersect
        /**
         * cameraTarget dictates where the camera is pointing. This scene must always have a cameraTarget.
         * Default cameraTarget is the sun.
         *
         * @type {Mesh}
         */
        let cameraTarget = sun

        /**
         * When user hovers mouse over planet, it will be highlighted. This function casts a raycast and checks
         * if it hits something from objects-variable. If it does, it set the emission of the intersected object
         * to a reddish color. Reset emission when not hovered over anything.
         *
         * @param event to get the position of the pointer in client
         */
        function onPointerMove(event) {
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
         * When user clicks over a planet, cameraTarget will change to the clicked planet. This function casts a raycast
         * and checks if it hits something from objects-variable. If it does, change cameraTarget and call tweenCamera.
         *
         * @param event to get the position of the pointer in client
         */
        function onPointerDown(event) {
            pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1)
            raycaster.setFromCamera(pointer, camera)
            const intersects = raycaster.intersectObjects(objects, false)
            if (intersects.length > 0) {
                cameraTarget = intersects[0].object
                tweenCamera()
            }
        }

        /**
         * Gets camera position and cameraTargets position and animates transition of camera between points.
         */
        function tweenCamera() {
            const direction = new THREE.Vector3()
            const cameraOffset = 80
            cameraTarget.getWorldPosition(direction)

            new TWEEN.Tween(camera.position)
                .to({x: direction.x, y: direction.y + cameraOffset, z: direction.z + cameraOffset}, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onStart(() =>
                    controls.enabled = false,
                )
                .onUpdate(() =>
                    camera.lookAt(direction),
                )
                .onComplete(() =>
                    controls.enabled = true,
                    controls.update()
                )
                .start()
        }

        /**
         * When number is pressed on keyboard cameraTarget will be changed to corresponding planet and tween called.
         * @param event to change cameraTarget to correspond a pressed key
         */
        function onKeyDown(event) {
            let pressedKey = event.key
            switch(pressedKey) {
                case '1':
                    cameraTarget = sun
                    tweenCamera()
                    break;
                case '2':
                    cameraTarget = mercury.planet
                    tweenCamera()
                    break;
                case '3':
                    cameraTarget = venus.planet
                    tweenCamera()
                    break;
                case '4':
                    cameraTarget = earth.planet
                    tweenCamera()
                    break;
                case '5':
                    cameraTarget = mars.planet
                    tweenCamera()
                    break;
                case '6':
                    cameraTarget = jupiter.planet
                    tweenCamera()
                    break;
                case '7':
                    cameraTarget = saturn.planet
                    tweenCamera()
                    break;
                case '8':
                    cameraTarget = uranus.planet
                    tweenCamera()
                    break;
                case '9':
                    cameraTarget = neptune.planet
                    tweenCamera()
                    break;
                case '0':
                    cameraTarget = pluto.planet
                    tweenCamera()
                    break;
            }
        }

        /**
         * Update camera position and offset. Camera is always pointing to cameraTarget-variable. cameraTarget-variables
         * position is continuously checked through .getWorldPosition()-method.
         */
        function updateCamera() {
            const direction = new THREE.Vector3()
            const cameraOffset = 80

            cameraTarget.getWorldPosition(controls.target)
            controls.update()

            direction.subVectors(camera.position, controls.target)
            // Comment to enable zooming
            //direction.normalize().multiplyScalar(cameraOffset)
            camera.position.copy(direction.add(controls.target))
        }

        window.addEventListener( 'resize', onResize, false )

        /**
         * Scale renderer and aspect ratio to screen size on resize.
         */
        function onResize() {
            camera.aspect = WIDTH / HEIGHT
            camera.updateProjectionMatrix()
            renderer.setSize(WIDTH, HEIGHT)
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
            TWEEN.update()
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

            if(controls.enabled) {
                updateCamera()
            }
            render()
        }

        animate()

        return () => mountRef.current?.removeChild(renderer.domElement)
    }, [])
    return (
        <div ref={mountRef} />
    )
}