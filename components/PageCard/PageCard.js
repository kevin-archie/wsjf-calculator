// Libs
import PropTypes from "prop-types"
import classnames from "classnames"

// CSS Module
import styles from "./PageCard.module.css"

export function PageCard({ children: cardContent, className }) {
    const rootClassName = classnames(styles["page-card"], className)
    return <div className={rootClassName}>
        { cardContent }
    </div>
}

PageCard.propTypes = {
    /**
     * Card content
     */
    children: PropTypes.node,

    /**
     * Additionnal class names
     */
    className: PropTypes.string
}