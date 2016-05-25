
angular.module('activosInformaticosApp')
  .controller('AppController', function ($scope, $mdDialog, $location, $mdMedia, $mdToast, dataFactory) {


    $scope.toggleSidenav = function(menuId) {
    	//$mdSidenav(menuId).toggle();
    };

    $scope.clicked_asset = {};
    $scope.clicked_relation = {};
    $scope.clicked_index = {};
    $scope.clicked = false;
    $scope.busquedaAvanzada = false;
    $scope.opcionBusqueda = null;
    $scope.busquedaTag = [];
    $scope.direccionRelaciones = false;


    var animationMenuExit = function(trigger, element){
        element = $(element);
            element.addClass('animated ' + 'bounceOutLeft');
            window.setTimeout( function(){

                    element.removeClass('animated ' + 'bounceOutLeft');
                    $scope.clicked = false;
                    $scope.$apply();
            }, 1100);

    }

    $scope.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

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
      $scope.select_asset = {};
      $scope.select_asset._id = id;
      $scope.select_asset.name = nombreActivo;
      $scope.clicked_RelationIndex = null;

      if (!$scope.direccionRelaciones) {
        dataFactory.getAssetRelations(id, function (response) {
            //console.log(response);
            $scope.assetRelations = response;
            $scope.labels = [];
            //console.log($scope.assetRelations.length);
            for (i=0;i<$scope.assetRelations.length;i++) {
              //console.log($scope.assetRelations[i].relationTypeId);
              dataFactory.getARelationType($scope.assetRelations[i].relationTypeId, function (response) {
                //console.log(response);
                $scope.labels.push(response);
                //console.log($scope.labels);

              });
            }
        });
      } else {
        dataFactory.getIncomingAssetRelations(id, function (response) {

            $scope.assetRelations = response;
            $scope.labels = [];

            for (i=0;i<$scope.assetRelations.length;i++) {

              dataFactory.getARelationType($scope.assetRelations[i].relationTypeId, function (response) {

                $scope.labels.push(response);
                //console.log($scope.labels);


              });

            }

        });
      }
    }

    $scope.clickAsset = function(asset,indice) {
      $scope.clicked_asset = asset;
      $scope.clicked_index = indice;
      $scope.clicked = true;
      //console.log($scope.clicked);
    };

    $scope.clickRelation = function(relation,indice) {
      $scope.clicked_relation = relation;
      $scope.clicked_RelationIndex = indice;
      $scope.clickedR = true;
      //console.log($scope.clicked);
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
      // if ($scope.clickedR) {
      //   $scope.clicked_RelationIndex = null;
      //   //animationMenuExit(null,$(".cerrar-menu-activo"),'bounceOutLeft');
      // }
    };

    $scope.clickRelacionClose = function() {
      if ($scope.clickedR) {
        $scope.clicked_RelationIndex = null;
        //animationMenuExit(null,$(".cerrar-menu-activo"),'bounceOutLeft');
      }
    }

    $scope.relationGraph = function() {
      var Network, RadialPlacement, activate, root;

      root = typeof exports !== "undefined" && exports !== null ? exports : this;

      Network = function () {
        var allData, charge, curLinksData, curNodesData, filter, filterLinks, filterNodes, force, forceTick, groupCenters, height, hideDetails, layout, link, linkedByIndex, linksG, mapNodes, moveToRadialLayout, neighboring, network, node, nodeColors, nodeCounts, nodesG, radialTick, setFilter, setLayout, setSort, setupData, showDetails, sort, sortedArtists, strokeFor, tooltip, update, updateCenters, updateLinks, updateNodes, width;
        width = 960;
        height = 800;
        allData = [];
        curLinksData = [];
        curNodesData = [];
        linkedByIndex = {};
        nodesG = null;
        linksG = null;
        node = null;
        link = null;
        layout = "force";
        filter = "all";
        sort = "songs";
        groupCenters = null;
        force = d3.layout.force();
        nodeColors = d3.scale.category20();
        tooltip = Tooltip("vis-tooltip", 230);

        //funcionamiento básico
        network = function(selection, data) {
          var vis;
          allData = setupData(data);
          vis = d3.select(selection).append("svg").attr("width", width).attr("height", height);
          linksG = vis.append("g").attr("id", "links");
          nodesG = vis.append("g").attr("id", "nodes");
          force.size([width, height]);
          setLayout("force");
          setFilter("all");
          return update();
        };
        network.toggleLayout = function(newLayout) {
          force.stop();
          setLayout(newLayout);
          return update();
        };
        network.toggleFilter = function(newFilter) {
          force.stop();
          setFilter(newFilter);
          return update();
        };
        network.toggleSort = function(newSort) {
          force.stop();
          setSort(newSort);
          return update();
        };
        network.updateSearch = function(searchTerm) {
          var searchRegEx;
          searchRegEx = new RegExp(searchTerm.toLowerCase());
          return node.each(function(d) {
            var element, match;
            element = d3.select(this);
            match = d.name.toLowerCase().search(searchRegEx);
            if (searchTerm.length > 0 && match >= 0) {
              element.style("fill", "#F38630").style("stroke-width", 2.0).style("stroke", "#555");
              return d.searched = true;
            } else {
              d.searched = false;
              return element.style("fill", function(d) {
                return nodeColors(d.artist);
              }).style("stroke-width", 1.0);
            }
          });
        };
        network.updateData = function(newData) {
          allData = setupData(newData);
          link.remove();
          node.remove();
          return update();
        };
        charge = function(node) {
          return -Math.pow(node.radius, 2.0) / 2;
        };
        update = function() {
          var artists;
          //filter data to show based on current filter settings.
          curNodesData = filterNodes(allData.nodes);
          curLinksData = filterLinks(allData.links, curNodesData);

          if (layout === "radial") {
            artists = sortedArtists(curNodesData, curLinksData);
            updateCenters(artists);
          }
          force.nodes(curNodesData);
          updateNodes();
          if (layout === "force") {
            force.links(curLinksData);
            updateLinks();
          } else {
            force.links([]);
            if (link) {
              link.data([]).exit().remove();
              link = null;
            }
          }
          return force.start();
        };
        updateNodes = function() {
          node = nodesG.selectAll("circle.node").data(curNodesData, function(d) {
            return d.id;
          });
          node.enter().append("circle").attr("class", "node").attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          }).attr("r", function(d) {
            return d.radius;
          }).style("fill", function(d) {
            return nodeColors(d.artist);
          }).style("stroke", function(d) {
            return strokeFor(d);
          }).style("stroke-width", 1.0);
          node.on("mouseover", showDetails).on("mouseout", hideDetails);
          return node.exit().remove();
        };
        setLayout = function(newLayout) {
          layout = newLayout;
          if (layout === "force") {
            return force.on("tick", forceTick).charge(-200).linkDistance(50);
          } else if (layout === "radial") {
            return force.on("tick", radialTick).charge(charge);
          }
        };
        forceTick = function(e) {
          node.attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
          return link.attr("x1", function(d) {
            return d.source.x;
          }).attr("y1", function(d) {
            return d.source.y;
          }).attr("x2", function(d) {
            return d.target.x;
          }).attr("y2", function(d) {
            return d.target.y;
          });
        };
        setupData = function(data) {
          var circleRadius, countExtent, nodesMap;
          countExtent = d3.extent(data.nodes, function(d) {
            return d.playcount;
          });
          circleRadius = d3.scale.sqrt().range([3, 12]).domain(countExtent);
          data.nodes.forEach(function(n) {
            var randomnumber;
            n.x = randomnumber = Math.floor(Math.random() * width);
            n.y = randomnumber = Math.floor(Math.random() * height);
            return n.radius = circleRadius(n.playcount);
          });
          nodesMap = mapNodes(data.nodes);
          data.links.forEach(function(l) {
            l.source = nodesMap.get(l.source);
            l.target = nodesMap.get(l.target);
            return linkedByIndex[l.source.id + "," + l.target.id] = 1;
          });
          return data;
        };

        //diferente agrupamiento de nodos
        updateCenters = function(artists) {
          if (layout === "radial") {
            return groupCenters = RadialPlacement().center({
              "x": width / 2,
              "y": height / 2 - 100
            }).radius(300).increment(18).keys(artists);
          }
        };
        radialTick = function(e) {
          node.each(moveToRadialLayout(e.alpha));
          node.attr("cx", function(d) {
            return d.x;
          }).attr("cy", function(d) {
            return d.y;
          });
          if (e.alpha < 0.03) {
            force.stop();
            return updateLinks();
          }
        };
        moveToRadialLayout = function(alpha) {
          var k;
          k = alpha * 0.1;
          return function(d) {
            var centerNode;
            centerNode = groupCenters(d.artist);
            d.x += (centerNode.x - d.x) * k;
            return d.y += (centerNode.y - d.y) * k;
          };
        };
        filterNodes = function(allNodes) {
          var cutoff, filteredNodes, playcounts;
          filteredNodes = allNodes;
          if (filter === "popular" || filter === "obscure") {
            playcounts = allNodes.map(function(d) {
              return d.playcount;
            }).sort(d3.ascending);
            cutoff = d3.quantile(playcounts, 0.5);
            filteredNodes = allNodes.filter(function(n) {
              if (filter === "popular") {
                return n.playcount > cutoff;
              } else if (filter === "obscure") {
                return n.playcount <= cutoff;
              }
            });
          }
          return filteredNodes;
        };
      }

      RadialPlacement = function() {
        var center, current, increment, place, placement, radialLocation, radius, setKeys, start, values;
        values = d3.map();
        increment = 20;
        radius = 200;
        center = {
          "x": 0,
          "y": 0
        };
        start = -120;
        current = start;
        radialLocation = function(center, angle, radius) {
          var x, y;
          x = center.x + radius * Math.cos(angle * Math.PI / 180);
          y = center.y + radius * Math.sin(angle * Math.PI / 180);
          return {
            "x": x,
            "y": y
          };
        };
        placement = function(key) {
          var value;
          value = values.get(key);
          if (!values.has(key)) {
            value = place(key);
          }
          return value;
        };
        place = function(key) {
          var value;
          value = radialLocation(center, current, radius);
          values.set(key, value);
          current += increment;
          return value;
        };
        setKeys = function(keys) {
          var firstCircleCount, firstCircleKeys, secondCircleKeys;
          values = d3.map();
          firstCircleCount = 360 / increment;
          if (keys.length < firstCircleCount) {
            increment = 360 / keys.length;
          }
          firstCircleKeys = keys.slice(0, firstCircleCount);
          firstCircleKeys.forEach(function(k) {
            return place(k);
          });
          secondCircleKeys = keys.slice(firstCircleCount);
          radius = radius + radius / 1.8;
          increment = 360 / secondCircleKeys.length;
          return secondCircleKeys.forEach(function(k) {
            return place(k);
          });
        };
        placement.keys = function(_) {
          if (!arguments.length) {
            return d3.keys(values);
          }
          setKeys(_);
          return placement;
        };
        placement.center = function(_) {
          if (!arguments.length) {
            return center;
          }
          center = _;
          return placement;
        };
        placement.radius = function(_) {
          if (!arguments.length) {
            return radius;
          }
          radius = _;
          return placement;
        };
        placement.start = function(_) {
          if (!arguments.length) {
            return start;
          }
          start = _;
          current = start;
          return placement;
        };
        placement.increment = function(_) {
          if (!arguments.length) {
            return increment;
          }
          increment = _;
          return placement;
        };
        return placement;
      };

      activate = function(group, link) {
        d3.selectAll("#" + group + " a").classed("active", false);
        return d3.select("#" + group + " #" + link).classed("active", true);
      };

      $(function() {
        var myNetwork;
        myNetwork = Network();
        d3.selectAll("#layouts a").on("click", function(d) {
          var newLayout;
          newLayout = d3.select(this).attr("id");
          activate("layouts", newLayout);
          return myNetwork.toggleLayout(newLayout);
        });
        d3.selectAll("#filters a").on("click", function(d) {
          var newFilter;
          newFilter = d3.select(this).attr("id");
          activate("filters", newFilter);
          return myNetwork.toggleFilter(newFilter);
        });
        d3.selectAll("#sorts a").on("click", function(d) {
          var newSort;
          newSort = d3.select(this).attr("id");
          activate("sorts", newSort);
          return myNetwork.toggleSort(newSort);
        });
        $("#song_select").on("change", function(e) {
          var songFile;
          songFile = $(this).val();
          return d3.json("data/" + songFile, function(json) {
            return myNetwork.updateData(json);
          });
        });
        $("#search").keyup(function() {
          var searchTerm;
          searchTerm = $(this).val();
          return myNetwork.updateSearch(searchTerm);
        });
        return d3.json("data/call_me_al.json", function(json) {
          return myNetwork("#vis", json);
        });
      });
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

      $scope.goAsset = function(ev,asset,$index) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log(asset);
        $mdDialog.show({
          locals: {
            asset: asset,
            myassets: $scope.myassets,
            indice: $index,
            editAsset: $scope.editAsset

          },
          controller: ShowAssetCtrl,
          templateUrl: '../../views/show_asset.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: useFullScreen
        })
        .then(function() {


        });
      };

      $scope.editAsset = function(ev,asset,$index) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log(asset);
        $mdDialog.show({
          locals: {
            asset: asset,
            myassets: $scope.myassets,
            indice: $index,
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

      $scope.deleteAsset = function(ev, asset, indice) {
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
          }, function() {
            $scope.status = 'No se realizaron cambios';
          });
      };

    //-----------Relations-----------//

      $scope.goRelation = function(ev,relation,assetId,$index) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log(asset);
        $mdDialog.show({
          locals: {
            relation: relation,
            sourceAssetId: assetId,
            indice: $index,
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

      $scope.editRelation = function(ev,relation,$index) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        //console.log(asset);
        $mdDialog.show({
          locals: {
            relation: relation,
            assetRelations: $scope.assetRelations,
            indice: $index,
            deleteRelation: $scope.deleteRelation,
            sourceAssetId: $scope.sourceAssetId

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


          //console.log($scope.sel_asset);
        };

      };

      function EditRelationCtrl(relation, assetRelations, indice, deleteRelation, sourceAssetId, $scope, $mdDialog, $mdToast) {

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
          //console.log($scope.relationTypes);
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
          //asset.attached = $scope.adjuntos;
          //console.log($scope.sourceAssetId);
          dataFactory.editRelation (function (){
              $mdDialog.hide(relation);
              $scope.assetRelations.splice(indice,1,relation);
              //location.reload();
            }, relation, $scope.sourceAssetId, $mdDialog, $mdToast);

        };

        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };


        //keys = Object.keys(update_asset);

      };

      function ShowRelationCtrl(relation, sourceAssetId, indice, editRelation, $scope, $mdDialog, $mdToast){
        //console.log(relation);
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

      function ShowAssetCtrl(asset, myassets, indice, editAsset, $scope, $mdDialog, $mdToast){
        $scope.asset = asset;
        $scope.assets = myassets;
        $scope.indice = indice;
        $scope.editAsset = editAsset;
        $scope.ev = {};
        $scope.asset_type = {};
        $scope.names_list = [];
        $scope.listas = [];

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

          });


        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };

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
          //------------Funcion para crear grafico de ciclo de vida para el tipo de activo -----------------//
            $scope.graphLifeCycle = $scope.sel_type.lifeCycle;
            $scope.stateGraph = ' ';
            var auxGraph = $scope.graphLifeCycle[0].name.replace(" ","_");


            $scope.confGraph = 'digraph life_cycle { rankdir=LR; size='+'"8,5"'+'  node [shape = doublecircle]; '+auxGraph+' '
            for (i=0;i<$scope.graphLifeCycle.length;i++) {
              if ($scope.graphLifeCycle[i].isFinal) {

                auxGraph = $scope.graphLifeCycle[i].name.replace(" ","_");
                $scope.confGraph += auxGraph+'; node [shape = circle]; ';
              }
              for (j=0;j<$scope.graphLifeCycle[i].adjacents.length;j++) {
                if (!$scope.graphLifeCycle[i].isFinal) {
                  auxGraph = $scope.graphLifeCycle[i].name.replace(" ","_");
                  var auxGraph2 = $scope.graphLifeCycle[i].adjacents[j].replace(" ","_");

                  $scope.stateGraph += auxGraph+' -> '+auxGraph2+'; ';
                }
              }
            }
            $scope.stateGraph += " }";
            $scope.confGraph += $scope.stateGraph;
            console.log($scope.confGraph);


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

      function EditAssetCtrl(asset, myassets, indice, deleteAsset, $scope, $mdDialog, $mdToast) {

        $scope.update_asset = $.extend(true,{},asset);
        $scope.indexEstadoActual = null;
        $scope.estadoFinal = null;
        $scope.estadoInicial = null;
        $scope.myassets = myassets;
        $scope.deleteAsset = deleteAsset;
        $scope.etapa = 1;
        $scope.siguienteEstado = null;
        $scope.estadoInexistente = true;
        $scope.indice = indice;
        $scope.asset_type = {};
        $scope.listas = [];
        $scope.volverInicial = false;
        //$scope.adjuntos = [];
        //$scope.adjuntos = $.extend([],asset.attached);


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
                //var fecha = Date.parse($scope.update_asset[atributos[i].name]);
                //$scope.update_asset[atributos[i].name] = fecha;
                $scope.update_asset[atributos[i].name] = '';
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
          deleteAsset(ev,asset,indice);
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
