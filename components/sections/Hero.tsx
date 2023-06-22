import { useContext } from "react";
import Spline from "@splinetool/react-spline";
import { MobileContext } from "../../context/MobileContext";
import { IconContext } from "react-icons";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import styles from "../../styles/sections/index.module.css";
import sectionStyles from "../../styles/sections/Hero.module.css";

export default function Hero() {
  const isMobile = useContext(MobileContext);

  const splineMobile =
    // "https://prod.spline.design/7cHwkk1QvlavikLB/scene.splinecode";
    "https://prod.spline.design/tonMvP9-Hbl2rmVS/scene.splinecode";
  const splineDesktop =
    // "https://prod.spline.design/L1tNSbB7IoyyYCn8/scene.splinecode";
    "https://prod.spline.design/6WK1Tz8owGTkSgdj/scene.splinecode";

  return (
    <section className={`${sectionStyles.section}`}>
      <Spline
        className={sectionStyles.spline}
        scene={isMobile ? splineMobile : splineDesktop}
      />
      <div className={styles.content}>
        <h1>
          <span>Please</span> <span>Don&apos;t</span> <span>Kill</span>{" "}
          <span>Us</span>
        </h1>
        {/* <h2>
          <span>The</span> <span>Interactive</span>{" "}
          <span>
            <span className="primary">D&D</span> Live Show
          </span>
        </h2> */}
        {/* <h2>
          The Interactive <span className="primary">D&D</span> Live Show
        </h2> */}
      </div>
      {/* <div className={sectionStyles.scrollDownContainer}>
        <IconContext.Provider
          value={{ className: sectionStyles.scrollDownIcon }}
        >
          <MdKeyboardDoubleArrowDown />
        </IconContext.Provider>
      </div> */}
    </section>
  );
}
