import React from "react";
import styles from "./index.module.css";

/**
 *
 * @description Provides a title, h1 element
 */
const Title: React.FC = ({ children }) => (
  <h1 className={styles.title}>{children}</h1>
);

export default Title;
