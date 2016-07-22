
angular.module('activosInformaticosApp')
  .controller('AppController', function ($scope, $mdDialog, $mdSidenav, $timeout, $location, $mdMedia, $mdToast, dataFactory, NgTableParams) {


    $scope.toggleSidenav = function(menuId) {
    	//$mdSidenav(menuId).toggle();
    };

    $scope.assettypes = {};
    $scope.clicked_asset = {};
    $scope.clicked_relation = {};
    $scope.clicked_index = {};
    $scope.clicked = false;
    $scope.busquedaAvanzada = false;
    $scope.opcionBusqueda = "tipo";
    $scope.buscando = false;
    $scope.filtros = ['Todas', 'Salientes', 'Entrantes'];
    $scope.direccionRelaciones = 'Todas';
    $scope.buscadoString = "";
    $scope.buscadoTipo = "";
    $scope.buscadoAtributo = "";
    $scope.buscadoValor = "";
    $scope.indicesBusqueda = [];
    $scope.selectedType = "";
    $scope.listaAtrib = [];


    var animationMenuExit = function(trigger, element){
        element = $(element);
            element.addClass('animated ' + 'bounceOutLeft');
            window.setTimeout( function(){

                    element.removeClass('animated ' + 'bounceOutLeft');
                    $scope.clicked = false;
                    $scope.clickedR = false;
                    $scope.$apply();
            }, 1100);

    }

    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
          });
      }
    }

    $scope.listarAtributos = function () {
      //$scope.listaAtrib = ["comment","estadoActual","tags",];
      $scope.listaAtrib = [
        { texto: "Comentarios", valor: "comment"},
        { texto: "Estado Actual", valor: "estadoActual"},
        { texto: "Tags", valor: "tags"},
        { texto: "Nombre de contacto", valor: "stakeholders.name"},
        { texto: "Email de contacto", valor: "stakeholders.email"},
        { texto: "Adjunto", valor: "attached"},
      ];
      dataFactory.getAnAssetType($scope.selectedType,function (response) {
        for (i=0;i<response.properties.length;i++) {
          $scope.listaAtrib.push({texto: response.properties[i].name, valor: response.properties[i].name })
        }
      });

    }

    $scope.cerrarAvanzado = function () {
      $scope.busquedaAvanzada = false;
      $mdSidenav('right').close()
        .then(function () {
        });
    }

    $scope.toggleRight = buildToggler('right');

    $scope.go = function(path) {
      //location.href = "0.0.0.0:9000/#/admin";
      $location.path( path );
    }

    dataFactory.getAssetTypes( function (response) {
      $scope.assettypes = response;
    });

    dataFactory.getAssets( function (response) {

      $scope.myassets = response;

    });

    $scope.searchRelations = function(id,nombreActivo) {
      $scope.sourceAssetId = id;
      $scope.select_asset = {
        _id: id,
        name: nombreActivo
      };
      //$scope.select_asset._id = id;
      //$scope.select_asset.name = nombreActivo;
      $scope.clicked_RelationIndex = null;
      $scope.buscando = true;

      switch ($scope.direccionRelaciones) {
        case 'Todas':
          dataFactory.getAssetRelations(id, function (response) {
            $scope.assetRelations = response;
            $scope.labels = [];
            $scope.relatedAssets = [];
            dataFactory.getIncomingAssetRelations(id, function (response) {
              for (i=0;i<response.length;i++) {
                response[i].isIncoming = true;
                $scope.assetRelations.push(response[i]);
              }
              dataFactory.getRelationMap(id, function (response) {
                //console.log(response.relations);
                for (i=0;i<response.relations.length;i++) {
                  $scope.labels.push(response.relations[i].relationLabel);
                  $scope.relatedAssets.push(response.relations[i].relatedAsset.name);
                }
                //console.log(response.incomingRelations);
                for (i=0;i<response.incomingRelations.length;i++) {
                  $scope.labels.push(response.incomingRelations[i].relationLabel);
                  $scope.relatedAssets.push(response.incomingRelations[i].relatedAsset.name);
                }
                window.setTimeout( function(){
                  $scope.buscando = false;
                  $scope.$apply();
                }, 500);

                //console.log($scope.labels);
              });
            });
          });
          break;
        case 'Salientes':
          dataFactory.getAssetRelations(id, function (response) {
              $scope.assetRelations = response;
              $scope.labels = [];
              $scope.relatedAssets = [];
              // for (i=0;i<$scope.assetRelations.length;i++) {
              //   dataFactory.getARelationType($scope.assetRelations[i].relationTypeId, function (response) {
              //
              //     $scope.labels.push(response);
              //
              //   });
              // }
              dataFactory.getRelationMap(id, function (response) {
                for (i=0;i<response.relations.length;i++) {
                  $scope.labels.push(response.relations[i].relationLabel);
                  $scope.relatedAssets.push(response.relations[i].relatedAsset.name);
                }
                window.setTimeout( function(){
                  $scope.buscando = false;
                  $scope.$apply();
                }, 500);
              });
          });
          break;
        case 'Entrantes':
          dataFactory.getIncomingAssetRelations(id, function (response) {

              $scope.assetRelations = response;
              $scope.labels = [];
              $scope.relatedAssets = [];
              for(i=0;i<$scope.assetRelations.length;i++) {
                $scope.assetRelations[i].isIncoming="true";
              }
              // for (i=0;i<$scope.assetRelations.length;i++) {
              //
              //   dataFactory.getARelationType($scope.assetRelations[i].relationTypeId, function (response) {
              //
              //     $scope.labels.push(response);
              //
              //   });
              // }
              dataFactory.getRelationMap(id, function (response) {
                for (i=0;i<response.incomingRelations.length;i++) {
                  $scope.labels.push(response.incomingRelations[i].relationLabel);
                  $scope.relatedAssets.push(response.incomingRelations[i].relatedAsset.name);
                }
                window.setTimeout( function(){
                  $scope.buscando = false;
                  $scope.$apply();
                }, 500);
            });
          });
          break;
        default:
          break;

      }

    }

    $scope.clickAsset = function(asset,indice) {
      $scope.clicked_asset = asset;
      $scope.clicked_index = indice;
      $scope.clicked = true;
    };

    $scope.clickRelation = function(relation,indice) {
      $scope.clicked_relation = relation;
      $scope.clicked_RelationIndex = indice;
      $scope.clickedR = true;
    };

    $scope.clickedIcon= function(indice) {
      return($scope.clicked_index == indice);
    };

    $scope.clickedRelacionIcon= function(indice) {
      return($scope.clicked_RelationIndex == indice);
    };

    $scope.clickClose = function () {
      if ($scope.clicked) {
        $scope.clicked_index = null;
        animationMenuExit(null,$(".cerrar-menu-activo"),'bounceOutLeft');
      }

    };

    $scope.clickRelacionClose = function() {
      if ($scope.clickedR) {
        $scope.clicked_RelationIndex = null;
        animationMenuExit(null,$(".cerrar-menu-activo"),'bounceOutLeft');
      }
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

    var svg = null;
    $scope.svgExist = false;

    $scope.relationGraph = function ($scope,jsonMap,indice) {
      //Constants for the SVG
      $scope.svgExist = true;
      var width = 1200,
          height = 600;

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
      var salientes = true;
      if (jsonMap.relations.length == 0) {
        salientes = false;
        var graph = {
          nodes: [],
          links: []
        };
      } else {
        var graph = {
          nodes: [
            {
              name: jsonMap.name,
              group: jsonMap.assetType._id,

            }

          ],
          links: [

          ]
        };
      }
      //Creacion de nodos y relaciones salientes
      for (i=0;i<jsonMap.relations.length;i++) {
        graph.nodes.push({ name: jsonMap.relations[i].relatedAsset.name, group: jsonMap.relations[i].relatedAsset.assetType._id});
        graph.links.push({ source: 0, target: (i+1), value: 9, label: jsonMap.relations[i].relationLabel });

      }

      //Creacion de relaciones entrantes
      for (i=0;i<jsonMap.incomingRelations.length;i++) {
        var existeNodo=false;
        var source = null;
        // for (j=0;j<jsonMap.relations.length;j++) {
        for (j=0;j<graph.nodes.length;j++) {
          // if (jsonMap.incomingRelations[i].relatedAsset.name == jsonMap.relations[j].relatedAsset.name){
          if (jsonMap.incomingRelations[i].relatedAsset.name == graph.nodes[j].name){
            existeNodo =true;
            indiceExistente = j;
          }
        }
        // Agrego nodo si este no existe
        if (!existeNodo) {
            //console.log("Agrego nodo que no existe");
            graph.nodes.push({ name: jsonMap.incomingRelations[i].relatedAsset.name, group: jsonMap.incomingRelations[i].relatedAsset.assetType._id});
        }

        //Si hay relaciones salientes
        if (salientes) {
          //console.log("Hay relaciones salientes");
          if (existeNodo) {
              //console.log("Creo relacion entrante con nodo existente, indice: "+ indiceExistente);
              graph.links.push({ source: indiceExistente, target: 0, value: 9, label: jsonMap.incomingRelations[i].relationLabel });
          } else {
              //console.log("Creo relacion entrante con nodo nuevo, indice: "+(graph.nodes.length-1));
              // graph.links.push({ source: (i+jsonMap.relations.length+1), target: 0, value: 9, label: jsonMap.incomingRelations[i].relationLabel });
              graph.links.push({ source: (graph.nodes.length-1), target: 0, value: 9, label: jsonMap.incomingRelations[i].relationLabel });
          }

        } else {
          //console.log("no hay relaciones salientes");
          if (existeNodo) {
              //console.log("Creo relacion con nodo existente, indice: "+indiceExistente);
              graph.links.push({ source: indiceExistente, target: jsonMap.incomingRelations.length, value: 9, label: jsonMap.incomingRelations[i].relationLabel });
          } else {
              //console.log("Creo relacion entrante con nodo nuevo, indice: "+i);
              graph.links.push({ source: i, target: jsonMap.incomingRelations.length, value: 9, label: jsonMap.incomingRelations[i].relationLabel });
          }

        }
      }

      if (!salientes){
        graph.nodes.push({ name: jsonMap.name, group: jsonMap.assetType._id});

      }
      console.log(graph);

      var llamarActivo = function () {
        var asset = {};
        d = d3.select(this).node().__data__;
        if (d.name == jsonMap.name) {
          dataFactory.getAnAsset(jsonMap._id, function (response) {
            asset = response;
            var ev = {};
            //console.log(indice);
            //$scope.goAsset(ev,asset,indice);
            angular.element(document.getElementById('win')).scope().goAsset({},asset,indice);
          });
        } else {
          for (i=0;i<jsonMap.relations.length;i++) {
            if (d.name == jsonMap.relations[i].relatedAsset.name) {
              dataFactory.getAnAsset(jsonMap.relations[i].relatedAsset._id, function (response) {
                asset = response;
                //console.log(indice);
                angular.element(document.getElementById('win')).scope().goAsset({},asset,i-1);
                //$scope.goToAsset({},asset,indice);
              });
            }
          }
          for (i=0;i<jsonMap.incomingRelations.length;i++) {
            if (d.name == jsonMap.incomingRelations[i].relatedAsset.name) {
              dataFactory.getAnAsset(jsonMap.incomingRelations[i].relatedAsset._id, function (response) {
                asset = response;
                //console.log(indice);
                angular.element(document.getElementById('win')).scope().goAsset({},asset,i-1);
                //$scope.goToAsset({},asset,indice);
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


    $scope.goToMap = function (selected,indice) {
      dataFactory.getRelationMap(selected._id, function (response) {

        $scope.relationGraph($scope,response,indice);
      });
    };


    $scope.busqueda = function (string,nombreTipo,atributo,valor,tipoBusqueda) {
      $scope.indicesBusqueda = [];
      $scope.buscando = true;

      var soloTipo = false;
      if (nombreTipo != "" && string == "") {
        soloTipo = true;
      }

      var buscarIndices = function () {
        for (i=0; i<$scope.resultadoBusqueda.length;i++) {
          for (j=0; j<$scope.myassets.length;j++) {
              if ($scope.resultadoBusqueda[i]._id == $scope.myassets[j]._id ) {
                $scope.indicesBusqueda.push(j);
              }
          }
        }
      }

      if (tipoBusqueda != 'params') {
        dataFactory.searchString(string, nombreTipo, soloTipo, function (response) {

          $scope.resultadoBusqueda = response;
          buscarIndices();
          $scope.buscando = false;
        });
      } else {
        dataFactory.searchParams(atributo, valor, function (response) {
          $scope.resultadoBusqueda = response;
          buscarIndices();
          $scope.buscando = false;
        });
      }

    }


    //-----------Assets-----------//

      $scope.showAddAsset = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          locals: {
            assettypes: $scope.assettypes,
            showformly: $scope.showFormly
            //fields: {}
          },
          controller: SelectTypeCtrl,
          templateUrl: '../../views/add_asset.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function() {
          //console.log(user);
          //$scope.showFormly(ev);

        });

      };

      $scope.showFormly = function(formly_fields,typeid, listas) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          locals: {
            fields: formly_fields,
            typeid: typeid,
            listas: listas
          },
          controller: AddAssetCtrl,
          templateUrl: '../../views/formly.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(asset) {
          //console.log("termine de agregar");
          if (asset) {
            //console.log(asset);
            $scope.myassets.push(asset);
            //console.log($scope.myassets);
          }


        });

      };

      $scope.goAsset = function(ev,asset,indice,indexBusqueda) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log(asset);
        $mdDialog.show({
          locals: {
            asset: asset,
            myassets: $scope.myassets,
            resultadoBusqueda : $scope.resultadoBusqueda,
            indice: indice,
            indexBusqueda: indexBusqueda,
            editAsset: $scope.editAsset,
            goRelation: $scope.goRelation

          },
          controller: ShowAssetCtrl,
          templateUrl: '../../views/show_asset.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(data) {
          //console.log(data);

          if (data) {
            $scope.goAsset(data.evento, data.activo, data.indice);
          }

        });
      };

      $scope.editAsset = function(ev,asset,indice,indexBusqueda) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log(asset);
        $mdDialog.show({
          locals: {
            asset: asset,
            myassets: $scope.myassets,
            resultadoBusqueda: $scope.resultadoBusqueda,
            indice: indice,
            indexBusqueda: indexBusqueda,
            deleteAsset: $scope.deleteAsset

          },
          controller: EditAssetCtrl,
          templateUrl: '../../views/edit_asset.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function() {


        });

      };

      $scope.deleteAsset = function(ev, asset, indice,indexBusqueda) {
        var confirm = $mdDialog.confirm()
            .title('¿Está seguro que desea borrar este activo?')
            .ariaLabel('Borrado de activo')
            .targetEvent(ev)
            .ok('Aceptar')
            .cancel('Cancelar');
        $mdDialog.show(confirm)
          .then(function() {
            dataFactory.deleteAsset(asset,$mdDialog,$mdToast);
            $scope.myassets.splice(indice,1);
            if (indexBusqueda) {
              $scope.resultadoBusqueda.splice(indexBusqueda,1);
            }
          }, function() {
            $scope.status = 'No se realizaron cambios';
          });
      };

    //-----------Relations-----------//

      $scope.goRelation = function(ev,relation,assetId,indice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
         //console.log(relation);
         //console.log(assetId);
         //console.log(indice);
        $mdDialog.show({
          locals: {
            relation: relation,
            sourceAssetId: assetId,
            indice: indice,
            editRelation: $scope.editRelation

          },
          controller: ShowRelationCtrl,
          templateUrl: '../../views/show_relation.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function() {


        });
      };

      $scope.addRelation = function(ev,etapa,asset) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          locals: {
            myassets: $scope.myassets,
            etapa: etapa,
            first: asset
          },
          controller: AddRelationCtrl,
          templateUrl: '../../views/add_relation.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function(relation) {
          //console.log(user);
          if (relation) {
            console.log(relation);
            //$scope.assetRelations.push(relation);
            //console.log($scope.myassets);
          }

        });
      };

      $scope.editRelation = function(ev,relation,sourceAssetId,indice) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log($scope.sourceAssetId);
        $mdDialog.show({
          locals: {
            relation: relation,
            assetRelations: $scope.assetRelations,
            indice: indice,
            deleteRelation: $scope.deleteRelation,
            sourceAssetId: sourceAssetId

          },
          controller: EditRelationCtrl,
          templateUrl: '../../views/edit_relation.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function() {

        });
      };

      $scope.deleteRelation = function(ev, relation, indice, sourceAssetId) {
        //console.log(sourceAssetId);
        var confirm = $mdDialog.confirm()
            .title('¿Está seguro que desea borrar esta relacion?')
            .ariaLabel('Borrado de relacion')
            .targetEvent(ev)
            .ok('Aceptar')
            .cancel('Cancelar');
        $mdDialog.show(confirm)
          .then(function() {
            dataFactory.deleteRelation(relation, sourceAssetId, $mdDialog,$mdToast);
            $scope.assetRelations.splice(indice,1);
          }, function() {
            //$scope.status = 'No se realizaron cambios';
          });
      };



    //-----------Controllers-----------//

      function AddRelationCtrl(myassets,etapa,first,$scope, $mdDialog, $mdToast){
        $scope.assets = myassets;
        $scope.etapa = etapa;
        $scope.relation = {};
        $scope.buscado = '';
        $scope.type_name = {};
        $scope.listas = [];
        $scope.names_list = [];
        $scope.sel_asset = null;
        $scope.clicked_index = null;
        $scope.relation.isCritical = false;
        $scope.added = [];
        $scope.first = first;
        $scope.relationTypeSelected = {};

        if (first) {
          $scope.added.push(first);
        }

        dataFactory.getRelationTypes( function (response) {
          $scope.relationTypes = response;
        });

        $scope.selectRelationType = function () {
          for (i=0;i<$scope.relationTypes.length;i++) {
            if ($scope.relationTypes[i]._id == $scope.relation.relationTypeId) {
              $scope.relationTypeSelected = $scope.relationTypes[i];
            }
          }
        }

        $scope.clickedIcon= function(indice) {
          return($scope.clicked_index == indice);
        };

        $scope.addSelected = function (sel_asset) {
          $scope.added.push(sel_asset);
          $scope.sel_asset = null;
          $scope.clicked_index = null;
          //delete $scope.assets[sel_asset.name];
          $scope.nextSelect();
          //console.log($scope.added);
        }

        $scope.removeSelected = function () {
          $scope.added.pop();
          $scope.sel_asset = null;
          $scope.clicked_index = null;
          //$scope.sel_asset.added = false;
          $scope.prevSelect();
          console.log($scope.added);
        }

        $scope.nextSelect = function () {
          ++$scope.etapa;
          if ($scope.etapa == 5) {
            $scope.rel_atributtes = Object.keys($scope.relation);
          }
        }

        $scope.prevSelect = function () {
          --$scope.etapa;
        }

        $scope.create = function (relation) {
          //relation.assets = $scope.added;
          relation.relatedAssetId = $scope.added[1]._id

          dataFactory.createRelation(function (response){

            $mdDialog.hide(relation);

          }, relation, $scope.added, $mdDialog, $mdToast);

        }

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.goToAsset = function(asset, $event, indice) {
          $scope.sel_asset = asset;
          $scope.clicked_index = indice;
          //$scope.sel_asset.added = false;
          $scope.listas = [];

          $scope.keys = Object.keys(asset);

          $scope.keys.splice($scope.keys.indexOf("name"),1);
          $scope.keys.splice($scope.keys.indexOf("comment"),1);
          $scope.keys.splice($scope.keys.indexOf("$$hashKey"),1);
          $scope.keys.splice($scope.keys.indexOf("attached"),1);
          $scope.keys.splice($scope.keys.indexOf("tags"),1);
          $scope.keys.splice($scope.keys.indexOf("estadoActual"),1);
          $scope.keys.splice($scope.keys.indexOf("stakeholders"),1);


          if ($scope.keys.indexOf("__v")>=0) {

            $scope.b =$scope.keys.indexOf("__v");
            $scope.keys.splice($scope.b,1);

          }

          if ($scope.keys.indexOf("deleted")>=0) {

            $scope.a =$scope.keys.indexOf("deleted");
            $scope.keys.splice($scope.a,1);
          }


          dataFactory.getAnAssetType($scope.sel_asset.typeId, function (response) {
            $scope.type_name = response.name;
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
                    elements: $scope.sel_asset[$scope.keys[j]]
                  });
                  $scope.keys.splice(j,1);

                }
              }
            }

          });

          dataFactory.getActualStateGraph( $scope.sel_asset._id, function (response) {
            $scope.lifeCycleGraph = response;
            //console.log($scope.lifeCycleGraph);
          });

          //console.log($scope.sel_asset);
        };

      };

      function EditRelationCtrl(relation, assetRelations,sourceAssetId, indice, deleteRelation, sourceAssetId, $scope, $mdDialog, $mdToast) {

        $scope.update_relation = $.extend({},relation);
        $scope.assetRelations = assetRelations;
        $scope.deleteRelation = deleteRelation;
        $scope.indice = indice;
        $scope.sourceAssetId = sourceAssetId;
        $scope.relationTypeSelected = {};


        dataFactory.getARelationType($scope.update_relation.relationTypeId, function (response) {
          $scope.relationTypeSelected = response;
        });

        dataFactory.getRelationTypes( function (response) {
          $scope.relationTypes = response;
        });

        $scope.selectRelationType = function () {
          for (i=0;i<$scope.relationTypes.length;i++) {
            if ($scope.relationTypes[i]._id == $scope.update_relation.relationTypeId) {
              $scope.relationTypeSelected = $scope.relationTypes[i];
            }
          }
        }

        dataFactory.getAnAsset($scope.sourceAssetId, function (response) {

          $scope.sourceAsset = response;

        });

        dataFactory.getAnAsset($scope.update_relation.relatedAssetId, function (response) {

          $scope.relatedAsset = response;

        });

        $scope.callDelete = function(indice) {
          ev = {};
          deleteRelation(ev,relation,indice,$scope.sourceAssetId);
        }

        $scope.updateRelation = function (relation) {

          dataFactory.editRelation (function (){
              $mdDialog.hide(relation);
              $scope.assetRelations.splice(indice,1,relation);

            }, relation, $scope.sourceAssetId, $mdDialog, $mdToast);

        };

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

      };

      function ShowRelationCtrl(relation, sourceAssetId, indice, editRelation, $scope, $mdDialog, $mdToast){

        $scope.relation = relation;
        $scope.sourceAssetId = sourceAssetId;
        $scope.indice = indice;
        $scope.editRelation = editRelation;
        $scope.ev = {};

        if ($scope.relation.isCritical) {
          $scope.critico = "Sí";
        } else {
          $scope.critico = "No";
        }

        dataFactory.getAnAsset($scope.sourceAssetId, function (response) {

          $scope.sourceAsset = response;

        });

        dataFactory.getAnAsset($scope.relation.relatedAssetId, function (response) {

          $scope.relatedAsset = response;

        });

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

      };

      function ShowAssetCtrl(asset, myassets, resultadoBusqueda, indice, indexBusqueda, editAsset, goRelation, $scope, $mdDialog, $mdToast){
        $scope.asset = asset;
        $scope.myassets = myassets;
        $scope.resultadoBusqueda = resultadoBusqueda;
        $scope.assetVersions = [];
        $scope.indice = indice;
        $scope.indexBusqueda = indexBusqueda;
        $scope.editAsset = editAsset;
        $scope.goRelation = goRelation;
        $scope.direccionRelaciones = false;
        $scope.sel_version = {};
        $scope.relationsTree = {};
        $scope.criticosOut = [];
        $scope.relationsOut = [];
        $scope.criticosIn = [];
        $scope.relationsIn = [];
        $scope.ev = {};
        $scope.esFinal = false;
        $scope.estadoVersionFinal = false;
        $scope.asset_type = {};
        $scope.names_list = [];
        $scope.listas = [];
        $scope.versionListas = [];
        $scope.showVersion = false;
        $scope.keys = Object.keys(asset);

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

        //console.log($scope.keys);


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

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        dataFactory.getAssetVersions($scope.asset._id, function (response) {
          $scope.assetVersions = response;

        });


        dataFactory.getRelationMap($scope.asset._id, function (response) {
          $scope.relationsTree = response;
        });

        $scope.callGoAsset = function (event, relatedAsset) {
          for (i=0;i<$scope.myassets.length;i++) {
            if ($scope.myassets[i]._id == relatedAsset._id) {

              var data = { evento:event, activo:$scope.myassets[i], indice: i }
              $mdDialog.hide(data);
            }
          }
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

      };

      function SelectTypeCtrl(assettypes, showformly, $scope, $mdDialog, $mdToast) {
        $scope.assettypes = assettypes;
        $scope.showFormly = showformly;
        $scope.sel_atributos = [];
        $scope.listas = [];
        $scope.clicked_index = null;

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

        $scope.clickedIcon= function(indice) {
          return($scope.clicked_index == indice);
        };

        $scope.goToType = function(type, $event, indice) {
          $scope.sel_type = type;
          $scope.clicked_index = indice;
          //console.log($scope.sel_type._id);
          dataFactory.getLifeCycleGraph( $scope.sel_type._id, function (response) {
            $scope.lifeCycleGraph = response;
            //console.log($scope.lifeCycleGraph);
          });

        };

        $scope.doFormly = function(sel_type) {
          $scope.hide();

          //$scope.asset = {};
          function validateInt(value) {

            return /^\-?(0|[1-9]\d*)$/.test(value);
          }

          fields = [
                {
                  key: 'name',
                  type: 'input',
                  templateOptions: {
                    label: 'Nombre',
                    placeholder: sel_type.name,
                    required: true
                  }
                },
                {
                  key: 'typeId',
                  type: 'input',
                  hide: true,
                  templateOptions: {
                    label: 'Tipo',
                    placeholder: sel_type._id
                  }
                },
                {
                  key: 'attached',
                  type: 'input',
                  hide: true,
                  templateOptions: {
                    type:'url',
                    label: 'Url de información adjunta',
                    placeholder: 'http://'
                  }
                },
                {
                  key: 'comment',
                  type: 'textarea',
                  templateOptions: {
                    label: 'Descripcion',
                    placeholder: ''
                  }
                }
                //Aca se cierra el array de objetos para formly
          ];

          //funciion para agregar dinamicamente los atributos al array fields
          atributos = sel_type.properties;

          for (var i=0; i<sel_type.properties.length;i++) {
            //console.log(atributos[i].name);
            switch(atributos[i].type) {
              case 'Date':
                //console.log("case date");
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'date',
                      label: '' + atributos[i].name,
                      required: true
                    //datepickerPopup: 'dd-MMMM-yyyy'
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'date',
                      label: atributos[i].name
                    //datepickerPopup: 'dd-MMMM-yyyy'
                    }
                  };
                }

                break;
              case 'Boolean':
                //console.log("case boolean");
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'select',
                    templateOptions: {
                      label: '' + atributos[i].name,
                      options: ["True","False"],
                      required: true
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'select',
                    templateOptions: {
                      label: atributos[i].name,
                      options: ["True","False"]

                    }
                  };
                }

                break;
              case 'Integer':
                //console.log("case boolean");
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: '' + atributos[i].name,
                      placeholder: '',
                      required: true
                    },
                    validators: {
                      int: function($viewValue, $modelValue, scope) {
                        var value = $modelValue || $viewValue;
                        if (value) {
                          return validateInt(value);
                        } else {
                          return true;
                        }
                      }
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: atributos[i].name,
                      placeholder: ''

                    },
                    validators: {
                      int: function($viewValue, $modelValue, scope) {
                        var value = $modelValue || $viewValue;
                        if (value) {
                          return validateInt(value);
                        } else {
                          return true;
                        }
                      }
                    }
                  };
                }

                break;
              case 'Float':
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: '' + atributos[i].name,
                      placeholder: '',
                      required: true
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: atributos[i].name,
                      placeholder: ''

                    }
                  };
                }

                break;
              case 'List':
                console.log("case List");
                $scope.listas.push({
                  name: atributos[i].name,
                  required: atributos[i].required,
                  elements: [{
                    content: ''
                  } ]
                })

                aux = {
                  key: atributos[i].name,
                  type: 'input',
                  hide: true,
                  templateOptions: {
                    label: atributos[i].name,
                    placeholder: ''
                  }
                };
                break;

              default:
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      label: '' + atributos[i].name,
                      placeholder: '',
                      required: true
                    }
                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      label: atributos[i].name,
                      placeholder: ''
                    }
                  };
                }

                break;
            }
            fields.push(aux);
            //console.log(aux);
          }
          $scope.formly_fields = fields;
          //console.log($scope.formly_fields);
          ev = {};
          //console.log($scope.sel_type._id);
          $scope.showFormly($scope.formly_fields,sel_type._id, $scope.listas);

        };

      };

      function AddAssetCtrl(fields, typeid, listas, $scope, $mdDialog, $mdToast) {

        $scope.formly_fields = fields;
        $scope.asset = {};
        $scope.asset.tags = [];
        $scope.asset.stakeholders = { name: '', email: ''};
        $scope.typeid = typeid;
        $scope.listas = listas;
        $scope.estadoActual = null;
        $scope.type_prop = [];
        $scope.names_list = [];
        $scope.asset.attached = [''];


        $scope.addItem = function(answer,parent_index) {
              //console.log("parent_index:" + parent_index);

              if (answer == 'lista') {
                $scope.listas[parent_index].elements.push({content:''});
                //$scope.ultimo = false;
              } else {
                $scope.asset.attached.push('');
              }

            };

        $scope.removeItem = function(answer,parent_index,index) {
              if (answer == 'lista') {
                if ($scope.listas[parent_index].elements.length>1){

                  $scope.listas[parent_index].elements.splice(index,1);
                }
              } else {
                $scope.asset.attached.splice(index,1);
              }

            };

        dataFactory.getAnAssetType($scope.typeid, function (response) {
          //$scope.type_attributes = response.properties;
          for (i=0;i<response.properties.length;i++) {
            if (response.properties[i].type=="List") {
              $scope.names_list.push(response.properties[i].name);
            }
          }

          $scope.estadoActual = response.lifeCycle[0].name;
        });


        $scope.newAsset = function(asset) {

          //asset.attached = $scope.adjuntos;
          asset.typeId = $scope.typeid;
          asset.estadoActual = $scope.estadoActual;

          for (i=0;i<$scope.listas.length;i++) {

            for (j=0;j<$scope.names_list.length;j++) {

              if(listas[i].name == $scope.names_list[j]) {
                asset[$scope.names_list[j]] = listas[i].elements;
              }
            }
          }


          dataFactory.createAsset(function (response){

            asset._id=response.id;
            $mdDialog.hide(asset);

          }, asset, $mdDialog, $mdToast);
        }

        $scope.hide = function() {
          $mdDialog.hide();
        };

        $scope.cancel = function() {
          $mdDialog.cancel();
        };

      };

      function EditAssetCtrl(asset, myassets, resultadoBusqueda, indice, indexBusqueda, deleteAsset, $scope, $mdDialog, $mdToast) {

        $scope.update_asset = $.extend(true,{},asset);
        $scope.indexEstadoActual = null;
        $scope.estadoFinal = null;
        $scope.estadoInicial = null;
        $scope.myassets = myassets;
        $scope.resultadoBusqueda = resultadoBusqueda;
        $scope.deleteAsset = deleteAsset;
        $scope.etapa = 1;
        $scope.siguienteEstado = null;
        $scope.estadoInexistente = true;
        $scope.indice = indice;
        $scope.indexBusqueda = indexBusqueda;
        $scope.asset_type = {};
        $scope.listas = [];
        $scope.volverInicial = false;
        $scope.actualStateGraph = {};



        $scope.addItem = function(answer,parent_index) {
              //var n = $scope.s.length;
              if (answer == 'lista') {
                $scope.listas[parent_index].elements.push({content:''});
                //$scope.ultimo = false;
              } else {
                $scope.update_asset.attached.push('');
              }
        };

        $scope.removeItem = function(answer,parent_index,index) {

          if (answer == 'lista') {
            if ($scope.listas[parent_index].elements.length>1){
              $scope.listas[parent_index].elements.splice(index,1);
            }
          } else {
            //console.log(index);
            //console.log($scope.update_asset.attached);
            $scope.update_asset.attached.splice(index,1);
          }
              //$scope.adjuntos.splice(index,1);
        };


        dataFactory.getAnAssetType ($scope.update_asset.typeId, function (response) {

          $scope.asset_type = response;

          $scope.fields = [
            {
                    key: 'name',
                    type: 'input',
                    templateOptions: {
                      label: '* Nombre',
                      placeholder: $scope.update_asset.name,
                      required: true
                    }

            },
            {
                    key: 'typeId',
                    type: 'input',
                    hide: true,
                    templateOptions: {
                      label: 'Tipo',
                      placeholder: $scope.asset_type._id
                    }
            },
            {
                    key: 'attached',
                    type: 'textarea',
                    hide: true,
                    templateOptions: {
                      type:'url',
                      label: 'Url de información adjunta',
                      placeholder: 'http://'
                    }

            },
            {
                    key: 'comment',
                    type: 'textarea',
                    templateOptions: {
                      label: 'Descripcion',
                      placeholder: $scope.update_asset.comment
                    }

            }
          ];
          atributos = $scope.asset_type.properties;
          for (var i=0; i<$scope.asset_type.properties.length;i++) {

            switch(atributos[i].type) {
              case 'Date':
                var fecha = new Date($scope.update_asset[atributos[i].name]);
                console.log(fecha);
                $scope.update_asset[atributos[i].name] = fecha;
                //$scope.update_asset[atributos[i].name] = '';
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'date',
                      label: '* ' + atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name],
                      required: true
                      //datepickerPopup: 'dd-MMMM-yyyy'
                    }

                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'date',
                      label: atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name]
                      //datepickerPopup: 'dd-MMMM-yyyy'
                    }

                  };
                }
                break;
              case 'Boolean':
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'select',
                    templateOptions: {
                      label: '* ' + atributos[i].name,
                      options: ["True","False"],
                      placeholder: $scope.update_asset[atributos[i].name],
                      required: true

                    }

                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'select',
                    templateOptions: {
                      label: atributos[i].name,
                      options: ["True","False"],
                      placeholder: $scope.update_asset[atributos[i].name]

                    }

                  };
                }

                break;
              case 'Integer':
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: '* ' + atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name],
                      required: true
                    },
                    validators: {
                      int: function($viewValue, $modelValue, scope) {
                        var value = $modelValue || $viewValue;
                        if (value) {
                          return validateInt(value);
                        }
                      }
                    }

                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name]

                    },
                    validators: {
                      int: function($viewValue, $modelValue, scope) {
                        var value = $modelValue || $viewValue;
                        if (value) {
                          return validateInt(value);
                        }
                      }
                    }

                  };
                }

                break;
              case 'Float':
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: '* ' + atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name],
                      required: true

                    }

                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      type: 'number',
                      label: atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name]

                    }

                  };
                }

                break;
              case 'List':

                $scope.listas.push({
                  name: atributos[i].name,
                  required: atributos[i].required,
                  elements: $scope.update_asset[atributos[i].name]

                })

                aux = {
                  key: atributos[i].name,
                  type: 'input',
                  hide: true,
                  templateOptions: {
                    label: atributos[i].name,
                    placeholder: ''

                }

              };
              break;
              default:
                if (atributos[i].required == true) {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      label: '* ' + atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name],
                      required: true
                    }

                  };
                } else {
                  aux = {
                    key: atributos[i].name,
                    type: 'input',
                    templateOptions: {
                      label: atributos[i].name,
                      placeholder: $scope.update_asset[atributos[i].name]
                    }

                  };
                }

                break;
            }
            $scope.fields.push(aux);

          }


          for (i=0; i<$scope.asset_type.lifeCycle.length;i++) {
            if ($scope.asset_type.lifeCycle[i].name == $scope.update_asset.estadoActual) {
              $scope.indexEstadoActual = i;
              $scope.estadoInexistente = false;
            }
            if ($scope.asset_type.lifeCycle[i].isFinal) {
              $scope.estadoFinal = $scope.asset_type.lifeCycle[i].name;
            }
            if ($scope.asset_type.lifeCycle[i].isInitial) {
              $scope.estadoInicial = $scope.asset_type.lifeCycle[i].name;
            }
          }
        });

        dataFactory.getActualStateGraph( $scope.update_asset._id, function (response) {
          $scope.actualStateGraph = response;

        });

        $scope.nextSelect = function () {
          ++$scope.etapa;
          if ($scope.etapa == 5) {
            $scope.rel_atributtes = Object.keys($scope.relation);
          }
        }

        $scope.prevSelect = function () {
          --$scope.etapa;
        }

        function validateInt(value) {

          return /^\-?(0|[1-9]\d*)$/.test(value);
        }

        $scope.confirmFinalAsset = function(ev, asset) {
          var confirm = $mdDialog.confirm()
              .title('¿Está seguro que desea avanzar al estado final de este activo? Esta acción es irreversible')
              .ariaLabel('Actualizar estado de activo')
              .targetEvent(ev)
              .ok('Aceptar')
              .cancel('Cancelar');
          $mdDialog.show(confirm)
            .then(function() {
              //console.log(asset);
              $scope.updateAsset(asset);

            }, function() {
              $scope.status = 'No se realizaron cambios';
            });
        };

        $scope.callDelete = function(indice) {
          ev = {};
          deleteAsset(ev,asset,indice,$scope.indexBusqueda);
        }

        $scope.updateAsset = function (asset) {

          if ($scope.siguienteEstado) {
            if ($scope.asset_type.lifeCycle[$scope.indexEstadoActual].isFinal)
            {
              asset.estadoActual = $scope.asset_type.lifeCycle[$scope.indexEstadoActual].name;
            } else {
                asset.estadoActual = $scope.siguienteEstado;
            }
          }

          if ($scope.volverInicial) {
            asset.estadoActual = $scope.estadoInicial;
          }

          dataFactory.editAsset (function (){
              $mdDialog.hide(asset);
              $scope.myassets.splice(indice,1,asset);
              //console.log($scope.indexBusqueda);
              //if ($scope.indexBusqueda) {
                $scope.resultadoBusqueda.splice($scope.indexBusqueda,1,asset);
              //}

            }, asset, $mdDialog, $mdToast);

        };

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

      };

  })

  .filter('selected', function() {
    return function (assets,selected) {
      //debugger;
      for (i=0;i<assets.length;i++) {
        if (assets[i] == selected[0]) {
          //console.log("if");
          assets.splice(i,1);
          break;
        }
      } return assets;
    }
  } );
