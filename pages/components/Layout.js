import React from 'react';
import PropTypes from 'prop-types';
import Nav from './Nav';
import Head from './Head';
export default function Layout(props) {
  return (
    <div>
      <Head title={props.title} />
      <Nav />
      <div className="content">
        {props.children}
      </div>
    </div>
  );
}
