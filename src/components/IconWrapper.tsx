import React, { useEffect } from 'react';

interface IconWrapperProps {
    icon: React.ReactNode;
  }
  const IconWrapper = ({ icon }: IconWrapperProps) => {
    
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {!isClient && <div>{icon}</div>}
      {isClient && icon}
    </>
  );
};

export default IconWrapper;
