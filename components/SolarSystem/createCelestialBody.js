import * as THREE from "three"
import createMoon from "./createMoon"
import createRing from "./createRing"

/**
 * Creates a celestial body. Accompanies celestial body with a ring and moons, if the celestial body has either or both.
 *
 * @author Timo Tamminiemi
 * @param name of the celestial body
 * @param size of the celestial body
 * @param texture of the celestial body
 * @param position of the celestial body in the solar system
 * @param moonParams of the celestial body (optional)
 * @param ringParams of the celestial body (optional)
 * @returns {{body: Mesh, moons: [], ring: Mesh, group: Object3D}}
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
        const radii = { innerRadius: ringParams.innerRadius, outerRadius: ringParams.outerRadius }
        ring = createRing(
            name,
            radii,
            ringParams.texture,
            position
        )
        group.add(ring)
    }
    if (moonParams) {
        for (const param of moonParams) {
            const moon = createMoon(
                param.name,
                param.size,
                param.texture,
                param.offset,
                param.offsetAxis
            )
            moons.push(moon)
            body.add(moon)
        }
    }

    body.name = name
    body.position.x = position

    return { body, moons, ring, group }
}