import Head from "next/head";
import SolarSystemVR from "../components/SolarSystem/SolarSystemVR";

/**
 * Creates explorable solar system in with vr option
 *
 * @author Timo Tamminiemi
 * @returns {JSX.Element}
 */
export default function ExploreVR() {
    return (
        <>
            <Head>
                <title>Explore the Solar System in VR</title>
                <meta name="description" content="Explore the Solar System in VR" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SolarSystemVR />
        </>
    )
}