import Head from "next/head";
import SolarSystemVR from "../components/Explore/SolarSystemVR";

/**
 * Creates explorable solar system sandbox with VR interactions
 *
 * @author Timo Tamminiemi
 * @returns {JSX.Element}
 * @module ExploreVR
 */
export default function ExploreVR() {
    return (
        <>
            <Head>
                <title>VR - Solar System</title>
                <meta name="description" content="Explore the Solar System in VR" />
                <link rel="icon" href="/logo.svg" />
            </Head>
            <SolarSystemVR />
        </>
    )
}