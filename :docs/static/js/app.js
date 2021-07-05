// Create a function for plot building
function buildPlots(id) {
    /* 
    1. Extract data from the json file
    2. Grab values from the json object to build the plots - 
      * sampleData - created to represents all key:value pairs 
          for the first sample
      * topTenSampValues
          Grab top 10 sample_values, need to slice
          Reverse to get descending order in plot
      * topTenOtuIds
          Grab top 10 otu_ids - need to slice
          Reverse to get descending order in plot
      * TopTenOtuLabels
          Grab top 10 otu_labels for the tooltip portion of the plot
    3. Add the string acronym "OTU" in front of the otu_id number 
        to show up on plot
    4. Run barChart and bubChart to create plots.
    */
    d3.json("samples.json").then((data) => {
        var sampleData = data.samples.filter(item => item.id === id)[0];
        var topTenSampValues = sampleData.sample_values.slice(0, 10);
        var topTenSVReverse = topTenSampValues.reverse();
        var topTenOtuIds = sampleData.otu_ids.slice(0, 10);
        var topTenOtuIdsReverse = topTenOtuIds.reverse();
        var topTenOtuLabels = sampleData.otu_labels.slice(0, 10);
        var otuAddition = topTenOtuIdsReverse.map(item => "OTU " + item);
        barChart(topTenSVReverse, otuAddition, topTenOtuLabels)
        bubChart(sampleData)
    });
};

/*----------------------------------------------------------------------------*/

function barChart(topTenSVReverse, otuAddition, topTenOtuLabels) {
    // Horizontal Bar Chart
    // Step 1: Trace variable
    var trace1 = {
      x: topTenSVReverse,
      y: otuAddition,
      text: topTenOtuLabels,
      type: "bar",
      orientation: "h",
      marker: {
          color: 'rgba(5,100,5,0.7)',
          width: 1
        },
    };
   
    // Step 2: Data variable
    var barChartData = [trace1];
   
    // Step 3: Layout variable
    var barChartLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
            l: 250,
            r: 250,
            t: 50,
            b: 50
        },
        xaxis: {title: "Sample Values"},
        yaxis: {title: "OTU ID"}
    };
   
    // Step 4: Plot!
    Plotly.newPlot("bar",barChartData,barChartLayout);
  }
   
  function bubChart(sampleData) {
      // Bubble Chart
      // Step 1: Trace variable
      var trace2 = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        mode: 'markers',
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids,
            opacity: sampleData.otu_ids
        },
        text: sampleData.otu_labels
    };
   
      // Step 2: Data variable
      var bubChartData = [trace2];
   
      // Step 3: Layout variable
      var bubChartLayout = {
          title: "Top 10 Bacteria Cultures Found",
          showlegend: false,
          height: 600,
          width: 1400,
          xaxis: {title: "OTU ID"},
          yaxis: {title: "Sample Values"}    
      };
   
      // Step 4: Plot!
      Plotly.newPlot("bubble",bubChartData,bubChartLayout);
  };
  
  /*----------------------------------------------------------------------------*/
   
  // Create a function for the metadata 
  function buildDemographics(id) {
      // Extract data from the json file
      d3.json("samples.json").then((data) => {
      // Grab the metadata and assign to a variable
          var demographics = data.metadata;
          // Filter by ID
          var filteredDemographics = demographics.filter(item => item.id.toString() === id)[0];
          // Select Demographic Info box of webpage to enter the data
          var demographicInfobox = d3.select("#sample-metadata");
          // Clear previous data prior to user selection
          demographicInfobox.html("");
          // Grab data based on user selection, append to Demographic Info box
          Object.entries(filteredDemographics).forEach((key) => {   
              demographicInfobox.append("h4").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
          });
      });
  }
   
  /*----------------------------------------------------------------------------*/
   
  // Create a function to display initial dashboard
  function init() {
   
      /* Grab #selDataset html id tag, this is where a sample id 
      is selected by user */
      var dropDownMenu = d3.select("#selDataset");
   
      // Read JSON data based on user's selection 
      d3.json("samples.json").then((data)=> {
          // Fetching user-selected data
          data.names.forEach(function(name) {
              /* Append new element called "option", setting text of the option 
              to sample id (name in this case) */
              var dropDownData = dropDownMenu.append("option").text(name);
              // Grab values for the data using .property("value")
              dropDownData.property("value");
          });
   
          /* Call functions to display all elements on page, use first id 
          upon visiting page */
          buildPlots(data.names[0]);
          buildDemographics(data.names[0]);
      });
  };
   
  /*----------------------------------------------------------------------------*/
   
  // Create a function for the event change, pass in previous functions
  function selectionChanged(id) {
      buildPlots(id);
      buildDemographics(id);
  }
   
  init();