// Libs
import PropTypes from "prop-types"
import classnames from "classnames"

// CSS Module
import styles from "./Button.module.css"

export function Button({ children: buttonContent, className, onClick=() => {} }) {
    const rootClassName = classnames(styles.button, className)

    return <button className={rootClassName} onClick={onClick}>{ buttonContent }</button>
}

Button.propTypes = {
    /**
     * Children JSX Elements
     */
    children: PropTypes.node.isRequired,

    /**
     * Additionnal class name
     */
    className: PropTypes.string
}