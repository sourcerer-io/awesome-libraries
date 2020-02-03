// Copyright 2020 Sourcerer Inc.
// Author: Alexander Surkov (alex@sourcerer.io)

(function() {
  'use strict';

window.onload = () => {
  // Add top languages having no lib coverage.
  Array.prototype.push.apply(
    window.libStats,
    window.topLangs.
      filter(v => !window.libStats.find(s => s[0] == v)).
      map(v => ([ v, 0 ]))
  );

  // Sort langs to match top langs order.
  let stats = window.libStats.
    sort((a, b) => {
      let a_i = window.topLangs.findIndex(v => v == a[0]);
      if (a_i == -1) {
        a_i = Number.MAX_VALUE;
      }
      let b_i = window.topLangs.findIndex(v => v == b[0]);
      if (b_i == -1) {
        b_i = Number.MAX_VALUE;
      }
      return a_i - b_i;
    });

  let labels = stats.map(v => v[0]);
  let values = stats.map(v => v[1]);

  // Plot a chart, x axis is languages ordered by popularity (first is the most
  // popular), y axis is number of libraries.
  let data = [{
    x: labels,
    y: values,
    type: 'bar',
  }];
  let layout = {
    title: 'Sourcerer libraries coverage<br>Languages are ordered by popularity',
  };
  Plotly.newPlot('chart', data, layout);

}

}());
