import styles from "../styles/Loader.module.css";

interface Props {
  size?: "small" | undefined;
}

export default function Loader({ size }: Props) {
  let loaderStyle = `${styles.loader}`;
  switch (size) {
    case "small":
      loaderStyle = loaderStyle + ` ${styles.small}`;
  }

  return (
    <div className={loaderStyle}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
