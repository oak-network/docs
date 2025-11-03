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
        'concepts/open-source-philosophy',
      ],
    },
    {
      type: 'category',
      label: 'Integration Guides',
      items: [
        'guides/create-campaign',
        'guides/platform-integration',
        'guides/platform-journey',
        'guides/platform-sdk',
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
            'contracts/deployment',
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
            'contracts/item-registry',
            'contracts/fiat-enabled',
          ],
        },
        {
          type: 'category',
          label: 'Interfaces',
          items: [
            'contracts/interfaces-overview',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Security & Audits',
      items: [
        'security/overview',
        'security/audits',
        'security/bug-bounty',
        'security/best-practices',
        'security/checklist',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'deployment/README',
        'api/README',
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
        'contracts/deployment',
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
        'contracts/item-registry',
        'contracts/fiat-enabled',
      ],
    },
    {
      type: 'category',
      label: 'Interfaces',
      items: [
        'contracts/interfaces-overview',
      ],
    },
  ],

  // Integration guides sidebar
  guidesSidebar: [
    {
      type: 'category',
      label: 'Basic Integration',
      items: [
        'guides/create-campaign',
      ],
    },
    {
      type: 'category',
      label: 'Platform Integration',
      items: [
        'guides/platform-integration',
        'guides/platform-sdk',
      ],
    },
  ],
};

export default sidebars;