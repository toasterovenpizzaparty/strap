import React from "react";
import styles from "./index.module.css";

type PropTypes = {
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
};

const Button: React.FC<PropTypes> = ({
  children,
  onClick,
  isDisabled,
  className = "",
}) => (
  <button
    className={[styles.button, className].join(" ")}
    disabled={isDisabled}
    onClick={onClick}
  >
    <p className={styles.text}>{children}</p>
  </button>
);

export default Button;
