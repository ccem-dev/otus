(function () {
  'use strict';

  angular
    .module('otusjs.otus.uxComponent')
    .component('otusFlagReportVisualization', {
      controller: Controller,
      templateUrl: 'app/ux-component/flag-report/visualization/otus-flag-report-visualization-template.html',
      bindings: {
        activitiesData: "=",
        onUpdate: "="
      }
    });

  Controller.$inject = ["$element"];

  function Controller($element) {

    var overviewColors = ["red", "white", "yellow", "green"];
    var zoomColors = ["#ef5545", "white", "#fcff82", "#91ef45"];

    var activitiesData = [];
    var aggroupedData = [];
    var currentAggroupedDataPagination = null;
    var drag = false;
    var initialY;
    var rect = {};
    var zoomRect = {};

    var tooltip;
    var self = this;

    var selectedAcronym = null;

    /* Lifecycle hooks */
    self.$onInit = onInit;

    function onInit() {
      constructor();
      self.onUpdate = constructor;
    }

    function constructor(activities = null, acronym = null, status = null) {
      activitiesData = activities ? activities : self.activitiesData;
      tooltip = d3.select("body")
        .append("md-tooltip")
        .style("position", "absolute")
        .style("background", "rgba(113, 113, 113, 1)")
        .style("padding", "4px")
        .style("border-radius", "3px")
        .style("white-space", "pre-wrap")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

      activitiesData = sortParticipantsByCompletion(activitiesData);

      if (acronym)
        selectedAcronym = acronym;
      else
        selectedAcronym = null;

      if (status) {
        filterFlagReportByStatus(activitiesData, status);
      }
      else {
        createOverviewFlagReport(activitiesData, overviewColors, zoomColors);
      }

    }


    function getQuestionnaireFromXCoordinate(canvas, evt, x) {
      var mousePos = getMousePos(canvas, evt);
      var inverseModeScale = d3.scaleQuantize()
        .domain(x.range())
        .range(x.domain());

      return inverseModeScale(mousePos.x);

    }

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    function getParticipantFromYCoordinate(canvas, evt, y) {
      var mousePos = getMousePos(canvas, evt);
      var inverseModeScale = d3.scaleQuantize()
        .domain(y.range())
        .range(y.domain());

      return inverseModeScale(mousePos.y);
    }

    function sortParticipantsByCompletion(data) {

      var currentParticipant = "";
      var currentSummedValue = null;
      var currentParticipantData = []
      var dataToBeOrganized = [];

      for (var i = 0; i < data.length; i++) {
        currentSummedValue = 0;
        for (var j = 0; j < data[i].activities.length; j++) {
          currentSummedValue += data[i].activities[j].status;
        }
        dataToBeOrganized.push({ data: data[i], value: currentSummedValue });
      }

      dataToBeOrganized.sort(function (a, b) {
        return b.value - a.value;
      })


      var organizedData = [];
      for (var i = 0; i < dataToBeOrganized.length; i++) {
        organizedData.push(dataToBeOrganized[i].data);
      }
      return organizedData;

    }

    function createOverviewFlagReport(data, colors, zoomedColors) {

      var margin = { top: 30, right: 10, bottom: 10, left: 10 };
      var canvas;
      var x;
      var y;

      var height = 900,
        width = height / 4.5;

      // cria canvas onde sera inserido a visao geral da sinaleira
      var canvas_matrix_viz = d3.select("#canvas_id")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      // cria svg onde eh criado a selecao de linhas dda sinaleira
      var svg = d3.select("#svg_id")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      // cria contexto para o canvas
      var context = canvas_matrix_viz.node().getContext('2d');

      // cria escala no eixo x
      // separa a largura disponivel para o widget por cada questionario
      x = d3.scaleBand()
        .domain(data[0].activities.map(function (key, index) {
          return key.acronym;
        }))
        .range([0, width]);

      // cria escala no eixo y
      // separa a largura disponivel para o widget por cada participante
      y = d3.scaleBand()
        .domain(data.map(function (key, index) {
          return key.rn;
        }))
        .range([0, height]);

      // cria escala de cores, correlacionando-a com os numeros que representam cada estado
      var colorMap = d3.scaleLinear()
        .domain([-1, 0, 1, 2])
        .range(colors);

      // criando retangulos para cada questionario de cada participante
      data.forEach(function (d, i) {
        d.activities.forEach(function (f, g) {
          context.beginPath();
          context.rect(x(f.acronym), y(d.rn), x.bandwidth(), y.bandwidth());
          if (!selectedAcronym || f.acronym == selectedAcronym)
            context.fillStyle = colorMap(f.status);
          else {
            var colorString = colorMap(f.status).split(")");
            colorString[1] = ",0.4)";
            context.fillStyle = colorString[0] + colorString[1];
          }
          context.fill();
          context.closePath();
        })


      });


      canvas = canvas_matrix_viz._groups[0][0];
      var canvasWrapper = document.getElementById('overview_id');

      // inicio da selecao dos participantes por drag
      canvasWrapper.addEventListener('mousedown', function (evt) {
        drag = true;

        initialY = getParticipantFromYCoordinate(canvas, evt, y);

        // cria retangulo que indica a selecao no SVG
        svg.selectAll("*").remove();
        rect = svg
          .append("rect")
          .style("fill", "black")
          .attr("x", 0)
          .attr("y", y(initialY))
          .attr("width", width)
          .attr("height", 1)
          .attr("opacity", 0.3);

      }, false);

      // fim da selecao dos participantes por drag
      canvasWrapper.addEventListener('mouseup', function (evt) {
        drag = false;
        var finalY = getParticipantFromYCoordinate(canvas, evt, y);

        // pega posicao no vetor do primeiro e ultimo participante da selecao
        var initialYIndex, finalYIndex;
        var selectedData = JSON.parse(JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
          if (data[i].rn === finalY) {
            if (!finalYIndex)
              finalYIndex = i;
          }
          if (data[i].rn === initialY) {
            if (!initialYIndex)
              initialYIndex = i;
          }
        }
        if (initialYIndex > finalYIndex) {
          var dummy = initialYIndex;
          initialYIndex = finalYIndex;
          finalYIndex = dummy;
        }
        // remove todos os participantes antes e depois da selecao
        selectedData.length = finalYIndex;
        selectedData.splice(0, initialYIndex);

        // gera nova visualizacao de sinaleira apenas com os participantes selecionados
        createZoomedFlagReport(selectedData, zoomedColors);

      }, false);

      // atualizacao do tamanho do retangulo de selecao e tooltip
      canvasWrapper.addEventListener('mousemove', function (evt) {
        var participant = getParticipantFromYCoordinate(canvas, evt, y);

        if (drag) {
          tooltip.style("visibility", "hidden");

          // atualiza tamanho da selecao feita enquanto o drag acontece
          if (y(initialY) && y(participant)) {

            if (y(participant) - y(initialY) > 0)
              rect.attr("height", y(participant) - y(initialY));
            else {
              rect.attr("y", y(participant));
              rect.attr("height", y(initialY) - y(participant));
            }
          }

        }
        else {
          // atualiza tooltip com as informacoes do questionario e participante
          var questionnaire = getQuestionnaireFromXCoordinate(canvas, evt, x);
          if (questionnaire && participant) {
            tooltip.style("visibility", "visible");
            tooltip.text("Participante: " + participant + "\n Questionario: " + questionnaire);
            tooltip.style("top", (evt.pageY - 10) + "px").style("left", (evt.pageX + 10) + "px");
          }

        }

      }, false);

      // retira a visibilidade da tooltip quando o mouse nao esta posicionado no canvas
      canvasWrapper.addEventListener("mouseout", function (evt) {
        return tooltip.style("visibility", "hidden");
      });
    }

    function createZoomedFlagReport(selectedData, colors) {

      if (!selectedData || selectedData <= 0) {
        var svg = d3.select("#svg_zoom_id");
        svg.selectAll("*").remove();
        return;
      }

      var margin = { top: 30, right: 10, bottom: 10, left: 10 };
      var canvas;
      var x;
      var y;

      var height = 900,
        width = height;

      var canvas_matrix_viz = d3.select("#canvas_zoom_id")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var svg = d3.select("#svg_zoom_id")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      var context = canvas_matrix_viz.node().getContext('2d');

      x = d3.scaleBand()
        .domain(selectedData[0].activities.map(function (key, index) {
          return key.acronym;
        }))
        .range([0, width]);

      y = d3.scaleBand()
        .domain(selectedData.map(function (key, index) {
          return key.rn;
        }))
        .range([0, height]);

      var colorMap = d3.scaleLinear()
        .domain([-1, 0, 1, 2])
        .range(colors);

      svg.selectAll("*").remove();
      zoomRect = svg
        .append("rect")
        .style("fill", "black")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x.range()[1])
        .attr("height", y.bandwidth())
        .style("opacity", 0.2);

      selectedData.forEach(function (d, i) {
        d.activities.forEach(function (f, g) {
          context.beginPath();
          context.rect(x(f.acronym), y(d.rn), x.bandwidth(), y.bandwidth());
          if (!selectedAcronym || f.acronym == selectedAcronym)
            context.fillStyle = colorMap(f.status);
          else {
            var colorString = colorMap(f.status).split(")");
            colorString[1] = ",0.4)";
            context.fillStyle = colorString[0] + colorString[1];
          }
          context.fill();
          context.closePath();
        })

      });

      canvas = canvas_matrix_viz._groups[0][0];

      document.getElementById('zoom_id').addEventListener('mousemove', function (evt) {
        var participant = getParticipantFromYCoordinate(canvas, evt, y);
        var questionnaire = getQuestionnaireFromXCoordinate(canvas, evt, x);

        if (questionnaire && participant) {
          zoomRect.attr("y", y(participant));

          tooltip.style("visibility", "visible");
          tooltip.text("Participante: " + participant + "\n Questionario: " + questionnaire);
          tooltip.style("top", (evt.pageY - 10) + "px").style("left", (evt.pageX + 10) + "px");
        }
      }, false);

      document.getElementById('zoom_id').addEventListener("mouseout", function (evt) {
        return tooltip.style("visibility", "hidden");
      });
    }

    function filterFlagReportByStatus(data, status) {

      var oColors = ["white", "white", "white", "white"];
      var zColors = ["white", "white", "white", "white"];

      switch (status) {
        case -1:
          oColors[0] = overviewColors[0];
          zColors[0] = zoomColors[0];
          break;

        case 0:
          oColors[1] = "grey";
          zColors[1] = "grey";
          break;

        case 1:
          oColors[2] = "#c9d147";
          zColors[2] = "#dde559";
          break;

        case 2:
          oColors[3] = overviewColors[3];
          zColors[3] = zoomColors[3];
          break;

      }

      createOverviewFlagReport(data, oColors, zColors);
    }

  }
})()