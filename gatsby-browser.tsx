import React from 'react';
import { WrapPageElementBrowserArgs } from 'gatsby';

import LiquidCursor from './src/@lekoarts/gatsby-theme-jodie/components/liquid-cursor';

import "./global.css";
import "@fortawesome/fontawesome-free/css/all.css";


export const wrapPageElement = ({ element }: WrapPageElementBrowserArgs) => {
  const isTouchDevice =
    typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  if (isTouchDevice) {
    return <>{element}</>;
  }


  return (
    <>
      <LiquidCursor />
      {element}
    </>
  );
};

export const onClientEntry = () => {
  if (typeof window !== "undefined" && window.location.pathname === "/") {
    window.location.replace("/biography");
  }
};