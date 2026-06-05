import React from 'react';
import {useLocation} from '@docusaurus/router';
import DocItemOriginal from '@theme-original/DocItem';
import ApiItem from '@theme/ApiItem';

export default function DocItemWrapper(props) {
  const location = useLocation();
  if (location.pathname.startsWith('/docs/payment-api')) {
    return <ApiItem {...props} />;
  }
  return <DocItemOriginal {...props} />;
}
