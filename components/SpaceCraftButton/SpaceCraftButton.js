// Libs
import PropTypes from "prop-types"
import classnames from "classnames"

// CSS Module
import styles from "./SpaceCraftButton.module.css"

export function SpaceCraftButton({ className, children: buttonContent, onClick = () => {} }) {
    const rootClassName = classnames(styles["button-upload"], className)

    return <>
        <button className={rootClassName} onClick={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36.089"
                height="34.388"
                className={styles["button-upload__logo"]}
                viewBox="0 0 36.089 34.388"
            >
                <g
                    transform="translate(22.577) rotate(49)"
                    className={styles["button-upload__logo--complete"]}
                >
                    <g
                        transform="translate(5.976 28.664)"
                        className={styles["button-upload__logo--trails"]}
                    >
                        <path
                            d="M153.97,738.46l1.692.055v6.115l-1.692-1.147"
                            transform="translate(-153.97 -738.46)"
                            fill="#fafafa"
                        />
                        <path
                            d="M337.1,738.46l-1.692.055v6.115l1.692-1.147"
                            transform="translate(-328.367 -738.46)"
                            fill="#fafafa"
                        />
                        <path
                            d="M243.98,738.46h1.692V747l-.846.939-.846-.971"
                            transform="translate(-240.486 -738.46)"
                            fill="#fafafa"
                        />
                    </g>
                    <g className={styles["button-upload__logo--rocket"]}>
                        <path
                            d="M19.627,21.9l-2.95-2.95A28.11,28.11,0,0,0,10.3,0,28.1,28.1,0,0,0,3.923,18.952L.973,21.9s-1.454,4.092-.8,6.822l4.393-4.378q.074.358.155.721H5.7l.981.979h3.606l.017-.979.017.979h3.605l.979-.979h.979q.083-.363.155-.721l4.393,4.378C21.082,25.994,19.627,21.9,19.627,21.9Zm-9.3-2.65a2.7,2.7,0,1,1,2.7-2.7A2.7,2.7,0,0,1,10.323,19.252Z"
                            transform="translate(-0.002 0)"
                            fill="#fafafa"
                        />
                    </g>
                </g>
            </svg>
            <span className={styles["button-upload__text"]}>{buttonContent}</span>
        </button>
    </>
}

SpaceCraftButton.propTypes = {
    /**
     * Button content
     */
    children: PropTypes.node,

    /**
     * Additionnal class name
     */
    className: PropTypes.string,

    /**
     * Button onCLick handler
     */
    onClick: PropTypes.func
}