import React, { useState } from 'react';
import {MDBNavbar, MDBContainer, MDBIcon, MDBNavbarNav, MDBNavbarItem, MDBNavbarLink, MDBNavbarToggler, MDBNavbarBrand, MDBCollapse } from 'mdb-react-ui-kit';

export default function Navbar(props) {
    
    const [showNavColorSecond, setShowNavColorSecond] = useState(false);
    const Web3ButtonBtn = props.Web3Button;
    const isConnected = props.isConnected;
    console.log(isConnected);

    return (
        <>
        { isConnected ? 
        
        <>
        <MDBNavbar expand='lg' dark bgColor='dark'>
                    <MDBContainer fluid>
                    <MDBNavbarBrand href='/'>My-NFT</MDBNavbarBrand>
                    <MDBNavbarToggler
                        type='button'
                        data-target='#navbarColor02'
                        aria-controls='navbarColor02'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setShowNavColorSecond(!showNavColorSecond)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                    <MDBCollapse show={showNavColorSecond} navbar id='navbarColor02'>
                        <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem className='active'>
                            <MDBNavbarLink aria-current='page' href='/'>
                            Home
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/support'>Support</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/pricing'>Pricing</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/mint'>Mint</MDBNavbarLink>
                        </MDBNavbarItem>
                        
                        </MDBNavbarNav>
                    </MDBCollapse>
                    <Web3ButtonBtn />  
                    </MDBContainer>
                    
                </MDBNavbar>
        </>
        : 
            <> 
            <MDBNavbar expand='lg' dark bgColor='dark'>
                    <MDBContainer fluid>
                    <MDBNavbarBrand href='/'>My-NFT</MDBNavbarBrand>
                    <MDBNavbarToggler
                        type='button'
                        data-target='#navbarColor02'
                        aria-controls='navbarColor02'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                        onClick={() => setShowNavColorSecond(!showNavColorSecond)}
                    >
                        <MDBIcon icon='bars' fas />
                    </MDBNavbarToggler>
                    <MDBCollapse show={showNavColorSecond} navbar id='navbarColor02'>
                        <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
                        <MDBNavbarItem className='active'>
                            <MDBNavbarLink aria-current='page' href='/'>
                            Home
                            </MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/features'>Features</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/pricing'>Pricing</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink href='/about'>About</MDBNavbarLink>
                        </MDBNavbarItem>
                        
                        </MDBNavbarNav>
                    </MDBCollapse>
                    <Web3ButtonBtn />  
                    </MDBContainer>
                    
                </MDBNavbar>
            </>
            }
            
        </>
        )

}
