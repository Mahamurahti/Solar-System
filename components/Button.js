import styles from "../styles/Button.module.sass"
import Link from "next/link"

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