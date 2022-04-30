import styles from "../../styles/Control.module.sass";
import Image from "next/image";

export default function Control(props) {
    return (
        <>
            <div className={`${styles.row} ${props.margin && styles.margin}`}>
                <span className={styles.icon}>
                    <Image src={props.img} width={props.width} height={props.height}/>
                </span>
                <p className={styles.description}>
                    {props.children}
                </p>
            </div>
        </>
    )
}