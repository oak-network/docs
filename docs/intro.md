# Welcome to Oak Network

This is a test of the intro page.

## Test Section

This should work.

## Testing MermaidDiagram

Let's test the MermaidDiagram component:

import MermaidDiagram from '@site/src/components/MermaidDiagram';

<MermaidDiagram title="Oak Network Architecture">

```mermaid
graph TB
    A[Campaign Creator] --> B[CampaignInfoFactory]
    B --> C[CampaignInfo Contract]
    C --> D[TreasuryFactory]
    D --> E[Treasury Contract]
    E --> F[Platform Integration]
    F --> G[Backers]
    
    H[GlobalParams] --> B
    H --> D
    
    I[Platform Admin] --> C
    J[Protocol Admin] --> H
```

</MermaidDiagram>