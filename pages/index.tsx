import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Game from './game';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Test Game App</title>
        <meta
          content="Game testing Phaser3 , Grid Engine, and Web3"
          name="description"
        />
        <link href="/favicon.png" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />
        <Game/>
               
      </main>

      <footer className={styles.footer}>
        {/* <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
          Made with ❤️ by your frens at 🌈
        </a> */}
      </footer>
    </div>
  );
};

export default Home;
