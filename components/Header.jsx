import { deleteCookie, getCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
function Header() {
  const router = useRouter();
  const [visibleRight, setVisibleRight] = useState(false);

  let cookies = getCookie('growthify_user');
  if (cookies) {
    cookies = JSON.parse(cookies);
  }

  const signOut = async () => {
    deleteCookie('growthify_user');
    router.push('/login');
  };
  return (
    <>
      <div className="w-[100vw] flex justify-between items-center p-3">
        <h4>Growthify</h4>
        <Button
          icon="pi pi-arrow-right"
          onClick={() => setVisibleRight(true)}
        />
      </div>
      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <div className="flex flex-col gap-4">
          {cookies && cookies.isAdmin ? (
            <>
              <Link href="/create_task">Create Task</Link>
              <Link href="/create_user">Create User</Link>
            </>
          ) : (
            <></>
          )}

          {cookies ? (
            <>
              <Link href="/all_tasks">All Tasks</Link>
              <Button onClick={signOut}>SignOut</Button>
            </>
          ) : (
            <Button onClick={() => router.push('/login')}>Login</Button>
          )}
        </div>
      </Sidebar>
    </>
  );
}

export default Header;
