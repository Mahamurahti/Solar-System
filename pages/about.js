import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link"
import styles from '../styles/About.module.sass'

import Panorama from "../components/Panorama/Panorama"

/**
 * Creates the About page
 *
 * @author Eric Keränen
 * @returns {JSX.Element}
 * @constructor
 */
export default function About() {
    return (
        <>
            <Head>
                <title>About - Solar System</title>
                <meta name="description" content="About the Solar System web application" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Panorama texturePath={"CubemapBlue"}/>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    ABOUT
                </h1>

                <section className={styles.section}>
                    <h2>The Project</h2>
                    <p className={styles.description}>
                        This project was done as the final project of a 3D-modeling course for Metropolia UAS. The goal
                        of the project was to make an application that somehow utilized 3D objects, panorama images,
                        360 images, XR (extended reality) elements or photogrammetry. We decided to go with a web
                        application where the user can explore a 3D Solar System.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Sources</h2>
                    <p className={styles.description}>
                        The project had many inspirations and sources, from which we took ideas from.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Technologies</h2>
                    <ul className={styles.list}>
                        <li>
                            <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
                                Next.js
                            </a> - React framework
                        </li>
                        <li>
                            <a href="https://threejs.org/" target="_blank" rel="noreferrer">
                                Three.js
                            </a> - 3D computer graphic library
                        </li>
                        <li>
                            <a href="https://github.com/tweenjs/tween.js/" target="_blank" rel="noreferrer">
                                Tween.js
                            </a> - animation engine
                        </li>
                        <li>
                            <a href="https://sass-lang.com/" target="_blank" rel="noreferrer">
                                Sass
                            </a> - CSS pre-processor
                        </li>
                        <li>
                            <a href="https://git-scm.com/" target="_blank" rel="noreferrer">
                                Git
                            </a> - version control
                        </li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>Textures</h2>
                    <ul className={styles.list}>
                        <li>
                            <a href="https://tools.wwwtyro.net/space-3d/index.html" target="_blank" rel="noreferrer">
                                Space Panoramas
                            </a> - procedurally created cubemaps of space
                        </li>
                        <li>
                            <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">
                                Celestial body textures
                            </a> - all relevant textures of bodies in our Solar System
                        </li>
                    </ul>
                </section>

                <div className={styles.button}>
                    <Link href="/">
                        <a>
                            <h2 className={styles.button_text}>
                                <div className={styles.arrow}>&lt;</div>
                                {' '}Back{' '}
                                <div className={styles.arrow}>&gt;</div>
                            </h2>
                        </a>
                    </Link>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </>
    )
}
