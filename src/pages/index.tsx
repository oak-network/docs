import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className="hero__content">
          <h1 className="hero__title">
            Oak Network
          </h1>
          <p className="hero__subtitle">
            From Roots to Routes.
          </p>
          <p className="hero__description">
            Decentralized crowdfunding infrastructure on Celo. Build the future of fundraising 
            with our comprehensive suite of smart contracts. Enable any application to leverage 
            blockchain technology with transparent fees and secure infrastructure.
          </p>
          <div className={styles.buttons}>
            <Link
              className={styles.buttonPrimary}
              to="/docs/intro">
              Get Started
            </Link>
            <Link
              className={styles.buttonSecondary}
              to="/docs/roadmap">
              View Roadmap
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomepageStats() {
  return (
    <section className={styles.stats}>
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>1%</div>
          <div className={styles.statLabel}>PROTOCOL FEE</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>100%</div>
          <div className={styles.statLabel}>TRANSPARENT</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>∞</div>
          <div className={styles.statLabel}>POSSIBILITIES</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statNumber}><i className="fas fa-globe"></i></div>
          <div className={styles.statLabel}>CELO NETWORK</div>
        </div>
      </div>
    </section>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h2 className={styles.featuresTitle}>Built for Everyone</h2>
        <p className={styles.featuresSubtitle}>
          From Individual Developers to Enterprise Platforms
        </p>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-hexagon"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-hexagon"></i>
            </div>
            <h3 className={styles.featureCard__title}>Infrastructure First</h3>
            <p className={styles.featureCard__description}>
              Oak Network is designed as infrastructure, not just another platform. Any application can integrate our smart contracts to add crowdfunding capabilities.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-shield-check"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-shield-check"></i>
            </div>
            <h3 className={styles.featureCard__title}>Infrastructure First</h3>
            <p className={styles.featureCard__description}>
              Oak Network is designed as infrastructure, not just another platform. Any application can integrate our smart contracts to add crowdfunding capabilities.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-database"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-database"></i>
            </div>
            <h3 className={styles.featureCard__title}>Infrastructure First</h3>
            <p className={styles.featureCard__description}>
              Oak Network is designed as infrastructure, not just another platform. Any application can integrate our smart contracts to add crowdfunding capabilities.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-hexagon"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-hexagon"></i>
            </div>
            <h3 className={styles.featureCard__title}>Infrastructure First</h3>
            <p className={styles.featureCard__description}>
              Oak Network is designed as infrastructure, not just another platform. Any application can integrate our smart contracts to add crowdfunding capabilities.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-shield-check"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-shield-check"></i>
            </div>
            <h3 className={styles.featureCard__title}>Infrastructure First</h3>
            <p className={styles.featureCard__description}>
              Oak Network is designed as infrastructure, not just another platform. Any application can integrate our smart contracts to add crowdfunding capabilities.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-database"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-database"></i>
            </div>
            <h3 className={styles.featureCard__title}>Infrastructure First</h3>
            <p className={styles.featureCard__description}>
              Oak Network is designed as infrastructure, not just another platform. Any application can integrate our smart contracts to add crowdfunding capabilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageCTAs() {
  return (
    <section className={styles.ctas}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <div className={styles.ctaCard}>
              <h3><i className="fas fa-code"></i> For Developers</h3>
              <p>Integrate Oak Network into your application and start building the future of crowdfunding.</p>
              <ul>
                <li><Link to="/docs/guides/create-campaign">Create Your First Campaign</Link></li>
                <li><Link to="/docs/guides/platform-integration">Platform Integration</Link></li>
                <li><Link to="/docs/contracts/overview">Smart Contract Reference</Link></li>
              </ul>
              <Link className="button button--primary" to="/docs/guides/create-campaign">
                Start Building
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.ctaCard}>
              <h3><i className="fas fa-building"></i> For Platforms</h3>
              <p>Add crowdfunding capabilities to your existing platform with our comprehensive integration tools.</p>
              <ul>
                <li><Link to="/docs/guides/platform-integration">Platform Integration</Link></li>
                <li><Link to="/docs/concepts/platforms">Platform Concepts</Link></li>
                <li><Link to="/docs/guides/treasury-models">Treasury Models</Link></li>
              </ul>
              <Link className="button button--primary" to="/docs/guides/platform-integration">
                Integrate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageCommunity() {
  return (
    <section className={styles.community}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h2>Join the Oak Network Community</h2>
            <p>
              Connect with developers, platform builders, and community members 
              who are shaping the future of decentralized crowdfunding.
            </p>
            <div className={styles.communityLinks}>
              <Link
                className="button button--secondary"
                href="https://discord.gg/oaknetwork">
                <i className="fab fa-discord"></i> Discord
              </Link>
              <Link
                className="button button--secondary"
                href="https://github.com/oaknetwork">
                <i className="fab fa-github"></i> GitHub
              </Link>
              <Link
                className="button button--secondary"
                href="https://x.com/oaknetwork">
                <i className="fab fa-x-twitter"></i> X
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Decentralized Crowdfunding Infrastructure`}
      description="Build the future of crowdfunding with Oak Network's comprehensive suite of smart contracts on Celo blockchain. Transparent fees, secure infrastructure, and easy integration.">
      <HomepageHeader />
      <main>
        <HomepageStats />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}