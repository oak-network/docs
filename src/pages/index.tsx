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
            We build the behind the scenes “engine” that lets creators run their own Kickstarter style campaigns, online shops, and preorders, with blockchain quietly handling the money and trust in the background.
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
          <div className={styles.trustedBy}>
            <div className={styles.trustedByContainer}>
              <div className={styles.trustedByGroup}>
                <p className={styles.trustedByTitle}>Trusted by</p>
                <div className={styles.trustedByLogos}>
                  <div className={styles.trustedByLogoContainer}>
                    <img 
                      src="/img/kickstarter-logo.png" 
                      alt="Kickstarter" 
                      className={styles.kickstarterLogo}
                    />
                  </div>
                  <img 
                    src="/img/a16z-logo.webp" 
                    alt="a16z" 
                    className={styles.a16zLogo}
                  />
                </div>
              </div>
              <div className={styles.auditPartnerGroup}>
                <span className={styles.auditPartnerLabel}>Audit Partner</span>
                <div className={styles.auditPartnerLogoContainer}>
                  <img 
                    src="/img/open-zeppelin.png" 
                    alt="OpenZeppelin" 
                    className={styles.auditPartnerLogo}
                  />
                </div>
              </div>
            </div>
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
          {/* Card 1 - Infrastructure-First - Pink layer-group */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-layer-group"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-layer-group"></i>
            </div>
            <h3 className={styles.featureCard__title}>Infrastructure-First</h3>
            <p className={styles.featureCard__description}>
              Oak is infrastructure, not a monolith. Any application can integrate our contracts to power their own e-commerce, pre-orders, and campaigns.
            </p>
          </div>
          {/* Card 2 - Transparent Fees - Light blue coins */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-coins"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-coins"></i>
            </div>
            <h3 className={styles.featureCard__title}>Transparent Fees</h3>
            <p className={styles.featureCard__description}>
              Clear, predictable fee structure with 1% protocol fee going directly to the ecosystem. No hidden costs, all fees are transparent and on-chain.
            </p>
          </div>
          {/* Card 3 - Security & Trust - Teal shield */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-shield"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-shield"></i>
            </div>
            <h3 className={styles.featureCard__title}>Security & Trust</h3>
            <p className={styles.featureCard__description}>
              Audited smart contracts and open-source development ensure the highest security standards for your platform and your users' transactions.
            </p>
          </div>
          {/* Card 4 - Celo Benefits - Purple bolt */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-bolt"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-bolt"></i>
            </div>
            <h3 className={styles.featureCard__title}>Celo Benefits</h3>
            <p className={styles.featureCard__description}>
              Low fees, fast settlement, mobile-first design, and carbon-negative blockchain make Celo the perfect home for Oak Network.
            </p>
          </div>
          {/* Card 5 - Easy Integration - Lime green plug */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-plug"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-plug"></i>
            </div>
            <h3 className={styles.featureCard__title}>Easy Integration</h3>
            <p className={styles.featureCard__description}>
              Comprehensive SDKs, detailed documentation, and developer-friendly APIs make integration simple and straightforward.
            </p>
          </div>
          {/* Card 6 - Scalable Architecture - Cyan expand-arrows-alt */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-expand-arrows-alt"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-expand-arrows-alt"></i>
            </div>
            <h3 className={styles.featureCard__title}>Scalable Architecture</h3>
            <p className={styles.featureCard__description}>
              Modular design allows for easy customization and extension. Build exactly what you need without unnecessary complexity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepagePlatformAdvantages() {
  return (
    <section className={`${styles.features} ${styles.platformAdvantages}`}>
      <div className="container">
        <h2 className={styles.featuresTitle}>Platform Advantages</h2>
        <p className={styles.featuresSubtitle}>
          Unlock new revenue streams and expand your reach
        </p>
        <div className={styles.featureGrid}>
          {/* Card 1 - Interconnected Platforms */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-share-alt"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-share-alt"></i>
            </div>
            <h3 className={styles.featureCard__title}>Interconnected Platforms</h3>
            <p className={styles.featureCard__description}>
              Enable creators to launch on your platform and automatically share their products or campaigns across other platforms in the ecosystem.
            </p>
          </div>
          {/* Card 2 - Access Crypto Communities */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-users"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-users"></i>
            </div>
            <h3 className={styles.featureCard__title}>Access Crypto Communities</h3>
            <p className={styles.featureCard__description}>
              Tap into the growing crypto ecosystem and reach users who prefer digital currencies. Accept crypto payments alongside traditional methods.
            </p>
          </div>
          {/* Card 3 - Complete Transparency */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-eye"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-eye"></i>
            </div>
            <h3 className={styles.featureCard__title}>Complete Transparency</h3>
            <p className={styles.featureCard__description}>
              Build trust with creators and supporters. With blockchain as the "quiet" backend, every transaction and fund flow is publicly verifiable.
            </p>
          </div>
          {/* Card 4 - Simplified Crypto Experience */}
          <div className={styles.featureCard}>
            <div className={styles.featureCard__watermark}>
              <i className="fas fa-magic"></i>
            </div>
            <div className={styles.featureCard__icon}>
              <i className="fas fa-magic"></i>
            </div>
            <h3 className={styles.featureCard__title}>Simplified Crypto Experience</h3>
            <p className={styles.featureCard__description}>
              Offer blockchain benefits without the complexity. Our "behind the scenes" engine provides a seamless and simple user experience.
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
              <p>Integrate Oak Network into your application and start building the future of creator commerce.</p>
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
              <p>Add powerful commerce, pre-order, and campaign capabilities to your existing platform with our comprehensive integration tools.</p>
              <ul>
                <li><Link to="/docs/guides/platform-integration">Platform Integration</Link></li>
                <li><Link to="/docs/concepts/platforms">Platform Concepts</Link></li>
                <li><Link to="/docs/concepts/treasuries">Treasury Models</Link></li>
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
              who are shaping the future of decentralized creator commerce.
            </p>
            <div className={styles.communityLinks}>
              <Link
                className="button button--secondary"
                href="https://discord.com/invite/srhtEpWBHx">
                <i className="fab fa-discord"></i> Discord
              </Link>
              <Link
                className="button button--secondary"
                href="https://github.com/oak-network">
                <i className="fab fa-github"></i> GitHub
              </Link>
              <Link
                className="button button--secondary"
                href="https://x.com/oak_network">
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
      title={`${siteConfig.title} - The Invisible Engine for Creator Commerce`}
      description="Build the future of creator commerce with Oak Network's invisible engine. Power Kickstarter-style campaigns, online shops, and pre-orders with blockchain handling payments and trust.">
      <HomepageHeader />
      <main>
        <HomepageStats />
        <div className={styles.features}>
          <h2 className={styles.featuresTitle}>Why Choose Oak Network?</h2>
          <p className={styles.featuresSubtitle}>The invisible engine you need to build the future of creator commerce.</p>
          <HomepageFeatures />
          <HomepagePlatformAdvantages />
        </div>
        <HomepageCTAs />
        <HomepageCommunity />
      </main>
    </Layout>
  );
}