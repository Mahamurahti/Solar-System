import Head from 'next/head'
import Link from "next/link"
import styles from '../styles/Home.module.sass'

import Panorama from "../components/Panorama/Panorama"
import Footer from "../components/Footer";

/**
 * Creates the Home page
 *
 * @author Eric Keränen
 * @returns {JSX.Element}
 * @constructor
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
          <div className={styles.card}>
            <Link href="/explore">
              <a>
                <h2 className={styles.card_text}>
                  <div className={styles.arrow}>&lt;</div>
                  {' '}Explore{' '}
                  <div className={styles.arrow}>&gt;</div>
                </h2>
              </a>
            </Link>
          </div>


          <div className={styles.card}>
            <Link href="/about">
              <a>
                <h2 className={styles.card_text}>
                  <div className={styles.arrow}>&lt;</div>
                  {' '}About{' '}
                  <div className={styles.arrow}>&gt;</div>
                </h2>
              </a>
            </Link>
          </div>

          <div className={styles.card}>
            <Link href="/controls">
              <a>
                <h2 className={styles.card_text}>
                  <div className={styles.arrow}>&lt;</div>
                  {' '}Controls{' '}
                  <div className={styles.arrow}>&gt;</div>
                </h2>
              </a>
            </Link>
          </div>

          <div className={styles.card}>
            <a href="https://bit.ly/3vs64pT" target="_blank" rel="noreferrer">
              <h2 className={styles.card_text}>
                <div className={styles.arrow}>&lt;</div>
                {' '}Surprise{' '}
                <div className={styles.arrow}>&gt;</div>
              </h2>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
