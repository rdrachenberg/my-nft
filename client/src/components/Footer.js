import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';

export const Footer = () => {
    const date = new Date().getFullYear();
  return (
    <div className='footer fixed-bottom'>
        <MDBFooter className='bg-dark text-center text-white'>
        <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
            © {date} Copyright
            <a className='text-white' href='/'>
            : Drac
            </a>
        </div>
        </MDBFooter>
    </div>
  );
}