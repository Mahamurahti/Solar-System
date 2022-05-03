import Head from "next/head"
import SolarSystem from "../components/Explore/SolarSystem"

/**
 * Creates an explorable Solar System page
 *
 * @author Timo Tamminiemi
 * @returns {JSX.Element}
 * @module Explore
 */
export default function Explore() {
    return (
        <>
            <Head>
                <title>Explore - Solar System</title>
                <meta name="description" content="Explore the Solar System" />
                <link rel="icon" href="/logo.svg" />
            </Head>
            <SolarSystem />
        </>
    )
}