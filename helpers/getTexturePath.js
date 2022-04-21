export default function getTexturePath(name) {
    switch (name) {
        case "Stars": return 'textures/stars.jpg'
        case "Sun": return 'textures/sun.jpg'
        case "Mercury": return 'textures/mercury.jpg'
        case "Venus": return 'textures/venus.jpg'
        case "Earth": return 'textures/earth.jpg'
        case "Mars": return 'textures/mars.jpg'
        case "Jupiter": return 'textures/jupiter.jpg'
        case "Saturn": return { body: 'textures/saturn.jpg', ring: 'textures/saturn ring.png' }
        case "Uranus": return { body: 'textures/uranus.jpg', ring: 'textures/uranus ring.png' }
        case "Neptune": return 'textures/neptune.jpg'
        case "Pluto": return 'textures/pluto.jpg'
    }
}