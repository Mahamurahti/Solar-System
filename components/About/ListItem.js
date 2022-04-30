import styles from "../../styles/ListItem.module.sass"

/**
 * Creates a list item for the list in About page
 *
 * @author Eric Keränen
 * @param props includes information about the text and link
 * @returns {JSX.Element}
 */
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