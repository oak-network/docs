import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  tutorialSidebar: [
    'intro',
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
      ],
    },
    {
      type: 'category',
      label: 'Payment SDK',
      items: [
        'sdk/overview',
        'sdk/installation',
        'sdk/quickstart',
        'sdk/authentication',
        {
          type: 'category',
          label: 'Services',
          items: [
            'sdk/customers',
            'sdk/payments',
            'sdk/payment-methods',
            'sdk/webhooks',
            'sdk/transactions',
            'sdk/transfers',
            'sdk/plans',
            'sdk/refunds',
            'sdk/buy-and-sell',
            'sdk/providers',
          ],
        },
        'sdk/error-handling',
        'sdk/environments',
      ],
    },
    {
      type: 'category',
      label: 'Contracts SDK',
      items: [
        'contracts-sdk/overview',
        'contracts-sdk/installation',
        'contracts-sdk/quickstart',
        'contracts-sdk/client',
        {
          type: 'category',
          label: 'Contract Entities',
          items: [
            'contracts-sdk/global-params',
            'contracts-sdk/campaign-info-factory',
            'contracts-sdk/campaign-info',
            'contracts-sdk/treasury-factory',
            'contracts-sdk/payment-treasury',
            'contracts-sdk/all-or-nothing',
            'contracts-sdk/keep-whats-raised',
            'contracts-sdk/item-registry',
          ],
        },
        'contracts-sdk/error-handling',
        'contracts-sdk/utilities',
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
          items: ['contracts/interfaces-overview'],
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
      items: ['deployment/README', 'api/README'],
    },
  ],

  // Payment SDK sidebar
  sdkSidebar: [
    'sdk/overview',
    'sdk/installation',
    'sdk/quickstart',
    'sdk/authentication',
    {
      type: 'category',
      label: 'Services',
      items: [
        'sdk/customers',
        'sdk/payments',
        'sdk/payment-methods',
        'sdk/webhooks',
        'sdk/transactions',
        'sdk/transfers',
        'sdk/plans',
        'sdk/refunds',
        'sdk/buy-and-sell',
        'sdk/providers',
      ],
    },
    'sdk/error-handling',
    'sdk/environments',
  ],

  // Contracts SDK sidebar
  contractsSdkSidebar: [
    'contracts-sdk/overview',
    'contracts-sdk/installation',
    'contracts-sdk/quickstart',
    'contracts-sdk/client',
    {
      type: 'category',
      label: 'Contract Entities',
      items: [
        'contracts-sdk/global-params',
        'contracts-sdk/campaign-info-factory',
        'contracts-sdk/campaign-info',
        'contracts-sdk/treasury-factory',
        'contracts-sdk/payment-treasury',
        'contracts-sdk/all-or-nothing',
        'contracts-sdk/keep-whats-raised',
        'contracts-sdk/item-registry',
      ],
    },
    'contracts-sdk/metrics',
    'contracts-sdk/error-handling',
    'contracts-sdk/utilities',
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
      items: ['contracts/interfaces-overview'],
    },
  ],

  // Integration guides sidebar
  guidesSidebar: [
    {
      type: 'category',
      label: 'Basic Integration',
      items: ['guides/create-campaign'],
    },
    {
      type: 'category',
      label: 'Platform Integration',
      items: ['guides/platform-integration'],
    },
  ],
};

export default sidebars;
