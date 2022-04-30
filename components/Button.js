import styles from "../styles/Button.module.sass"
import Link from "next/link"

/**
 * Creates a Button element
 *
 * @author Eric Keränen
 * @param props contains information about the link, text and whether the link is to an external site or not
 * @returns {JSX.Element}
 */
export default function Button(props) {
    return props.external ? (
        <div className={styles.button}>
            <a href={props.link} target="_blank" rel="noreferrer">
                <h2 className={styles.button_text}>
                    <div className={styles.arrow}>&lt;</div>
                    {` ${props.children} `}
                    <div className={styles.arrow}>&gt;</div>
                </h2>
            </a>
        </div>
    ) : (
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