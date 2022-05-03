import styles from "../styles/Button.module.sass"
import Link from "next/link"

/**
 * Creates a Button element
 *
 * @author Eric Keränen
 * @param props contains information about the link
 * @returns {JSX.Element}
 * @module Button
 */
export default function Button(props) {
    return (
        <div className={styles.button}>
            <Link href={props.link}>
                <a>
                    <h2 className={styles.button_text}>
                        <div className={styles.arrow}>&lt;</div>
                        {` ${props.children} `}
                        <div className={styles.arrow}>&gt;</div>
                    </h2>
                </a>
            </Link>
        </div>
    )
}