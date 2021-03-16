import React from 'react';

const Message = (variant) => {
  variant = 'success' ? '#D2FBD6' : 'danger' ? '#FFE5DE' : '#DEF5FF';
  return (
    <div
      style={{
        backgroundColor: variant
      }}
    ></div>
  );
};

export default Message;
