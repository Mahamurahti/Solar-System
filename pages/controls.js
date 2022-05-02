import Head from "next/head"
import styles from "../styles/Controls.module.sass"
import Panorama from "../components/Panorama"
import Control from "../components/Controls/Control"
import Footer from "../components/Footer"
import Button from "../components/Button"

/**
 * Creates the Controls page
 *
 * @author Eric Keränen
 * @returns {JSX.Element}
 */
export default function Controls() {
    return (
        <>
            <Head>
                <title>Controls - Solar System</title>
                <meta name="description" content="Controls of the Solar System web application" />
                <link rel="icon" href="/logo.svg" />
            </Head>

            <Panorama texturePath={"CubemapGreen"}/>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    CONTROLS
                </h1>

                <section className={styles.section}>
                    <h2>Mouse</h2>

                    <Control img={"/controls/mouse_move.png"} width={64} height={83} alt={"Mouse move icon"}>
                        Dragging your mouse while pressing down either mouse button 1 or 2 will orbit the camera
                        around the selected object.
                    </Control>

                    <Control img={"/controls/mouse_button_1.png"} width={64} height={83} alt={"Mouse button 1 icon"}>
                        Pressing mouse button 1 will either transition to an interactable object if the cursor is
                        over one and the mouse has not been dragged or fade away descriptions if the cursor isn&apos;t over
                        an interactable object and has not been dragged.
                    </Control>

                    <Control img={"/controls/mouse_button_2.png"} width={64} height={83} alt={"Mouse button 2 icon"}>
                        Pressing mouse button 2 will execute the same functionality as mouse button 1.
                    </Control>

                    <Control img={"/controls/mouse_scroll_up.png"} width={64} height={100} margin={true} alt={"Mouse scroll up icon"}>
                        Scrolling up will zoom in the camera if it isn&apos;t locked.
                    </Control>

                    <Control img={"/controls/mouse_scroll_down.png"} width={64} height={83} alt={"Mouse scroll down icon"}>
                        Scrolling down will zoom out the camera if it isn&apos;t locked.
                    </Control>

                    <Control img={"/controls/middle_mouse_button.png"} width={64} height={83} alt={"Middle mouse button icon"}>
                        Pressing middle mouse button and moving your mouse up or down will scroll in or out faster.
                    </Control>

                </section>

                <section className={styles.section}>
                    <h2>Keyboard</h2>

                    <p className={styles.description}>
                        Keyboard controls can also be found in the exploration scene by looking for a &lt; button in
                        the middle right of the screen. Hovering over this button will show a border around the button.
                        Clicking the button will show the controls explained below. Clicking the button again will hide
                        the controls.
                        <br/><br/>
                        By pressing any button on the keyboard, the executed command will briefly show on the middle
                        of the bottom of the screen.
                    </p>

                    <Control img={"/controls/button_space.png"} width={81} height={92} alt={"Space button icon"}>
                        Pressing space will stop all planets orbit around the Sun. Moons will not be affected and will
                        continue orbiting their parent.
                    </Control>

                    <Control img={"/controls/button_control.png"} width={67} height={91} alt={"Control button icon"}>
                        Pressing control will lock the camera zoom level. This will disable the ability to zoom, but
                        now the camera will not just look at the target, but also follow the target the zoom level it
                        was locked in.
                    </Control>

                    <Control img={"/controls/button_one.png"} width={67} height={90} margin={true} alt={"One button icon"}>
                        Pressing button one will transition to the Sun.
                    </Control>

                    <Control img={"/controls/button_two.png"} width={67} height={90} margin={true} alt={"Two button icon"}>
                        Pressing button two will transition to the planet Mercury.
                    </Control>

                    <Control img={"/controls/button_three.png"} width={67} height={90} margin={true} alt={"Three button icon"}>
                        Pressing button three will transition to the planet Venus.
                    </Control>

                    <Control img={"/controls/button_four.png"} width={67} height={90} margin={true} alt={"Four button icon"}>
                        Pressing button four will transition to the planet Earth.
                    </Control>

                    <Control img={"/controls/button_five.png"} width={67} height={90} margin={true} alt={"Five button icon"}>
                        Pressing button five will transition to the planet Mars.
                    </Control>

                    <Control img={"/controls/button_six.png"} width={67} height={90} margin={true} alt={"Six button icon"}>
                        Pressing button five will transition to the gas giant Jupiter.
                    </Control>

                    <Control img={"/controls/button_seven.png"} width={67} height={90} margin={true} alt={"Seven button icon"}>
                        Pressing button five will transition to the gas giant Saturn.
                    </Control>

                    <Control img={"/controls/button_eight.png"} width={67} height={90} margin={true} alt={"Eight button icon"}>
                        Pressing button eight will transition to the ice giant Uranus.
                    </Control>

                    <Control img={"/controls/button_nine.png"} width={67} height={90} margin={true} alt={"Nine button icon"}>
                        Pressing button nine will transition to the ice giant Neptune.
                    </Control>

                    <Control img={"/controls/button_zero.png"} width={67} height={90} margin={true} alt={"Zero button icon"}>
                        Pressing button zero will transition to the dwarf planet Pluto.
                    </Control>

                    <Control img={"/controls/button_Q.png"} width={67} height={90} margin={true} alt={"Q button icon"}>
                        Pressing button Q will transition to Earths moon.
                    </Control>

                    <Control img={"/controls/button_W.png"} width={67} height={90} margin={true} alt={"W button icon"}>
                        Pressing button Q will transition to Mars&apos; moon Phobos.
                    </Control>

                    <Control img={"/controls/button_E.png"} width={67} height={90} margin={true} alt={"E button icon"}>
                        Pressing button E will transition to Mars&apos; moon Deimos.
                    </Control>

                    <Control img={"/controls/button_R.png"} width={67} height={90} margin={true} alt={"R button icon"}>
                        Pressing button R will transition to Jupiter&apos;s moon Europa.
                    </Control>

                    <Control img={"/controls/button_T.png"} width={67} height={90} margin={true} alt={"T button icon"}>
                        Pressing button T will transition to Saturn&apos;s moon Enceladus.
                    </Control>

                    <Control img={"/controls/button_Y.png"} width={67} height={90} margin={true} alt={"Y button icon"}>
                        Pressing button Y will transition to Saturn&apos;s moon Titan.
                    </Control>

                    <Control img={"/controls/button_U.png"} width={67} height={90} margin={true} alt={"U button icon"}>
                        Pressing button U will transition to Uranus&apos; moon Ariel.
                    </Control>

                    <Control img={"/controls/button_I.png"} width={67} height={90} margin={true} alt={"I button icon"}>
                        Pressing button I will transition to Uranus&apos; moon Titania.
                    </Control>

                    <Control img={"/controls/button_O.png"} width={67} height={90} margin={true} alt={"O button icon"}>
                        Pressing button O will transition to Uranus&apos; moon Oberon.
                    </Control>

                    <Control img={"/controls/button_P.png"} width={67} height={90} alt={"P button icon"}>
                        Pressing button P will transition to Pluto&apos;s moon Charon.
                    </Control>

                </section>

                <section className={styles.section}>
                    <h2>VR</h2>
                    <p className={styles.description}>
                        VR controls are only available in the VR mode of the Solar System. Other controls in this mode
                        will be disabled and only the VR controls will function.
                    </p>

                    <Control img={"/controls/vr_trigger_right.png"} width={146} height={230} alt={"VR right trigger button icon"}>
                        Squeezing the right trigger will pickup interactable object if controllers ray cast hits it.
                    </Control>

                    <Control img={"/controls/vr_grip_right.png"} width={146} height={230} alt={"VR right grip button icon"}>
                        Squeezing the right grip will slow down orbit speed of solar system.
                    </Control>


                    <Control img={"/controls/vr_trigger_left.png"} width={146} height={230} alt={"VR left trigger button icon"}>
                        Squeezing the left trigger will execute same functionality as right trigger.
                    </Control>

                    <Control img={"/controls/vr_grip_left.png"} width={146} height={230} alt={"VR left grip button icon"}>
                        Squeezing the left grip will speed up orbit speed of solar system.
                    </Control>

                </section>

                <Button link={"/"}>Back</Button>
            </main>

            <Footer />
        </>
    )
}
