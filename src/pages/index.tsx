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
            Decentralized Crowdfunding Infrastructure on Celo
          </p>
          <p className="hero__description">
            Build the future of crowdfunding with our comprehensive suite of smart contracts. 
            Enable any application to leverage blockchain technology for fundraising with 
            transparent 1% fees that support the ecosystem.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/intro">
              Get Started
            </Link>
            <Link
              className="button button--secondary button--lg"
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
      <div className="container">
        <div className="row">
          <div className="col col--3">
            <div className={styles.statItem}>
              <div className={styles.statNumber}>1%</div>
              <div className={styles.statLabel}>Protocol Fee</div>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Transparent</div>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.statItem}>
              <div className={styles.statNumber}>∞</div>
              <div className={styles.statLabel}>Possibilities</div>
            </div>
          </div>
          <div className="col col--3">
            <div className={styles.statItem}>
              <div className={styles.statNumber}>🌍</div>
              <div className={styles.statLabel}>Celo Network</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--12">
            <h2 className={styles.featuresTitle}>Why Choose Oak Network?</h2>
            <p className={styles.featuresSubtitle}>
              Built for developers, designed for scale, powered by community
            </p>
          </div>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-card__icon">🏗️</div>
            <h3 className="feature-card__title">Infrastructure-First</h3>
            <p className="feature-card__description">
              Oak Network is designed as infrastructure, not just another platform. 
              Any application can integrate our smart contracts to add crowdfunding capabilities.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">💰</div>
            <h3 className="feature-card__title">Transparent Fees</h3>
            <p className="feature-card__description">
              Clear, predictable fee structure with 1% protocol fee going directly 
              to the ecosystem. No hidden costs, all fees are transparent and on-chain.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">🔒</div>
            <h3 className="feature-card__title">Security & Trust</h3>
            <p className="feature-card__description">
              Audited smart contracts, open source development, and decentralized 
              governance ensure the highest security standards for your campaigns.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">🌍</div>
            <h3 className="feature-card__title">Celo Benefits</h3>
            <p className="feature-card__description">
              Low fees, fast settlement, mobile-first design, and carbon-negative 
              blockchain make Celo the perfect home for Oak Network.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">⚡</div>
            <h3 className="feature-card__title">Easy Integration</h3>
            <p className="feature-card__description">
              Comprehensive SDKs, detailed documentation, and developer-friendly 
              APIs make integration simple and straightforward.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-card__icon">🚀</div>
            <h3 className="feature-card__title">Scalable Architecture</h3>
            <p className="feature-card__description">
              Modular design allows for easy customization and extension. 
              Build exactly what you need without unnecessary complexity.
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
              <h3>🚀 For Developers</h3>
              <p>Integrate Oak Network into your application and start building the future of crowdfunding.</p>
              <ul>
                <li><Link to="/docs/guides/quick-start">Quick Start Guide</Link></li>
                <li><Link to="/docs/guides/create-campaign">Create Your First Campaign</Link></li>
                <li><Link to="/docs/contracts/overview">Smart Contract Reference</Link></li>
              </ul>
              <Link className="button button--primary" to="/docs/guides/quick-start">
                Start Building
              </Link>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.ctaCard}>
              <h3>🏢 For Platforms</h3>
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
                💬 Discord
              </Link>
              <Link
                className="button button--secondary"
                href="https://github.com/oaknetwork">
                🐙 GitHub
              </Link>
              <Link
                className="button button--secondary"
                href="https://twitter.com/oaknetwork">
                🐦 Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Decentralized Crowdfunding Infrastructure`}
      description="Build the future of crowdfunding with Oak Network's comprehensive suite of smart contracts on Celo blockchain. Transparent fees, secure infrastructure, and easy integration.">
      <HomepageHeader />
      <main>
        <HomepageStats />
        <HomepageFeatures />
        <HomepageCTAs />
        <HomepageCommunity />
      </main>
    </Layout>
  );
}