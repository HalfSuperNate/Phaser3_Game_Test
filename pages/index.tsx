import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Game from './game';
import Nav from './topNav';
//⭕️
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

      <header className={styles.topBar}>
        <ConnectButton />
        <Nav />
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.gameCanvas}>
            <Game />
          </div>
          <div id="chatBox" className={styles.chatBox}>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
