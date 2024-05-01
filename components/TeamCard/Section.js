// Libs
import PropTypes from "prop-types"
import classnames from "classnames"

// CSS Module
import styles from "./Section.module.css"

export function Section({ children: sectionContent, className, title }) {
    const rootClassName = classnames(styles.section, className)
    return <div className={rootClassName}>
        <div className={styles["section__title"]}>{ title }</div>
        <div>
            { sectionContent }
        </div>
    </div>
}

Section.propTypes = {
    /**
     * Children JSX Elements
     */
    children: PropTypes.node.isRequired,

    /**
     * Additionnal class names
     */
    className: PropTypes.string,

    /**
     * Section title
     */
    title: PropTypes.string
}