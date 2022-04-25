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
 * @param moon of the celestial body
 * @returns {{body: Mesh, group: Object3D}}
 */
export default function createCelestialBody(name, size, texture, position, ring, moon) {

    const textureLoader = new THREE.TextureLoader()
    let moonMesh, ringMesh
    const bodyGeometry = new THREE.SphereGeometry(size, 30, 30)
    const bodyMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture)
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    const group = new THREE.Object3D()

    group.add(body)

    if(ring) {
        ringMesh = createRing(ring, position)

        group.add(ringMesh)
    }
    else if(moon) {
        moonMesh = createMoon(moon)
        body.add(moonMesh)
    }

    body.name = name
    body.position.x = position

    return { body, group, moonMesh }
}