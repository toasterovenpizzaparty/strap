import React from "react";
import styles from "./index.module.css";

type TextInputPropsType = {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onKeyUp?: (key: string) => void;
};

/**
 *
 * @description Provides a text input with onKeyUp and onChange events.
 */
const TextInput: React.FC<TextInputPropsType> = ({
  value,
  placeholder,
  onChange,
  onKeyUp,
}) => (
  <input
    className={styles.textinput}
    type='text'
    value={value}
    placeholder={placeholder}
    onChange={(event) => onChange?.(event.target?.value)}
    onKeyUp={(event) => onKeyUp?.(event.key)}
  />
);

export default TextInput;
