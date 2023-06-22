import Image from "next/image";
import pdkuPic from "../../assets/images/pdku1.jpg";
import styles from "../../styles/sections/index.module.css";
import sectionStyles from "../../styles/sections/About.module.css";

export default function About() {
  return (
    <section className={sectionStyles.section}>
      <div className={sectionStyles.imageContainer}>
        <Image
          className={`${sectionStyles.image}`}
          src={pdkuPic}
          alt="hi"
          sizes="100vw"
        ></Image>
      </div>
      <div className={styles.content}>
        <h2>
          The Interactive <span className="primary">D&D</span> Live Show
        </h2>
        {/* <div className={styles.titleContainer}> */}
        {/* <h2>
          <span>A New Kind</span> <span>Of Table</span>
        </h2> */}
        {/* </div> */}
        <div className={sectionStyles.infoContainer}>
          <div>
            <h3>Here&apos;s how it works</h3>
            <p>
              <span className="bold">Please Don&apos;t Kill Us</span> is an
              interactive <span className="bold">Dungeons & Dragons</span> show
              that puts the power in the viewers hands to make decisions through
              polls that will change the future of the game! But{" "}
              <span className="bold">please.....</span>
              don&apos;t kill us.
            </p>
          </div>
          <div className={sectionStyles.playersInfo}>
            <h3>The Players</h3>
            <p>
              We play live, in person, around a table in{" "}
              <span className="bold">New York City!</span> Our goal is to make
              live D&D more accessible and approachable for everyone, so we try
              to keep our episodes between 2-3 hours.{" "}
            </p>

            <p>
              From home-brewed adventures, to published content, to one shots,
              to making an actual AI robot be our Dungeon Master, you never know
              what is in store for you at PDKU.
            </p>
          </div>
          <div className={sectionStyles.killersInfo}>
            <h3>The Killers</h3>
            <p>
              Here&apos;s what makes PDKU different. Throughout the game, the
              audience votes <span className="bold">LIVE</span> on what happens
              to us and around us. They have chosen everything from a characters
              death, to who someone is going to play in a campaign, to picking a
              real life tattoo for one of the cast! Watching live is the best
              way to experience PDKU at its best!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
