//Copyright 2016 Andrew Paradi
//inputs
var baseURL = "http://shopicruit.myshopify.com/products.json";
var pageURL = "?page="
var pageStart = 1;
var pageEnd = 100;
var categories = ['Clock', 'Watch'];
var outputControl = true;

if (outputControl) console.log("running shopify-tally");
if (outputControl) console.log("tallying prices and quantities for ", categories);

//initialization
var dataObjects = [];
var output = [];
var download;
//results format [ clock $, watch $, ... $ , total price $, clock q, watch q,  ... q, total q ]
var results = Array.apply(null, Array((categories.length+1)*2)).map(Number.prototype.valueOf,0);

//queues and saves JSON downloads to dataObjects array
for (var i=pageStart;i<pageEnd; i++) {
  var url = baseURL+pageURL+i;
  var download = $.getJSON(url, {json:JSON.stringify(url)}, function(data) {
    if (data.products.length) dataObjects.push(data);
  })
}

//upon completed save, loop through objects, tally price/quantity into results 
download.done(function() {
  if (dataObjects.length > 4) {
    for (var i=0; i<dataObjects.length; i++) {
      for (var j=0; j<dataObjects[i].products.length; j++) {
        for (var k=0; k<categories.length; k++) {
          if (dataObjects[i].products[j].product_type == categories[k]) {
            for (var m=0; m<dataObjects[i].products[j].variants.length; m++) {
              var price = Math.round(parseFloat(dataObjects[i].products[j].variants[m].price, 10)*100) / 100;
              results[categories.length]+=price;
              results[k]+=price;
              results[categories.length*2+1]++;
              results[categories.length+k+1]++;
            }
          }
        } 
      }
    }
    
    //output tallied results
    output = categories.slice();
    output[output.length] = "Total " + categories;
    for (var r=0; r<output.length; r++) {
      if (outputControl) console.log(results[r+output.length].toString(), output[r]+" for $", (Math.round(results[r]*100) / 100).toString());
    }
    window.alert(results[output.length*2-1].toString() +" " + output[output.length-1] + " for $" + (Math.round(results[output.length-1]*100) / 100).toString());
    if (outputControl) console.log("fin with code 0");
  }
})
