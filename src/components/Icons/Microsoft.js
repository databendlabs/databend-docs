

import React from 'react';
import PropTypes from 'prop-types';

const Microsoft = props => {
  const { size } = props;
  return ( 
    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4544" width={size}><path d="M470.19 938.11L469 532.32l539 2.43v484.51zM469 86.57l539-81.16v448.18H469v-367zM9.9 531.11l385.19 1.21v398.52L9.9 869.06V531.11z m0-77.52v-298l385.19-61.75v359.75z" p-id="4545" fill="#ffffff"></path></svg>
  );
};

Microsoft.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Microsoft.defaultProps = {
  color: 'currentColor',
  size: '24'
};

export default Microsoft;
