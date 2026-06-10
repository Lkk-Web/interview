import React from 'react';

export default ({ title, component }: { title: string; component: React.ReactNode }) => {
  return (
    <>
      <h2>{title}</h2>
      {component}
    </>
  );
};
