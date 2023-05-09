import styles from "../styles/Button.module.css";

interface Props {
  size?: "small" | undefined;
  text: string | number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

export default function Button({ size, text, onClick }: Props) {
  let buttonStyle = `${styles.button}`;
  switch (size) {
    case "small":
      buttonStyle = buttonStyle + ` ${styles.small}`;
  }

  console.log(buttonStyle);
  return (
    <div onClick={onClick} className={buttonStyle} role="button">
      {text}
    </div>
  );
}
