import styles from "../../styles/Control.module.sass"
import Image from "next/image"

/**
 * Creates a Control element, which describes the action of a control i.e. mouse button, keyboard key or VR button.
 * Control element is for the Controls page.
 *
 * @author Eric Keränen
 * @param props includes information about if an extra margin is needed,
 * image link, image width, image height and image alt
 * @returns {JSX.Element}
 */
export default function Control(props) {
    return (
        <div className={`${styles.row} ${props.margin && styles.margin}`}>
            <span className={styles.icon}>
                <Image src={props.img} width={props.width} height={props.height} alt={props.alt} />
            </span>
            <p className={styles.description}>
                {props.children}
            </p>
        </div>
    )
}