import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import Loader from "./Loader";
import styles from "../styles/Button.module.css";

interface Props {
  size?: "small" | undefined;
  text: string | number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ size, text, onClick }: Props) {
  const { isLoading } = useContext(CartContext);
  let buttonStyle = `${styles.button}`;
  switch (size) {
    case "small":
      buttonStyle = buttonStyle + ` ${styles.small}`;
  }
  return (
    <button
      onClick={onClick}
      className={buttonStyle}
      role="button"
      // disabled={isLoading}
    >
      {text}
    </button>
  );
}
