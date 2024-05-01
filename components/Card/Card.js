// Libs
import PropTypes from "prop-types";
import classnames from "classnames";
import Image from "next/image"

// CSS Module
import styles from "./Card.module.css"

export function Card({ backgroundColorClass, children: cardContent, className, imageAlt, imagePath, title }) {
    const rootClassName = classnames(styles.card, className);

    return <div className={rootClassName}>
        <div className={classnames(styles["card__face"], styles["card__face__recto"])}>
            <div className={styles["card__content"]}>
                <div className={classnames(styles.icon, backgroundColorClass)}>
                    <Image
                        alt={imageAlt}
                        src={imagePath}
                        layout="responsive"
                        objectFit="contain"
                        width="300px"
                        height="200px"
                        priority
                    />
                </div>
            </div>
        </div>
        <div className={classnames(styles["card__face"], styles["card__face__verso"])}>
            <div className={styles["card__content"]}>
                <h3>
                    {title}
                </h3>
                {cardContent}
            </div>
        </div>
    </div>
}

Card.propTypes = {
    /**
     * class name to change element background color
     */
    backgroundColorClass: PropTypes.string,

    /**
     * Card description content
     */
    children: PropTypes.node,

    /**
     * Additionnal class name
     */
    className: PropTypes.string,

    /**
     * Element image description
     */
    imageAlt: PropTypes.string,

    /**
     * Element image path
     */
    imagePath: PropTypes.string,

    /**
     * Card description title
     */
    title: PropTypes.string
}