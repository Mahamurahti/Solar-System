import Head from "next/head"
import styles from "../styles/About.module.sass"
import Panorama from "../components/Panorama"
import Footer from "../components/Footer"
import ListItem from "../components/About/ListItem"
import Button from "../components/Button"

/**
 * Creates the About page
 *
 * @author Eric Keränen
 * @returns {JSX.Element}
 */
export default function About() {
    return (
        <>
            <Head>
                <title>About - Solar System</title>
                <meta name="description" content="About the Solar System web application" />
                <link rel="icon" href="/logo.svg" />
            </Head>

            <Panorama texturePath={"CubemapBlue"}/>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    ABOUT
                </h1>

                <section className={styles.section}>
                    <h2>The Project</h2>
                    <p className={styles.description}>
                        This project was done as the final project of a 3D-modeling and mixed reality course for
                        Metropolia UAS. The goal of the project was to make an application that somehow utilized 3D
                        objects, panorama images, 360 images, XR (extended reality) elements or photogrammetry. We
                        decided to go with a web application where the user can explore a 3D Solar System. The project
                        was designed to be more educational in nature so we decided to add interesting facts and
                        information about the objects in our Solar System.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Sources</h2>
                    <p className={styles.description}>
                        The project had many inspirations and sources, from which we took ideas from. Our main inspiration
                        was from a <a href="https://www.youtube.com/watch?v=XXzqSAt3UIw" className={styles.link}
                        target="_blank" rel="noreferrer">Youtube video</a> by Wael Yasmina who created a working Solar System with
                        Three.js. After this we tried to make the scene our own by adding more objects and making them
                        interactable, which we did by ourselves. We also wanted a functional camera to the scene and
                        decided to add Tween.js into the fold. Tween.js allowed us to make really nice transitions
                        between celestial bodies and description fades. The descriptions were taken from Wikipedia and
                        NASA. We looked for potentially interesting facts and information that might interest some people.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Technologies</h2>
                    <ul className={styles.list}>
                        <ListItem link={"https://nextjs.org/"}>Next.js - React framework</ListItem>
                        <ListItem link={"https://threejs.org/"}>Three.js - 3D computer graphic library</ListItem>
                        <ListItem link={"https://github.com/tweenjs/tween.js/"}>Tween.js - animation engine</ListItem>
                        <ListItem link={"https://sass-lang.com/"}>Sass - CSS preprocessor</ListItem>
                        <ListItem link={"https://git-scm.com/"}>Git - version control</ListItem>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>Textures</h2>
                    <ul className={styles.list}>
                        <ListItem link={"https://tools.wwwtyro.net/space-3d/index.html"}>
                            Space Panoramas - procedurally created cubemaps of space
                        </ListItem>
                        <ListItem link={"https://www.solarsystemscope.com/textures/"}>
                            Celestial body textures - all relevant textures of bodies in our Solar System
                        </ListItem>
                        <ListItem link={"https://www.celestiamotherlode.net/"}>
                            Moon textures - most moon texture maps in our Solar System
                        </ListItem>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2 className={styles.red}>!!! NOTES !!!</h2>
                    <p className={styles.description}>
                        <b>The Solar System isn&apos;t completely to scale</b> even though distances and sizes are roughly
                        calculated according to astronomical units. Some exceptions are the Sun, which is literally so
                        big it would cover up too much of the scene, and the gas giants. <b>Not all moon are
                        present</b>, since we only added moon we could find textures for. The same reason applies for
                        the numerous trans-Neptunian dwarf planets except Pluto.
                    </p>
                </section>

                <Button link={"/"}>Back</Button>
            </main>

            <Footer />
        </>
    )
}
