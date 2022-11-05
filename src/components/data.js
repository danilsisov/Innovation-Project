import React from 'react';

function Show(props) {
  return <li>Name: { props.name }</li>;
}

export default function Data() {
  const list = [
    {id: 1, name: 'name of project 1'},
    {id: 2, name: 'name of project 2'},
    {id: 3, name: 'name of project 3'}
  ];
  return (
    <>
	    <h1>Test listed data</h1>
	    <ul>
        {list.map((list) => <Show key={list.id} name={list.name} />)}
      </ul>
    </>
  );
}
