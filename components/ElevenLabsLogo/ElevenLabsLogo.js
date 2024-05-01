// Libs
import PropTypes from "prop-types"
import Image from "next/image"
import classnames from "classnames"

// CSS Module
import styles from "./ElevenLabsLogo.module.css"

export function ElevenLabsLogo({ className }) {
    const rootClassName = classnames(styles.container, className);

    return <div className={rootClassName}>
        <Image
          alt="Eleven Labs Logo"
          src="/logo-eleven-labs.png"
          layout="responsive"
          objectFit="contain"
          width="100%"
          height="100%"
          priority
        />
    </div>
}

ElevenLabsLogo.propTypes = {
    /**
     * Additionnal class names
     */
    className: PropTypes.string
};