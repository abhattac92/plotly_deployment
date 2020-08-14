function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    optionChanged(940);
  })}
  
function optionChanged(newSample) {
buildMetadata(newSample);
buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      //var result = Object.entries(resultArray[0]);
      var PANEL = d3.select("#sample-metadata");
      var PANEL2 = d3.select(".panel-body");
  
      PANEL.html("");
      Object.entries(resultArray[0]).forEach(([k,v]) =>{
          PANEL2.append("h6").text(`${k} : ${v}`)
      });
    });
  }

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var metadata = data.metadata;
      var gaugeArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var gauge = gaugeArray[0];
      var result = resultArray[0];
      var otu_ids = result.otu_ids.slice(0,10).reverse();
      var otu_labels = result.otu_labels.slice(0,10).reverse();
      var sample_values = result.sample_values.slice(0,10).reverse();
      console.log(otu_ids,otu_labels, sample_values);

      var trace1 = {
        x: sample_values,
        y: otu_ids.map(id => "OTU" + id),
        text: otu_labels,
        name: "Top 10 Species",
        type: "bar",
        orientation: "h"
      };

      species = [trace1];
      Plotly.newPlot("bar", species);

      var gaugeChart = [
        {
          domain: { x: [0, 9], y: [0, 9] },
          value: gauge.wfreq,
          title: { text: "Belly Button Washing Frequency" },
          type: "indicator",
          mode: "gauge+number"
        }
      ];
      
      var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', gaugeChart, gaugeLayout);

      var trace2 = {
        x: result.otu_ids,
        y: result.sample_values,
        text: result.otu_labels,
        mode: 'markers',
        marker: {
          color: result.otu_ids,
          size: result.sample_values
        }
      };
      
      var bubble = [trace2];
      
      var layout = {
        showlegend: false,
        height: 400,
        width: 1200
      };
      
      Plotly.newPlot('bubble', bubble, layout);
    });
}

  init();