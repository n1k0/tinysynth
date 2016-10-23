/* @flow */

import React, { Component } from 'react';
import './App.css';


type Matrix = Array<number[]>;

function initMatrix(w, h): Matrix {
  return new Array(h).fill(0).map(_ => new Array(w).fill(0));
}

function Cell({x, y, v, update}: {
  x: number,
  y: number,
  v: number,
  update: (x: number, y: number, v: number) => void
}) {
  return <a href="" className={`cell ${v === 1 ? "active" : ""}`}
            onClick={e => e.preventDefault() || update(x, y, v)} />;
}

class App extends Component {
  state: {
    cells: Matrix
  };

  constructor(props: Object) {
    super(props);
    this.state = {cells: initMatrix(16, 4)};
  }

  update = (x: number, y: number, v: number) => {
    this.setState(({cells}) => {
      return {
        cells: cells.map((row, _y) => {
          if (_y !== y) {
            return row;
          } else {
            return row.map((_v, _x) => {
              if (_x !== x) {
                return _v;
              } else {
                return _v === 0 ? 1 : 0;
              }
            });
          }
        })
      }
    });
  };

  render() {
    const {cells} = this.state;
    return (
      <div>
        <p>let's there be rock</p>
        <div>{
          cells.map((row, y) => {
            return <div key={y} className="row">{
              row.map((v, x) => {
                return <Cell key={x} {...{x, y, v}} update={this.update} />
              })
            }</div>
          })
        }</div>
      </div>
    );
  }
}

export default App;
