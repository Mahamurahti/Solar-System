import styles from "../../styles/ListItem.module.sass"

export default function ListItem(props) {

    const text = props.children
    const linkText = text.split("-")[0]
    const descriptiveText = text.split("-")[1]

    const link = props.link

    return (
        <li>
            <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className={styles.link}
            >
                {linkText}
            </a> - {descriptiveText}
        </li>
    )
}