import Navbar from '@theme-original/Navbar';
import type NavbarType from '@theme/Navbar';
import type {WrapperProps} from '@docusaurus/types';
import type {JSX} from 'react';

type Props = WrapperProps<typeof NavbarType>;

export default function NavbarWrapper(props: Props): JSX.Element {
  return (
    <div className="navbar-wrapper">
      <div className="navbar-container">
        <Navbar {...props} />
      </div>
    </div>
  );
}
