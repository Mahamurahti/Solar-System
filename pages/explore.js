import Head from 'next/head'
import SolarSystem from "../components/SolarSystem/SolarSystem"

/**
 * Creates explorable solar system
 *
 * @author Timo Tamminiemi
 * @returns {JSX.Element}
 */
export default function Explore() {
    return (
        <>
            <Head>
                <title>Explore the Solar System</title>
                <meta name="description" content="Explore the Solar System" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SolarSystem />
        </>
    )
}