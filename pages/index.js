import Head from "next/head"
import styles from "../styles/Home.module.sass"
import Panorama from "../components/Panorama"
import Footer from "../components/Footer"
import Button from "../components/Button"

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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Panorama texturePath={"CubemapRed"}/>

      <main className={styles.main}>
        <h1 className={styles.title}>
          SOLAR SYSTEM
        </h1>


        <p className={styles.description}>
          The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. Of the bodies
          that orbit the Sun directly, the largest are the four gas and ice giants and the four terrestrial planets,
          followed by an unknown number of dwarf planets and innumerable small Solar System bodies.
        </p>

        <div className={styles.grid}>
          <Button link={"/explore"}>Explore</Button>
          <Button link={"/about"}>About</Button>
          <Button link={"/controls"}>Controls</Button>
          <Button link={"https://bit.ly/3vs64pT"} external={true}>Surprise</Button>
        </div>
      </main>

      <Footer />
    </>
  )
}
