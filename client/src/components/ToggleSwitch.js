import React, { useState } from 'react';
import Switch from 'react-switch';

export const ToggleSwitch = (props) => {
    console.log(props)
    
    const [checked, setChecked] = useState(false);
    console.log(checked);

    const handleChange = (checked)=> {
        setChecked(checked)
        props.setChecked(checked)
    }
    
  return (
    <div className='payment-toggle'>
    {checked? 'Drip': ''}
      <Switch onChange={handleChange} checked={checked} 
        handleDiameter={35}
        offColor="#F0B90B"
        onColor="#FFFFFF"
        offHandleColor="#1E1F22"
        onHandleColor="#0557AD"
        height={30}
        width={70}
        borderRadius={6}
        activeBoxShadow="0px 0px 1px 2px #fffc35"
        uncheckedIcon={
            <div className='bnb-logo'>
                <img src='/bng-logo.png' alt='binance logo' />
            </div>
        }
        checkedIcon={
            <div className='drip-logo'>
                <img src='/drip-logo.png' alt='drip logo'/>
            </div>
        }
      />
      {checked? '':'BNB'}
    </div>
    
  );

}
