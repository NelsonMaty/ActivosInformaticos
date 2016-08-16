angular.module('activosInformaticosApp')
  .controller('ShowAssetCtrl', function ($stateParams,$previousState, $scope, $mdDialog, $mdMedia, $mdToast, $state, dataFactory) {
    $scope.asset = $stateParams.asset;
    //console.log($stateParams);
    $scope.assetVersions = [];
    // $scope.editAsset = editAsset;
    //$scope.goRelation = goRelation;
    // $scope.goToMap = goToMap;
    // $scope.searchNode = searchNode;
    $scope.profundidad = 0;
    //$scope.direccionRelaciones = false;
    $scope.filtros = ['Todas', 'Salientes', 'Entrantes'];
    $scope.direccionRelaciones = 'Todas';
    $scope.sel_version = {};
    $scope.relationsTree = {};
    $scope.criticosOut = [];
    $scope.relationsOut = [];
    $scope.criticosIn = [];
    $scope.relationsIn = [];
    $scope.esFinal = false;
    $scope.estadoVersionFinal = false;
    $scope.asset_type = {};
    $scope.names_list = [];
    $scope.listas = [];
    $scope.versionListas = [];
    $scope.showVersion = false;
    $scope.buscado2 = "";
    $scope.keys = Object.keys($scope.asset);

    $scope.keys.splice($scope.keys.indexOf("name"),1);
    $scope.keys.splice($scope.keys.indexOf("tags"),1);
    $scope.keys.splice($scope.keys.indexOf("estadoActual"),1);
    $scope.keys.splice($scope.keys.indexOf("stakeholders"),1);
    $scope.keys.splice($scope.keys.indexOf("comment"),1);
    $scope.keys.splice($scope.keys.indexOf("$$hashKey"),1);
    $scope.keys.splice($scope.keys.indexOf("attached"),1);

    if ($scope.keys.indexOf("__v")>=0) {

      $scope.b =$scope.keys.indexOf("__v");
      $scope.keys.splice($scope.b,1);

    }

    if ($scope.keys.indexOf("deleted")>=0) {

      $scope.a =$scope.keys.indexOf("deleted");
      $scope.keys.splice($scope.a,1);
    }

    $scope.goHome = function() {
      $state.go('usuario');
    };

    $scope.goEditAsset = function() {
      $state.go('editActivo',{asset: $scope.asset});
      $previousState.set('verActivo','activo',{asset: $scope.asset});
    }

    $scope.goRelation = function(relation,assetId) {
      $state.go('relacion',{relation: relation, assetId: assetId});
      
    };

    $scope.searchNode = function(svgAnterior) {
        //find the node
        if (svgAnterior) {
            svg = svgAnterior
        }

        var selectedVal = document.getElementById('search').value;
        var node = svg.selectAll(".node");
        if (selectedVal == "none") {
            node.style("stroke", "white").style("stroke-width", "1");
        } else {
            var selected = node.filter(function (d, i) {
                return d.name != selectedVal;
            });
            selected.style("opacity", "0");
            var link = svg.selectAll(".link")
            link.style("opacity", "0");
            d3.selectAll(".node, .link").transition()
                .duration(5000)
                .style("opacity", 1);
        }
    };

    $scope.relationGraph = function ($scope,jsonMap,indice,profundidad) {
      //console.log(indice);
      //Constants for the SVG
      $scope.svgExist = true;
      var width = 1024,
          height = 800;

      //Set up the colour scale
      var color = d3.scale.category20();

      //Set up the force layout
      var force = d3.layout.force()
          .charge(-230)
          .linkDistance(160)
          .size([width, height]);


      //Append a SVG to the body of the html page. Assign this SVG as an object to svg
      //var svg = d3.select("body").append("svg")
      $("#relGraph").empty();
      var svg = d3.select("#relGraph").append("svg")
          .attr("width", width)
          .attr("height", height);

      //Read the data from the mis element - lee datos de los json para armar los nodos
      //var mis = document.getElementById('mis').innerHTML;
      //graph = JSON.parse(mis);

      function recorrerGrafo(grafo) {

        var ordenGlobal = 0;
        var cola = [];
        var current = {};
        var graph = {
          nodes: [{
              id: grafo._id,
              name: grafo.name,
              group: grafo.assetType._id,
              order: ordenGlobal
            }],
          links: []
        }
        grafo.order = ordenGlobal;
        cola.push(grafo);


        while (cola.length!=0) {
          current = cola.shift();

            //creo nodo actual de la cola
            if (!current.relations) current.relations = [];
            for (i=0;i<current.relations.length;i++) {
              var existeNodo=false;
              for (j=0;j<graph.nodes.length;j++) {
                if (current.relations[i].relatedAsset._id == graph.nodes[j].id){
                  existeNodo =true;
                  indiceExistente = j;
                }
              }
              if (existeNodo) {
                if (current.relations[i+1]) current.relations[i+1].relatedAsset.order = ordenGlobal+1;
                //cola.push(current.relations[i].relatedAsset);
                graph.links.push({source: current.order, target: graph.nodes[indiceExistente].order, value: 9, label: current.relations[i].outLabel});

              } else {
                current.relations[i].relatedAsset.order = ordenGlobal+1;
                cola.push(current.relations[i].relatedAsset);
                graph.nodes.push({id: current.relations[i].relatedAsset._id, name: current.relations[i].relatedAsset.name, group: current.relations[i].relatedAsset.assetType._id, order: ++ordenGlobal});
                graph.links.push({source: current.order, target: ordenGlobal, value: 9, label: current.relations[i].outLabel});

              }
            }
            if (!current.incomingRelations) current.incomingRelations = [];
            for (i=0;i<current.incomingRelations.length;i++) {
              var existeNodo=false;
              for (j=0;j<graph.nodes.length;j++) {
                if (current.incomingRelations[i].relatedAsset._id == graph.nodes[j].id){
                  existeNodo =true;
                  indiceExistente = j;
                }
              }
              if (existeNodo) {
                if (current.incomingRelations[i+1]) current.incomingRelations[i+1].relatedAsset.order = ordenGlobal+1;
                //cola.push(current.incomingRelations[i].relatedAsset);
                graph.links.push({source: graph.nodes[indiceExistente].order, target: current.order, value: 9, label: current.incomingRelations[i].inLabel});

              } else {
                if (!current.incomingRelations[i].relatedAsset.order) current.incomingRelations[i].relatedAsset.order = ordenGlobal+1;
                cola.push(current.incomingRelations[i].relatedAsset);
                graph.nodes.push({id: current.incomingRelations[i].relatedAsset._id, name: current.incomingRelations[i].relatedAsset.name, group: current.incomingRelations[i].relatedAsset.assetType._id, order: ++ordenGlobal});
                graph.links.push({source: ordenGlobal, target: current.order, value: 9, label: current.incomingRelations[i].inLabel});

              }
            }

        }
        //console.log(graph);
        return graph;
      }


      var graph = recorrerGrafo(jsonMap);

      var llamarActivo = function () {
        var asset = {};
        d = d3.select(this).node().__data__;
        if (d.id == jsonMap._id) {
          dataFactory.getAnAsset(jsonMap._id, function (response) {
            asset = response;
            var ev = {};

            //angular.element(document.getElementById('win')).scope().goAsset({},asset,indice);
            // $state.go()
            $state.go('activo',{asset: asset});
            $previousState.set('Activo','activo',{asset: $scope.asset});
          });
        } else  {
          for (i=0;i<graph.nodes.length;i++) {
            if (d.id == graph.nodes[i].id) {
              dataFactory.getAnAsset(graph.nodes[i].id, function (response) {
                asset = response;
                var ev = {};
                $state.go('activo',{asset: asset});
                $previousState.set('Activo','activo',{asset: $scope.asset});
                // for (i=0; i<$scope.myassets.length;i++) {
                //   if ($scope.myassets[i]._id == asset._id) angular.element(document.getElementById('win')).scope().goAsset({},asset,i);
                // }
                // angular.element(document.getElementById('win')).scope().goAsset({},asset,indice);
              });
            }
          }
        }

      };

      //Toggle stores whether the highlighting is on
      var toggle = 0;
      //Create an array logging what is connected to what
      var linkedByIndex = {};
      for (i = 0; i < graph.nodes.length; i++) {
          linkedByIndex[i + "," + i] = 1;
      };
      graph.links.forEach(function (d) {
          linkedByIndex[d.source + "," + d.target] = 1;
      });
      //This function looks up whether a pair are neighbours
      function neighboring(a, b) {
          return linkedByIndex[a.index + "," + b.index];
      }
      function connectedNodes() {
          if (toggle == 0) {
              //Reduce the opacity of all but the neighbouring nodes
              d = d3.select(this).node().__data__;
              node.style("opacity", function (o) {
                  return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
              });
              link.style("opacity", function (o) {
                  return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
              });
              //Reduce the op
              toggle = 1;
          } else {
              //Put them back to opacity=1
              node.style("opacity", 1);
              link.style("opacity", 1);
              toggle = 0;
          }
      }

      var optArray = [];
      for (var i = 0; i < graph.nodes.length - 1; i++) {
          optArray.push(graph.nodes[i].name);
      }
      optArray = optArray.sort();
      $(function () {
          $("#search").autocomplete({
              source: optArray
          });
      });

      $scope.searchNode(svg);

      //Creates the graph data structure out of the json data
      force.nodes(graph.nodes)
          .links(graph.links)
          .start();

          //Set up tooltip
      var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-16, 0])
          .html(function (d) {
          return  d.label + "";
      })
      svg.call(tip);

      //Create all the line svgs but without locations yet
      var link = svg.selectAll(".link")
          .data(graph.links)
          .enter().append("line")
          .attr("class", "link")
          .on('mouseover', tip.show) //Added
          .on('mouseout', tip.hide) //Added
          .style("marker-end",  "url(#suit)") // Modified line
          .style("stroke-width", function (d) {
          return Math.sqrt(d.value);
      });

      //Do the same with the circles for the nodes - no
      var node = svg.selectAll(".node")
          .data(graph.nodes)
          //.enter().append("circle")
          .enter().append("g")
          .attr("class", "node")
          .call(force.drag)

          .on('dblclick', llamarActivo) //Added code
          .on('click', connectedNodes); //Added code

      node.append("circle")
          .attr("r", 14)
          .style("fill", function (d) {
          return color(d.group);
      })

      node.append("text")
          .attr("dx", 14)
          .attr("dy", ".35em")
          .text(function(d) { return d.name })
          .style("stroke", "gray");

      svg.append("defs").selectAll("marker")
        .data(["suit", "licensing", "resolved"])
      .enter().append("marker")
        .attr("id", function(d) { return d; })
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("path")
        .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
        .style("stroke", "#4679BD")
        .style("opacity", "0.6");

      var padding = 12, // separation between circles
        radius=8;
      function collide(alpha) {
        var quadtree = d3.geom.quadtree(graph.nodes);
        return function(d) {
          var rb = 2*radius + padding,
              nx1 = d.x - rb,
              nx2 = d.x + rb,
              ny1 = d.y - rb,
              ny2 = d.y + rb;
          quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
              var x = d.x - quad.point.x,
                  y = d.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y);
                if (l < rb) {
                l = (l - rb) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        };
      }


      //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
      force.on("tick", function () {
          link.attr("x1", function (d) {
              return d.source.x;
          })
              .attr("y1", function (d) {
              return d.source.y;
          })
              .attr("x2", function (d) {
              return d.target.x;
          })
              .attr("y2", function (d) {
              return d.target.y;
          });


          d3.selectAll("circle").attr("cx", function (d) {
              return d.x;
          })
              .attr("cy", function (d) {
              return d.y;
          });

          node.each(collide(0.5)); //Added

          d3.selectAll("text").attr("x", function (d) {
              return d.x;
          })
              .attr("y", function (d) {
              return d.y;
          });
      });
    };

    $scope.goToMap = function (selected,indice,profundidad) {
      dataFactory.getRelationMap(selected._id, profundidad, function (response) {
        //console.log(response);
        $scope.relationGraph($scope,response,indice,profundidad);
      });
    };

    dataFactory.getAnAssetType($scope.asset.typeId, function (response) {

      $scope.asset_type = response;

      for (i=0;i<response.properties.length;i++) {
        if (response.properties[i].type=="List") {
          $scope.names_list.push(response.properties[i].name);

        }
      }

      for (i=0;i<$scope.names_list.length;i++) {
        for (j=0;j<$scope.keys.length;j++) {

          if($scope.names_list[i] == $scope.keys[j]) {

            $scope.listas.push({
              name: $scope.names_list[i],
              elements: $scope.asset[$scope.keys[j]]
            });
            $scope.keys.splice(j,1);

          }
        }
      }

      for (i=0;i<response.lifeCycle.length;i++) {
        if (response.lifeCycle[i].name == $scope.asset.estadoActual) {
          $scope.esFinal = response.lifeCycle[i].isFinal;
        }
      }

    });

    $scope.goToVersion = function(idVersion, indiceVersion) {
      $scope.showVersion = true;
      $scope.sel_version = $scope.assetVersions[indiceVersion];

      $scope.versionKeys = Object.keys($scope.sel_version.asset);

      $scope.versionKeys.splice($scope.versionKeys.indexOf("name"),1);
      $scope.versionKeys.splice($scope.versionKeys.indexOf("tags"),1);
      $scope.versionKeys.splice($scope.versionKeys.indexOf("estadoActual"),1);
      $scope.versionKeys.splice($scope.versionKeys.indexOf("stakeholders"),1);
      $scope.versionKeys.splice($scope.versionKeys.indexOf("comment"),1);
      $scope.versionKeys.splice($scope.versionKeys.indexOf("$$hashKey"),1);
      $scope.versionKeys.splice($scope.versionKeys.indexOf("attached"),1);

      if ($scope.versionKeys.indexOf("__v")>=0) {
        $scope.b =$scope.versionKeys.indexOf("__v");
        $scope.versionKeys.splice($scope.b,1);
      }

      if ($scope.versionKeys.indexOf("deleted")>=0) {
        $scope.a =$scope.versionKeys.indexOf("deleted");
        $scope.versionKeys.splice($scope.a,1);
      }

      for (i=0;i<$scope.names_list.length;i++) {
        for (j=0;j<$scope.versionKeys.length;j++) {
            if($scope.names_list[i] == $scope.versionKeys[j]) {

              $scope.versionListas.push({
                name: $scope.names_list[i],
                elements: $scope.sel_version.asset[$scope.versionKeys[j]]
              });
              $scope.versionKeys.splice(j,1);

            }
        }
      }

      for (i=0;i<$scope.asset_type.lifeCycle.length;i++) {
        if ($scope.asset_type.lifeCycle[i].name == $scope.sel_version.asset.estadoActual) {
          $scope.estadoVersionFinal = $scope.asset_type.lifeCycle[i].isFinal;
        }
      }

    }

    $scope.closeVersion = function() {
      $scope.showVersion = false;
      $scope.sel_version = {};
    }

    $scope.confirmRestoreVersion = function(ev, asset) {
      var confirm = $mdDialog.confirm()
          .title('¿Está seguro que desea restaurar el activo a la versión seleccionada?')
          .ariaLabel('Restaurar activo')
          .targetEvent(ev)
          .ok('Aceptar')
          .cancel('Cancelar');
      $mdDialog.show(confirm)
        .then(function() {
          //console.log(asset);
          $scope.restoreVersion(asset);

        }, function() {
          $scope.status = 'No se realizaron cambios';
        });
    };

    $scope.restoreVersion = function (asset) {
      dataFactory.editAsset (function (){
          $mdDialog.hide(asset);
          $scope.myassets.splice($scope.indice,1,asset);
          $scope.resultadoBusqueda.splice($scope.indexBusqueda,1,asset);

        }, asset, $mdDialog, $mdToast);
    };

    $scope.goBack = function() {
      // $mdDialog.cancel();
      //$previousState.go();
      var previous = $previousState.get();
      // console.log(previous);
      if (previous && previous.state.name == 'activo') {
        $previousState.go();
        $previousState.forget();
      } else {
        $state.go('usuario');
      }

    };

    dataFactory.getAssetVersions($scope.asset._id, function (response) {
      $scope.assetVersions = response;

    });

    dataFactory.getRelationMap($scope.asset._id,null, function (response) {
      $scope.relationsTree = response;
      //console.log(response);
    });

    $scope.callGoAsset = function (event, relatedAsset) {
      // console.log(relatedAsset);
      // for (i=0;i<$scope.myassets.length;i++) {
      //   if ($scope.myassets[i]._id == relatedAsset._id) {
      //
      //     var data = { evento:event, activo:$scope.myassets[i], indice: i }
      //     $mdDialog.hide(data);
      //   }
      // }
      dataFactory.getAnAsset(relatedAsset._id, function (response) {
        $state.go('activo',{asset: response});
        $previousState.set('Activo','activo',{asset: $scope.asset});
      })

    }

    dataFactory.getAssetRelations($scope.asset._id, function (response) {
      for (i=0;i<response.length;i++) {
        $scope.relationsOut.push(response[i]);
        if (response[i].isCritical) {
          $scope.criticosOut.push({texto: "Sí", valor:true});
        } else {
          $scope.criticosOut.push({texto: "No", valor:false});
        }
      }
    });

    dataFactory.getIncomingAssetRelations($scope.asset._id, function (response) {
      for (i=0;i<response.length;i++) {
        response[i].isIncoming="true";
        $scope.relationsIn.push(response[i]);
        if (response[i].isCritical) {
          $scope.criticosIn.push({texto: "Sí", valor:true});
        } else {
          $scope.criticosIn.push({texto: "No", valor:false});
        }
      }
    });

    dataFactory.getActualStateGraph( $scope.asset._id, function (response) {
      $scope.lifeCycleGraph = response;

    });

    var svg = null;
    $scope.svgExist = false;
    $scope.goToMap($scope.asset,null);
});
