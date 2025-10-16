import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  tutorialSidebar: [
    'intro',
    'roadmap',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'concepts/overview',
        'concepts/campaigns',
        'concepts/platforms',
        'concepts/treasuries',
        'security/overview',
      ],
    },
    {
      type: 'category',
      label: 'Integration Guides',
      items: [
        'guides/quick-start',
        'guides/create-campaign',
      ],
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'contracts/overview',
        'contracts/campaign-info-factory',
      ],
    },
  ],

  // Smart contracts sidebar
  contractsSidebar: [
    'contracts/overview',
    {
      type: 'category',
      label: 'Core Contracts',
      items: [
        'contracts/campaign-info-factory',
      ],
    },
  ],

  // Integration guides sidebar
  guidesSidebar: [
    'guides/quick-start',
    {
      type: 'category',
      label: 'Basic Integration',
      items: [
        'guides/create-campaign',
      ],
    },
  ],
};

export default sidebars;