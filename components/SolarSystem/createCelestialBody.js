import * as THREE from "three";
import createMoon from "./createMoon";
import createRing from "./createRing";

/**
 * Creates a celestial body.
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

    if (ring) {
        ringMesh = createRing(ring, position)

        group.add(ringMesh)
    }
    if (moon) {
        for (let i =0; i<moon.length; i++) {
            moonMesh[i] = createMoon(moon[i])
            body.add(moonMesh[i])
        }
    }

    body.name = name
    body.position.x = position

    return { body, group, moonMesh }
}