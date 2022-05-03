import * as THREE from "three"
import createMoon from "./createMoon"
import createRing from "./createRing"

/**
 * Creates a celestial body. Accompanies celestial body with a ring and moons, if the celestial body has either or both.
 * Final positions of celestial bodies is random.
 *
 * @author Timo Tamminiemi
 * @param name of the celestial body
 * @param size of the celestial body
 * @param texture of the celestial body
 * @param position of the celestial body in the solar system
 * @param moonParams of the celestial body (optional)
 * @param ringParams of the celestial body (optional)
 * @returns {Object}
 * @module createCelestialBody
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
    const group = new THREE.Object3D()

    group.add(body)

    const axis = Math.floor(Math.random() * 2)  === 0
    if(axis) body.position.x = position
    else body.position.z = position

    const ringPosition = { x: body.position.x, y: body.position.y, z: body.position.z }

    if (ringParams) {
        const radii = {
            innerRadius: ringParams.innerRadius,
            outerRadius: ringParams.outerRadius
        }
        ring = createRing(
            name,
            radii,
            ringParams.texture,
            ringPosition
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

    body.receiveShadow = true
    body.castShadow = true

    return { body, moons, ring, group }
}