import Spline from "@splinetool/react-spline";
import { useContext } from "react";
import { MobileContext } from "../context/MobileContext";
import styles from "../styles/Home.module.css";
import navStyles from "../styles/Navbar.module.css";
import { IconContext } from "react-icons";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import Image from "next/image";
import pdkuPic from "../assets/images/pdku1.jpg";

const splineMobile =
  "https://prod.spline.design/tonMvP9-Hbl2rmVS/scene.splinecode";
const splineDesktop =
  "https://prod.spline.design/6WK1Tz8owGTkSgdj/scene.splinecode";

export default function App() {
  const isMobile = useContext(MobileContext);
  return (
    <div className={styles.page}>
      <Spline
        className={styles.spline2}
        scene={isMobile ? splineMobile : splineDesktop}
      />
      {/* <h1 className={`${styles.title}`}>
        <span>Please</span> <span>Don&apos;t</span> <span>Kill</span>{" "}
        <span>Us</span>
      </h1> */}
      <section className={styles.heroSection}>
        <div className={styles.content}>
          <h1 className={`${styles.title}`}>
            <span>Please</span> <span>Don&apos;t</span> <span>Kill</span>{" "}
            <span>Us</span>
          </h1>
          <h2>
            <span>The</span> <span>Interactive</span>{" "}
            <span>
              <span className={styles.accent}>D&D</span> Live Show
            </span>
          </h2>
        </div>
      </section>
      <div className={styles.scrollDownContainer}>
        <IconContext.Provider value={{ className: styles.scrollDownIcon }}>
          <MdKeyboardDoubleArrowDown />
        </IconContext.Provider>
      </div>

      <section className={styles.aboutSection}>
        <div className={styles.imageContainer}>
          <h2>A New Kind Of Table</h2>
          <Image
            className={`${styles.aboutImage} ${styles.image}`}
            src={pdkuPic}
            alt="hi"
            sizes="100vw"
          ></Image>
        </div>
        <div className={styles.content}>
          {/* <div className="indent"> */}
          {/* <h3>Here&apos;s how it works</h3> */}
          <p>
            <span className="primary bold">Please Don&apos;t Kill Us</span> is
            an interactive <span className="bold">Dungeons & Dragons</span> show
            that puts the power in the viewers hands to make decisions through
            polls that will change the future of the game! But{" "}
            <span className="primary bold">please.....</span>
            don&apos;t kill us.
          </p>
          {/* </div> */}
        </div>
      </section>

      {/* <section className={styles.nextSection}>
        <h2>The Interactive D&D Live Show</h2>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni illum
          rem quae!
        </p>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni illum
          rem quae Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Neque, deleniti? Exercitationem dolore repellat in, alias officiis
          obcaecati cum autem aut possimus deleniti nulla. Veniam excepturi at
          blanditiis, ut maxime fugiat.!
        </p>
      </section> */}
    </div>
  );
}
