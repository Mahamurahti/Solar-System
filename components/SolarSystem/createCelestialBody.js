import * as THREE from "three";

/**
 * Creates a celestial body.
 *
 * @author Timo Tamminiemi
 * @param name of the celestial body
 * @param size of the celestial body
 * @param texture of the celestial body
 * @param position of the celestial body in the solar system
 * @param ring of the celestial body (optional)
 * @returns {{body: Mesh, group: Object3D}}
 */
export default function createCelestialBody(name, size, texture, position, ring) {

    const textureLoader = new THREE.TextureLoader()

    const bodyGeometry = new THREE.SphereGeometry(size, 30, 30)
    const bodyMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture)
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.receiveShadow = true
    body.castShadow = true
    const group = new THREE.Object3D()

    group.add(body)

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
        ringMesh.position.x = position
        ringMesh.rotation.x = -0.5 * Math.PI
        group.add(ringMesh)
    }

    body.name = name
    body.position.x = position

    return { body, group }
}