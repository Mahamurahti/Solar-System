import Head from "next/head"
import styles from "../styles/Home.module.sass"
import Panorama from "../components/Panorama"
import Footer from "../components/Footer"
import Button from "../components/Button"
import Image from "next/image"

/**
 * Creates the Home page
 *
 * @author Eric Keränen
 * @returns {JSX.Element}
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Solar System</title>
        <meta name="description" content="Solar System exploration web application" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <Panorama texturePath={"CubemapRed"}/>

      <main className={styles.main}>
        <h1 className={styles.title}>
            S
            <span className={styles.logo}>
                <Image src={"/logo.svg"} width={100} height={80} />
            </span>
            LAR SYSTEM
        </h1>


        <p className={styles.description}>
          The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. Of the bodies
          that orbit the Sun directly, the largest are the four gas and ice giants and the four terrestrial planets,
          followed by an unknown number of dwarf planets and innumerable small Solar System bodies.
        </p>

        <div className={styles.grid}>
            <Button link={"/explore"}>Explore</Button>
            <Button link={"/vr"}>Sandbox VR</Button>
            <Button link={"/controls"}>Controls</Button>
            <Button link={"/about"}>About</Button>
        </div>
      </main>

      <Footer />
    </>
  )
}
