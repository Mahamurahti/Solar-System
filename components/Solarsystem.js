import * as THREE from 'three'
import {useEffect, useRef} from 'react'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export default function Solarsystem(props) {
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
        const scene = new THREE.Scene()
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight
        const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({antialias: true})
        const light = new THREE.DirectionalLight(0xffffff)

        renderer.setSize(WIDTH, HEIGHT)
        renderer.setPixelRatio(window.devicePixelRatio)
        scene.add(light)
        const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
        scene.add(pointLight);

        mountRef.current.appendChild(renderer.domElement)
        const controls = new OrbitControls(camera, renderer.domElement)
        //const cameraControls = new CameraControls(camera, renderer.domElement, {dollyToCursor: false})

        //cameraControls.update()

        camera.position.set(-90, 140, 140);
        //controls.update();


        const envMapSides = [starTexturePath,starTexturePath,starTexturePath,starTexturePath,starTexturePath,starTexturePath]
        const environmentMap = new THREE.CubeTextureLoader().load(envMapSides);

        scene.background = environmentMap

        const planetTextureLoader = new THREE.TextureLoader();

        const sunGeometry = new THREE.SphereGeometry(16, 30, 30);
        const sunMaterial = new THREE.MeshPhongMaterial({
            map: planetTextureLoader.load(sunTexturePath)
        })
        const sun = new THREE.Mesh(sunGeometry, sunMaterial)
        scene.add(sun)
        const group = new THREE.Group()
        function createPlanet(size, texture, position, ring) {
            const planetGeometry = new THREE.SphereGeometry(size, 30, 30);
            const planetMaterial = new THREE.MeshStandardMaterial({
                map: planetTextureLoader.load(texture)
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            const planetGroup = new THREE.Object3D();
            planetGroup.add(planet);
            if(ring) {
                const ringGeometry = new THREE.RingGeometry(
                    ring.innerRadius,
                    ring.outerRadius,
                    32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    map: planetTextureLoader.load(ring.texture),
                    side: THREE.DoubleSide
                });
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                planetGroup.add(ringMesh);
                ringMesh.position.x = position;
                ringMesh.rotation.x = -0.5 * Math.PI;
            }
            scene.add(planetGroup);
            //group.add(planetGroup)
            planet.position.x = position;

            return {planet, planetGroup}
        }

        const mercury = createPlanet(3.2, mercuryTexturePath, 28);
        const venus = createPlanet(5.8, venusTexturePath, 44);
        const earth = createPlanet(6, earthTexturePath, 62);
        const mars = createPlanet(4, marsTexturePath, 78);
        const jupiter = createPlanet(12, jupiterTexturePath, 100);
        const saturn = createPlanet(10, saturnTexturePath, 138, {
            innerRadius: 10,
            outerRadius: 20,
            texture: saturnRingTexturePath
        });
        const uranus = createPlanet(7, uranusTexturePath, 176, {
            innerRadius: 7,
            outerRadius: 12,
            texture: uranusRingTexturePath
        });
        const neptune = createPlanet(7, neptuneTexturePath, 200);
        const pluto = createPlanet(2.8, plutoTexturePath, 216);

        const planets = {
            sun, earth, mars, mercury, venus, jupiter, saturn, uranus, neptune, pluto
        }

        //scene.add(group)

        let raycaster = new THREE.Raycaster()
        const pointer = new THREE.Vector2();
        function onPointerMove( event ) {

            pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        }

        document.addEventListener('mousemove', onPointerMove)
        let INTERSECTED;

        function render() {

            camera.updateMatrixWorld();
            raycaster.setFromCamera( pointer, camera );

            const intersects = raycaster.intersectObjects( scene.children, true );
            console.log(scene.children)
            if ( intersects.length > 0 ) {
                if ( INTERSECTED != intersects[ 0 ].object ) {
                    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                    INTERSECTED = intersects[ 0 ].object;
                    if(INTERSECTED.material) {
                        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                        INTERSECTED.material.emissive.setHex( 0xff0000 );
                    }
                    console.log('osu')
                }
            } else {
                if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                INTERSECTED = null;
            }
            renderer.render(scene, camera)
        }

        const animate = function () {
            requestAnimationFrame(animate)
            sun.rotateY(0.004);
            mercury.planet.rotateY(0.004);
            venus.planet.rotateY(0.002);
            earth.planet.rotateY(0.02);
            mars.planet.rotateY(0.018);
            jupiter.planet.rotateY(0.04);
            saturn.planet.rotateY(0.038);
            uranus.planet.rotateY(0.03);
            neptune.planet.rotateY(0.032);
            pluto.planet.rotateY(0.008);

            //Around-sun-rotation
            mercury.planetGroup.rotateY(0.04);
            venus.planetGroup.rotateY(0.015);
            earth.planetGroup.rotateY(0.01);
            mars.planetGroup.rotateY(0.008);
            jupiter.planetGroup.rotateY(0.002);
            saturn.planetGroup.rotateY(0.0009);
            uranus.planetGroup.rotateY(0.0004);
            neptune.planetGroup.rotateY(0.0001);
            pluto.planetGroup.rotateY(0.00007);
            render();
        }
        animate()

        window.addEventListener('resize', function() {
            camera.aspect = WIDTH / HEIGHT
            camera.updateProjectionMatrix();
            renderer.setSize(WIDTH, HEIGHT)
        })


        return () => {
            mountRef.current?.removeChild(renderer.domElement)
        }
    }, [])
    return (
        <div ref={mountRef} />
    )
}