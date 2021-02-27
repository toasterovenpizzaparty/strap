import React from "react";
import styles from "./index.module.css";
import Title from "../Title";

type ErrorMessagePropsType = {
  isVisible?: boolean;
  title?: string;
  className?: string;
};
/**
 *
 * @description Provides a generic error message
 */
const ErrorMessage: React.FC<ErrorMessagePropsType> = ({
  title,
  children,
  isVisible,
  className,
}) =>
  isVisible ? (
    <div className={[styles.error, className].join(" ")}>
      {title && <Title>{title}</Title>}
      {children && <p>{children}</p>}
    </div>
  ) : null;
export default ErrorMessage;
