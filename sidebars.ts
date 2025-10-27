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
        {
          type: 'category',
          label: 'Core Contracts',
          items: [
            'contracts/campaign-info-factory',
            'contracts/campaign-info',
            'contracts/global-params',
            'contracts/treasury-factory',
          ],
        },
        {
          type: 'category',
          label: 'Treasury Contracts',
          items: [
            'contracts/base-treasury',
            'contracts/all-or-nothing',
            'contracts/keep-whats-raised',
          ],
        },
        {
          type: 'category',
          label: 'Utility Contracts',
          items: [
            'contracts/admin-access-checker',
            'contracts/campaign-access-checker',
            'contracts/pausable-cancellable',
            'contracts/timestamp-checker',
          ],
        },
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
        'contracts/campaign-info',
        'contracts/global-params',
        'contracts/treasury-factory',
      ],
    },
    {
      type: 'category',
      label: 'Treasury Contracts',
      items: [
        'contracts/base-treasury',
        'contracts/all-or-nothing',
        'contracts/keep-whats-raised',
      ],
    },
    {
      type: 'category',
      label: 'Utility Contracts',
      items: [
        'contracts/admin-access-checker',
        'contracts/campaign-access-checker',
        'contracts/pausable-cancellable',
        'contracts/timestamp-checker',
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