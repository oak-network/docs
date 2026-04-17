import React, {type JSX} from 'react';
import AIMenuButton from '@site/src/components/AIMenu/AIMenuButton';

export default function Root({children}: {children: React.ReactNode}): JSX.Element {
  return (
    <>
      {children}
      <AIMenuButton />
    </>
  );
}
