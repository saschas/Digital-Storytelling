
var treeDataneu = [];



var data = [
    { "name" : "605369199549132800", "parent" : "null", "accountname": "@fabuchao", "text": "Es war einmal ein Mann namens Testibald."  },
    { "name" : "605369594220539904", "parent" : "605369199549132800", "accountname" : "@vinni_le_cochon", "text": "Er hatte zwei große Hände mit dennen er ganz schnell Tippen konnte."  },
    { "name" : "605369903017828352", "parent" : "605369594220539904", "accountname" : "@fabuchao", "text": "Aber eines Tages, in einer kleinen Gasse, kam ein maskierter Mann mit einer roten Axt."  },

    { "name" : "605372296677732352", "parent" : "605369903017828352", "accountname" : "@SaschaSigl", "text": "neben der Axt hatte er auch eine blaue pasmakanone."  },
    { "name" : "605370232782372864", "parent" : "605369903017828352", "accountname" : "@vinni_le_cochon", "text": "Seine großen Hände waren ihm aufgefallen und er fragte sich ob es überhaupt Handschuhe in dieser Größe gab."  },
    { "name" : "605370756395069442", "parent" : "605370232782372864", "accountname" : "@vinni_le_cochon", "text": "Testibald war schockiert. Er wusste bis dato nicht, dass er so große Hände hatte."  },
   
    { "name" : "605781370040745986", "parent" : "605370756395069442", "accountname" : "@fabuchao", "text": "Test Test #hashtag Tet Test"  },
    { "name" : "605756325897859073", "parent" : "605370756395069442", "accountname" : "@vinni_le_cochon", "text": "und er dachte sich: was machen denn Franz und Jeisson hier?!"  },

    { "name" : "605374015381905408", "parent" : "605370232782372864", "accountname" : "@TrancePhillip", "text": "Die rote Axt hingegen schwang bereits gefährlich nahe an dem Marktstand des runzligen Rainers vorbei. "  },
    { "name" : "605410537661431808", "parent" : "605374015381905408", "accountname" : "@se", "text": "»Wer kommt denn auf die Idee in einer solch schmalen Gasse einen Marktstand aufzubauen« grübelte Testibald als plötzlich"  },
    { "name" : "605463847131054080", "parent" : "605410537661431808", "accountname" : "@vinni_le_cochon", "text": "ein riesengroßer Zwerg auf ihn zukam und fragte:"  },


];



var dataMap = data.reduce(function(map, node) {
 map[node.name] = node;
 return map;
}, {});

var treeData = [];
data.forEach(function(node) {
 // add to parent
 var parent = dataMap[node.parent];
 if (parent) {
  // create child array if it doesn't exist
  (parent.children || (parent.children = []))
   // add node to child array
   .push(node);
 } else {
  // parent is null or missing
  treeData.push(node);
 }
});




// ************** Generate the tree diagram  *****************
//width und height sind vertauscht weil der Graph spaeter gedreht wird.//
var margin = {top: 20, right: 20, bottom: 20, left: 20},
 width = 1500 - margin.right - margin.left,
 height = 1500 - margin.top - margin.bottom;
 
var i = 0;

var tree = d3.layout.tree().size([height, width]);
        //x&y vertauscht fuer vertical
var diagonal = d3.svg.diagonal().projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("body").append("svg")
 .attr("width", width + margin.right + margin.left)
 .attr("height", height + margin.top + margin.bottom)
  .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];
  
update(root);

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
   links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 90; });

  // Declare the nodesâ€¦
  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) { 
            //x&y vertauscht fuer vertical
    return "translate(" + d.x + "," + d.y + ")"; });

  nodeEnter.append("circle")
   .attr("r", 10)
   .style("fill", "#fff");


//pkatziert accountname darüber

  nodeEnter.append("text")
   .attr("x", function(d) { 
    return d.children || d._children ? 25 : 25; })
   .attr("dy", ".35em")
   .attr("text-anchor", function(d) { 
    return d.children || d._children ? "end" : "start"; })
   .text(function(d) { return d.accountname; })
   .style("fill-opacity", 1);

   //Text darunter
     nodeEnter.append("text")   
   .attr("y", function(d) {return d.children || d._children ? 25 : 25; })       //WIE FUNKTioNIeRT DAS????//
   .attr("dy", ".35em")
   .attr("text-anchor", function(d) { 
    return d.children || d._children ? "end" : "start"; })
   .text(function(d) { return d.text; })
   .style("fill-opacity", 1);

  // Declare the links¦
  var link = svg.selectAll("path.link")
   .data(links, function(d) { return d.target.id; });

  // Enter the links.
  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);

}


$( "#derKnopf" ).click(function() {
});



$( "#derKnopfsave" ).click(function() {
  alert("nothing yet");
});

$( "#derKnopfdelete" ).click(function() {
  alert("nothing yet");
});

$( "#derKnopfrenderagain" ).click(function() {
  alert("nothing yet");
});