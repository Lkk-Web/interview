import React from 'react';

export default ({ title, component }: { title: string; component: HTMLElement }) => {
  return (
    <>
      <h2>{title}</h2>
      {component}
    </>
  );
};
