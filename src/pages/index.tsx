import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

type FeatureCard = {
  title: string;
  description: string;
  icon: string;
};

type AdvantageCard = {
  title: string;
  description: string;
  icon: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: 'Infrastructure-First',
    description:
      'Oak is infrastructure, not a monolith. Any application can integrate our contracts to power their own e-commerce, pre-orders, and campaigns.',
    icon: 'fas fa-layer-group',
  },
  {
    title: 'Transparent Fees',
    description:
      'Clear, predictable fee structure with 1% protocol fee going directly to the ecosystem. No hidden costs, all fees are transparent and on-chain.',
    icon: 'fas fa-coins',
  },
  {
    title: 'Easy Integration',
    description:
      'Comprehensive SDKs, detailed documentation, and developer-friendly APIs make integration simple and straightforward.',
    icon: 'fas fa-plug',
  },
  {
    title: 'Celo Benefits',
    description:
      'Low fees, fast settlement, mobile-first design, and carbon-negative blockchain make Celo the perfect home for Oak Network.',
    icon: 'fas fa-bolt',
  },
  {
    title: 'Security & Trust',
    description:
      "Audited smart contracts and open-source development ensure the highest security standards for your platform and your users' transactions.",
    icon: 'fas fa-shield-alt',
  },
  {
    title: 'Scalable Architecture',
    description:
      'Modular design allows for easy customization and extension. Build exactly what you need without unnecessary complexity.',
    icon: 'fas fa-expand-arrows-alt',
  },
];

const ADVANTAGE_CARDS: AdvantageCard[] = [
  {
    title: 'Interconnected Platforms',
    description:
      'Enable creators to launch on your platform and automatically share their products or campaigns across other platforms in the ecosystem.',
    icon: 'fas fa-share-alt',
  },
  {
    title: 'Access Crypto Communities',
    description:
      'Tap into the growing crypto ecosystem and reach users who prefer digital currencies. Accept crypto payments alongside traditional methods.',
    icon: 'fas fa-users',
  },
  {
    title: 'Complete Transparency',
    description:
      'Build trust with creators and supporters. With blockchain as the "quiet" backend, every transaction and fund flow is publicly verifiable.',
    icon: 'fas fa-eye',
  },
  {
    title: 'Simplified Crypto Experience',
    description:
      'Offer blockchain benefits without the complexity. Our "behind the scenes" engine provides a seamless and simple user experience.',
    icon: 'fas fa-magic',
  },
];

function HomepageHeader() {
  return (
    <header className={styles.heroSection}>
      <div className={styles.heroGlow1} />
      <div className={styles.heroGlow2} />
      <div className={styles.heroGlow3} />
      <div className={styles.gridOverlay} />

      <div className={styles.heroMain}>
        <div className={styles.heroContent}>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>Oak</span>
            <span className={clsx(styles.heroLine, styles.heroLineAccent)}>Network</span>
          </h1>

          <p className={styles.heroTagline}>
            From Roots to <em>Routes.</em>
          </p>

          <p className={styles.heroDescription}>
            We build the behind the scenes “engine” that lets creators run their own Kickstarter style campaigns, online shops, and preorders, with blockchain quietly handling the money and trust in the background.
          </p>

          <div className={styles.heroButtons}>
            <Link className={clsx(styles.btn, styles.btnPrimary)} to="/docs/intro">
              Get Started
            </Link>
            <Link className={clsx(styles.btn, styles.btnOutline)} to="/docs/roadmap">
              View Roadmap
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.heroTrustBar}>
        <div className={styles.heroTrustGroup}>
          <span className={styles.heroTrustLabel}>Backed by</span>
          <img
            src="/img/kickstarter-cropped.png"
            alt="Kickstarter"
            className={clsx(styles.heroTrustLogo, styles.logoKickstarter)}
          />
          <img
            src="/img/a16z-no-bg.png"
            alt="a16z"
            className={clsx(styles.heroTrustLogo, styles.heroTrustLogoMono, styles.logoA16z)}
          />
        </div>
        <div className={styles.heroTrustSep} />
        <div className={styles.heroTrustGroup}>
          <span className={styles.heroTrustLabel}>Audited by</span>
          <img
            src="/img/open-zeppelin.png"
            alt="OpenZeppelin"
            className={clsx(styles.heroTrustLogo, styles.heroTrustLogoMono, styles.logoOz)}
          />
        </div>
      </div>
    </header>
  );
}

function HomepageStats() {
  return (
    <section className={styles.statsSection}>
      <div className={styles.statsStrip}>
        <div className={styles.statBox}>
          <span className={styles.statValue}>1%</span>
          <span className={styles.statName}>PROTOCOL FEE</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>100%</span>
          <span className={styles.statName}>TRANSPARENT</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>∞</span>
          <span className={styles.statName}>POSSIBILITIES</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statValue}>
            <i className="fas fa-globe" aria-hidden="true"></i>
          </span>
          <span className={styles.statName}>CELO NETWORK</span>
        </div>
      </div>
    </section>
  );
}

function HomepageFeatures() {
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle(styles.staggeredCardActive, entry.isIntersecting);
        });
      },
      { threshold: 0.6 }
    );

    const cards = document.querySelectorAll<HTMLElement>(`.${styles.staggeredCard}`);
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
      observer.disconnect();
    };
  }, []);

  return (
    <section className={styles.editorialSection}>
      <div className={styles.editorialHeader}>
        <h2 className={styles.editorialTitle}>Built for <em>Everyone</em></h2>
        <p className={styles.editorialSubtitle}>From Individual Developers to Enterprise Platforms</p>
      </div>
      <div className={styles.staggeredGrid}>
        {FEATURE_CARDS.map((feature, index) => (
          <div key={feature.title} className={styles.staggeredCard}>
            <div className={styles.staggeredHeader}>
              <span className={styles.staggeredNumber}>0{index + 1}</span>
              <i className={clsx(feature.icon, styles.staggeredIcon)}></i>
            </div>
            <div className={styles.staggeredContent}>
              <h3 className={styles.staggeredTitle}>{feature.title}</h3>
              <p className={styles.staggeredDesc}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomepagePlatformAdvantages() {
  return (
    <section className={styles.cardsSection}>
      <div className={styles.editorialHeader}>
        <h2 className={styles.editorialTitle}>Platform <em>Advantages</em></h2>
        <p className={styles.editorialSubtitle}>Unlock new revenue streams and expand your reach</p>
      </div>
      <div className={styles.elegantGrid}>
        {ADVANTAGE_CARDS.map((advantage, index) => (
          <div key={advantage.title} className={styles.elegantCard}>
            <div className={styles.elegantCardWatermark}>
              <i className={advantage.icon}></i>
            </div>
            <div className={styles.elegantCardTop}>
              <span className={styles.elegantCardNumber}>0{index + 1}</span>
              <div className={styles.elegantCardIcon}>
                <i className={advantage.icon}></i>
              </div>
            </div>
            <h3 className={styles.elegantCardTitle}>{advantage.title}</h3>
            <p className={styles.elegantCardDesc}>{advantage.description}</p>
            <div className={styles.elegantCardHoverLine}></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomepageCTAs() {
  return (
    <section className={styles.elegantCtaSection}>
      <div className={styles.editorialHeader}>
        <h2 className={styles.editorialTitle}>Build <em>Your Vision</em></h2>
        <p className={styles.editorialSubtitle}>Everything you need to launch and scale your idea</p>
      </div>
      <div className={styles.elegantCtaGrid}>
        <div className={styles.elegantCtaCard}>
          <div className={styles.elegantCtaGlow}></div>
          <div className={styles.elegantCtaContent}>
            <div className={styles.elegantCtaIcon}>
              <i className="fas fa-code"></i>
            </div>
            <h3 className={styles.elegantCtaTitle}>For <em>Developers</em></h3>
            <p className={styles.elegantCtaDesc}>
              Integrate Oak Network into your application and start building the future of creator commerce.
            </p>
            <div className={styles.elegantCtaLinks}>
              <Link className={styles.elegantCtaLink} to="/docs/guides/create-campaign">
                <i className="fas fa-arrow-right"></i>
                <span>Create Your First Campaign</span>
              </Link>
              <Link className={styles.elegantCtaLink} to="/docs/guides/platform-integration">
                <i className="fas fa-arrow-right"></i>
                <span>Platform Integration</span>
              </Link>
              <Link className={styles.elegantCtaLink} to="/docs/contracts/overview">
                <i className="fas fa-arrow-right"></i>
                <span>Smart Contract Reference</span>
              </Link>
            </div>
            <Link className={clsx(styles.btn, styles.btnPrimary, styles.elegantCtaBtn)} to="/docs/guides/create-campaign">
              Start Building
            </Link>
          </div>
        </div>

        <div className={styles.elegantCtaCard}>
          <div className={styles.elegantCtaGlowAlt}></div>
          <div className={styles.elegantCtaContent}>
            <div className={styles.elegantCtaIcon}>
              <i className="fas fa-building"></i>
            </div>
            <h3 className={styles.elegantCtaTitle}>For <em>Platforms</em></h3>
            <p className={styles.elegantCtaDesc}>
              Add powerful commerce, pre-order, and campaign capabilities to your existing platform with our comprehensive integration tools.
            </p>
            <div className={styles.elegantCtaLinks}>
              <Link className={styles.elegantCtaLink} to="/docs/guides/platform-integration">
                <i className="fas fa-arrow-right"></i>
                <span>Platform Integration</span>
              </Link>
              <Link className={styles.elegantCtaLink} to="/docs/concepts/platforms">
                <i className="fas fa-arrow-right"></i>
                <span>Platform Concepts</span>
              </Link>
              <Link className={styles.elegantCtaLink} to="/docs/concepts/treasuries">
                <i className="fas fa-arrow-right"></i>
                <span>Treasury Models</span>
              </Link>
            </div>
            <Link className={clsx(styles.btn, styles.btnPrimary, styles.elegantCtaBtn)} to="/docs/guides/platform-integration">
              Integrate Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

function HomepageCommunity() {
  return (
    <section className={styles.communitySection}>
      <div className={styles.communityContainer}>
        <div className={styles.communityCard}>
          <div className={styles.communityGlow}></div>
          <div className={styles.communityContent}>
            <h2 className={styles.communityTitle}>Join the <em>Oak Network</em> Community</h2>
            <p className={styles.communityDescription}>
              Connect with developers, platform builders, and community members who are shaping the future of decentralized creator commerce.
            </p>
            <div className={styles.communityLinks}>
              <Link className={clsx(styles.communityBtn, styles.btnDiscord)} href="https://discord.com/invite/srhtEpWBHx">
                <i className="fab fa-discord"></i> Discord
              </Link>
              <Link className={clsx(styles.communityBtn, styles.btnGithub)} href="https://github.com/oak-network">
                <i className="fab fa-github"></i> GitHub
              </Link>
              <Link className={clsx(styles.communityBtn, styles.btnX)} href="https://x.com/oak_network">
                <i className="fa-brands fa-x-twitter"></i> X
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
      <main className={styles.mainWrapper}>
        <HomepageHeader />
        <HomepageStats />
        <div className={styles.bodyWrapper}>
          <HomepageFeatures />
          <HomepagePlatformAdvantages />
          <HomepageCTAs />
          <HomepageCommunity />
        </div>
      </main>
    </Layout>
  );
}
