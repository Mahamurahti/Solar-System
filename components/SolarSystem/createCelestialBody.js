import * as THREE from "three";

export default function createCelestialBody(name, size, texture, position, ring) {

    const textureLoader = new THREE.TextureLoader()

    const bodyGeometry = new THREE.SphereGeometry(size, 30, 30)
    const bodyMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load(texture)
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
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