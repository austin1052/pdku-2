import About from "../components/sections/About";
import Hero from "../components/sections/Hero";
import styles from "../styles/sections/index.module.css";

export default function App() {
  function handleScroll(event: any) {
    console.log(event.currentTarget);
  }

  return (
    <div className={styles.page} onScroll={handleScroll}>
      <Hero />
      <About />
    </div>
  );
}
