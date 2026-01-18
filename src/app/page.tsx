import Link from "next/link";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <div className={styles.brand}>NestJS Learning Platform</div>
        <Link href="/learn" className={styles.navLink}>
          Go to course
        </Link>
      </nav>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Learn NestJS, step by step.</h1>
          <p className={styles.subtitle}>
            Follow the guided lessons and track your progress as you build
            production-ready skills.
          </p>
          <Link href="/learn" className={styles.cta}>
            Start learning
          </Link>
        </section>
      </main>
    </div>
  );
}
