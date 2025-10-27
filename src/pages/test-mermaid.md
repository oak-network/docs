---
title: Test Mermaid Diagram
---

# Test Mermaid Diagram

This is a test page to verify the MermaidDiagram component works correctly.

import MermaidDiagram from '@site/src/components/MermaidDiagram';

<MermaidDiagram title="Test Architecture">

```mermaid
graph TB
    A[Start] --> B[Process]
    B --> C[End]
    
    D[Input] --> B
    B --> E[Output]
```

</MermaidDiagram>

## Instructions

1. Click the "🔍 Fullscreen" button above
2. Check the browser console for debug logs
3. Verify the diagram scales properly in fullscreen mode

