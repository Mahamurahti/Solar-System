export default function getTexturePath(name) {
    const dir = 'cubemap/'
    const red = 'red/', blue = 'blue/'
    const images = ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']
    switch (name) {
        case "CubemapRed": return images.map(image => dir + red + image)
        case "CubemapBlue": return images.map(image => dir + blue + image)
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
        case "Moon": return 'textures/moon.jpg'
        case "Europa": return 'textures/europa.jpg'
        case "Enceladus": return 'textures/enceladus.jpg'
        case "Titan": return 'textures/titan.jpg'
        case "Ariel": return 'textures/ariel.webp'
        case "Titania": return 'textures/titania.webp'
        case "Oberon": return 'textures/oberon.webp'
        case "Deimos": return 'textures/deimos.jpg'
        case "Phobos": return 'textures/phobos.jpg'
        case "Charon": return 'textures/charon.jpg'
    }
}