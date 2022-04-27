import * as THREE from "three"
import createMoon from "./createMoon"
import createRing from "./createRing"

/**
 * Creates a celestial body, adds ring and moon by callig their own function and randomizes starting position in solar system.
 *
 * @author Timo Tamminiemi
 * @param name of the celestial body
 * @param size of the celestial body
 * @param texture of the celestial body
 * @param position of the celestial body in the solar system
 * @param ring of the celestial body (optional)
 * @param moon of the celestial body (optional)
 * @returns {{body: Mesh, group: Object3D}}
 */
export default function createCelestialBody(name, size, texture, position, ring, moon) {

    const textureLoader = new THREE.TextureLoader()

    let moonMesh = []
    let ringMesh
    const bodyGeometry = new THREE.SphereGeometry(size, 128, 128)
    const bodyMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture)
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.receiveShadow = true
    body.castShadow = true
    const group = new THREE.Object3D()

    group.add(body)

    body.name = name
    let ringPosition
    let axis = Math.floor(Math.random() * 2)  === 0
    if(axis) {
        body.position.x = position
        ringPosition = {x: body.position.x, y: body.position.y, z: body.position.z}
    } else {
        body.position.z = position
        ringPosition = {x: body.position.x, y: body.position.y, z: body.position.z}
    }

    if (ring) {
        ringMesh = createRing(ring, ringPosition)
        if (body.name === 'Uranus') {
            ringMesh.rotation.y = 90
        }
        group.add(ringMesh)
    }
    if (moon) {
        for (let i = 0; i < moon.length; i++) {
            moonMesh[i] = createMoon(moon[i])
            body.add(moonMesh[i])
        }
    }
    return { body, group, moonMesh }
}