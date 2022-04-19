import Head from 'next/head'
import Image from 'next/image'
import Link from "next/link";
import styles from '../styles/Home.module.css'

import Panorama from "../components/Panorama";

export default function Home() {
  return (
    <>
      <Head>
        <title>Solar System</title>
        <meta name="description" content="Explore the solar system!" />
        {/*<link rel="icon" href="/favicon.ico" />*/}
      </Head>

      <Panorama />

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
            <Link href="/">
              <a>
                <h2>
                  <div className={styles.arrow}>&lt;</div>
                  {' '}Explore{' '}
                  <div className={styles.arrow}>&gt;</div>
                </h2>
              </a>
            </Link>
          </div>

          <div className={styles.card}>
            <Link href="/">
              <a>
                <h2>
                  <div className={styles.arrow}>&lt;</div>
                  {' '}About{' '}
                  <div className={styles.arrow}>&gt;</div>
                </h2>
              </a>
            </Link>
          </div>

          <div className={styles.card}>
            <Link href="/">
              <a>
                <h2>
                  <div className={styles.arrow}>&lt;</div>
                  {' '}Technologies{' '}
                  <div className={styles.arrow}>&gt;</div>
                </h2>
              </a>
            </Link>
          </div>

          <div className={styles.card}>
            <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
              <h2>
                <div className={styles.arrow}>&lt;</div>
                {' '}Surprise{' '}
                <div className={styles.arrow}>&gt;</div>
              </h2>
            </a>
          </div>
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
