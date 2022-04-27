import * as THREE from "three"
import createMoon from "./createMoon"
import createRing from "./createRing"

/**
 * Creates a celestial body.
 *
 * @author Timo Tamminiemi
 * @param name of the celestial body
 * @param size of the celestial body
 * @param texture of the celestial body
 * @param position of the celestial body in the solar system
 * @param ringParams of the celestial body (optional)
 * @param moonParams of the celestial body (optional)
 * @returns {{body: Mesh, group: Object3D}}
 */
export default function createCelestialBody(name, size, texture, position, moonParams, ringParams) {

    const textureLoader = new THREE.TextureLoader()

    let moons = []
    let ring

    const bodyGeometry = new THREE.SphereGeometry(size, 128, 128)
    const bodyMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture)
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.receiveShadow = true
    body.castShadow = true
    const group = new THREE.Object3D()

    group.add(body)

    if (ringParams) {
        ring = createRing(ringParams, position, name)
        group.add(ring)
    }
    if (moonParams) {
        for (const param of moonParams) {
            const moon = createMoon(param)
            moons.push(moon)
            body.add(moon)
        }
    }

    body.name = name
    body.position.x = position

    return { body, moons, ring, group }
}