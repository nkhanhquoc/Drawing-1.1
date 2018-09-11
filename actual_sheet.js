//var times = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6];
var times = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

var stations = [
    { id: 100, name: 'VINH', y: 0, bold: true, expand: false, newoffset: false, group:3 },             // 0
    { id: 101, name: 'Yên Xuân', y: 0, bold: false, expand: false, newoffset: false, group:3 },        // 1
    { id: 102, name: 'Yên Trung', y: 0, bold: false, expand: false, newoffset: false, group:3 },       // 2
    { id: 103, name: 'Đức Lạc', y: 0, bold: false, expand: false, newoffset: false, group:3 },         // 3
    { id: 104, name: 'Yên Duệ', y: 0, bold: false, expand: false, newoffset: false, group:3 },         // 4
    { id: 105, name: 'Hòa Duyệt', y: 0, bold: false, expand: false, newoffset: false, group:3 },       // 5
    { id: 106, name: 'Thanh Luyện', y: 0, bold: false, expand: false, newoffset: false, group:3 },     // 6
    { id: 107, name: 'Chu Lễ', y: 0, bold: false, expand: false, newoffset: false, group:3 },          // 7
    { id: 108, name: 'Hương Phố', y: 0, bold: false, expand: false, newoffset: false, group:3 },       // 8
    { id: 109, name: 'Phúc Trạch', y: 0, bold: true, expand: false, newoffset: false, group:3 },       // 9
    { id: 110, name: 'La Khê', y: 0, bold: false, expand: false, newoffset: false, group:3 },          // 10
    { id: 111, name: 'Tân Ấp', y: 0, bold: false, expand: false, newoffset: false, group:3 },          // 11
    { id: 112, name: 'Đồng Chuối', y: 0, bold: false, expand: false, newoffset: false, group:3 },      // 12
    { id: 113, name: 'Kim Lũ', y: 0, bold: true, expand: false, newoffset: false, group:2 },           // 13
    { id: 114, name: 'Đồng Lê', y: 0, bold: false, expand: false, newoffset: false, group:2 },         // 14
    { id: 115, name: 'Ngọc Lâm', y: 0, bold: false, expand: false, newoffset: false, group:2 },        // 15
    { id: 116, name: 'Minh Cầm (T)', y: 0, bold: false, expand: false, newoffset: false, group:2 },    // 16
    { id: 117, name: 'Lạc Sơn', y: 0, bold: false, expand: false, newoffset: false, group:2 },         // 17
    { id: 118, name: 'Lệ Sơn', y: 0, bold: false, expand: false, newoffset: false, group:2 },          // 18
    { id: 119, name: 'Lạc Giao (T)', y: 0, bold: false, expand: false, newoffset: false, group:2 },    // 19
    { id: 120, name: 'Minh Lễ', y: 0, bold: false, expand: false, newoffset: false, group:2 },         // 20
    { id: 121, name: 'Ngân Sơn', y: 0, bold: false, expand: false, newoffset: false, group:2 },        // 21
    { id: 122, name: 'Thọ Lộc', y: 0, bold: false, expand: false, newoffset: false, group:2 },         // 22
    { id: 123, name: 'Hoàn Lão', y: 0, bold: false, expand: false, newoffset: false, group:2 },        // 23
    { id: 124, name: 'Phúc Tự', y: 0, bold: false, expand: false, newoffset: false, group:2 },         // 24
    { id: 125, name: 'ĐỒNG HỚI', y: 0, bold: true, expand: false, newoffset: false, group:2 }];        // 25

var viewerWidth = 1200;
var viewerHeight = 600;
var hourSpace = viewerWidth / (times.length - 1);
var minSpace = viewerWidth / ((times.length - 1) * 60);
var tenMinSpace = viewerWidth / ((times.length - 1) * 6);
var stationSpace = viewerHeight / (stations.length - 1);
var horizontalSpace = hourSpace / 6;
var verticalSpace = (stationSpace * 2) / 5;
var currentTranslate = [0, 0];
var currentScale = 1;
var listHoverCircle = [];
var listArrStations = [];
var virtualStops = [];

// TRAIN DATA
statusType = { ARRIVAL: 0, DEPARTED: 1, CREATED: 2, DISSOLVED: 3 };
dayType = { YESTERDAY: -1, TODAY: 0, TOMORROW: 1 };
trainType = { KHACH: 0, HANG: 1, HONHOP: 2 };
trainDirection = { UP: 0, DOWN: 1 };
changeType = { ARRIVAL: 0, DEPARTED: 1, CREATED: 2, PASS_THROUGH: 3 };
timeChangingText = [['Đến: ', 'Đi: ', 'Khởi hành: ', 'Thông qua: '], // Actual
    ['Dự kiến đến: ', 'Dự kiến đi: ', 'Dự kiến khởi hành: ', 'Dự kiến thông qua: ']]; // Planned

confirmLabel = ['Xác nhận đến', 'Xác nhận đi', 'Xác nhận khởi hành', 'Xác nhận thông qua']; // Confirm

trainColor = [["#ffb3b3", "#b3b3ff", "pupple"],["red", "blue", "purple"]];      // Planned
hourColor = [["black", "black", "black"],    // Actual
    ["black", "black", "black"]];      // Planned
trains = [
    {
        id: 100, name: 'H1', type: trainType.HANG, engine:"D12E-937",
        inDirection: trainDirection.DOWN, inStatus: statusType.CREATED, inSpecial: false,
        outDirection: trainDirection.DOWN, outStatus: statusType.DISSOLVED, outSpecial: false,
        currStatus: statusType.CREATED, currStopIndex: -1,
        stops: [
            { stationIndex: 101, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1749, departedTime: 1800, note: "", type: 1 },
            { stationIndex: 102, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1850, departedTime: 1850, note: "", type: 1 },
            { stationIndex: 103, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1856, departedTime: 1856, note: "", type: 1 },
            { stationIndex: 104, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1905, departedTime: 1905, note: "" , type: 1},
            { stationIndex: 105, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1916, departedTime: 1927, note: "", type: 1 },
            { stationIndex: 106, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1945, departedTime: 1945, note: "", type: 1 },
            { stationIndex: 107, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1958, departedTime: 1958, note: "", type: 1 },
            { stationIndex: 108, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2003, departedTime: 2003, note: "", type: 1 },
            { stationIndex: 109, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2015, departedTime: 2025, note: "", type: 1 },
            { stationIndex: 110, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2037, departedTime: 2037, note: "", type: 1 },
            { stationIndex: 111, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2046, departedTime: 2059, note: "", type: 1 },
            { stationIndex: 112, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2116, departedTime: 2232, note: "" , type: 1},
            { stationIndex: 113, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2259, departedTime: 2304, note: "", type: 1 },
            { stationIndex: 114, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2316, departedTime: 2316, note: "", type: 1 },
            { stationIndex: 115, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2332, departedTime: 2332, note: "", type: 1 },
            { stationIndex: 117, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2345, departedTime: 2345, note: "", type: 1 },
            { stationIndex: 118, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2359, departedTime: 2359, note: "", type: 1 },
            { stationIndex: 120, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 16, departedTime: 16, note: "", type: 1 },
            { stationIndex: 121, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 25, departedTime: 25, note: "", type: 1 },
            { stationIndex: 122, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 39, departedTime: 39, note: "", type: 1 },
            { stationIndex: 123, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 49, departedTime: 49, note: "", type: 1 },
            { stationIndex: 124, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 56, departedTime: 104, note: "", type: 1 },
            { stationIndex: 125, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 129, departedTime: 209, note: "", type: 1 }]
    },
    {
        id: 101, name: 'SE4', type: trainType.KHACH,engine:"",
        inDirection: trainDirection.DOWN, inStatus: statusType.ARRIVAL, inSpecial: false,
        outDirection: trainDirection.DOWN, outStatus: statusType.DEPARTED, outSpecial: false,
        currStatus: statusType.DEPARTED, currStopIndex: -1,
        stops: [
            { stationIndex: 100, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 16, departedTime: 16, note: "", type: 1 },
            { stationIndex: 125, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1315, departedTime: 1315, note: "", type: 1 }]
    },
    {
        id: 102, name: 'H4', type: trainType.HANG,engine:"",
        inDirection: trainDirection.UP, inStatus: statusType.ARRIVAL, inSpecial: false,
        outDirection: trainDirection.UP, outStatus: statusType.DEPARTED, outSpecial: false,
        currStatus: statusType.ARRIVAL, currStopIndex: -1,
        stops: [
            { stationIndex: 125, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2207, departedTime: 2207, note: "", type: 1 },
            { stationIndex: 100, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 315, departedTime: 315, note: "", type: 1 }]
    },
    {
        id: 103, name: 'H6', type: trainType.HANG,engine:"",
        inDirection: trainDirection.UP, inStatus: statusType.ARRIVAL, inSpecial: false,
        outDirection: trainDirection.UP, outStatus: statusType.DEPARTED, outSpecial: false,
        currStatus: statusType.ARRIVAL, currStopIndex: -1,
        stops: [
            { stationIndex: 125, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 307, departedTime: 307, note: "", type: 1 },
            { stationIndex: 100, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 715, departedTime: 715, note: "", type: 1 }]
    }
];

// POPUP
var popupWidth = 200;
var popupHeight = 80;
var popupWidthEnd = 200;
var popupHeightEnd = 180;
var popupWidthEndShort = 200;
var popupHeightEndShort = 150;
var dragMinX;
var popupOpen = false;
var editting = false;
var popupRect;
var popup;
var currentCircle = "";
var currentCircleID = "";
var currentTrainIndex = -1;
var currentStopIndex = -1;
var currentStationIndex = -1;
var currentColorType = -1;
var currentChange = -1;
var currentTextObjs = [];
var currentLineObjs = [];
var currentCircleObjs = [];
var currentFirstLine;
var currentAdjustedMinutes = 0;

function zoom() {
    layer0.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer1a.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer2a.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer3.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer4.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 10]).on("zoom", zoom);

// define the baseSvg, attaching a class for styling and the zoomListener
var baseSvg = d3.select("#main-container").append("svg")
    .attr("width", viewerWidth * 2)
    .attr("height", viewerHeight * 2)
    .attr("class", "overlay")
    .call(zoomListener);
console.log(baseSvg);
// Draw sheet boundary
function drawBoundary() {
    var boundary = layer0.append("rect")
        .attr("id", 'boundary')
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "none")
        .attr("stroke-width", 1)
        .attr("stroke", "gray");
}

// Draw lines of time on the sheet
function drawTimeline() {
    for(var k = 0;k < listArrStations.length;k++){
      var sizeList = listArrStations[k].length;

      for (var i = 0; i < times.length-1; i++) {
          // Main line
          layer0.append("line")
              .attr("id", 'timeline' + k + '_' + i)
              .attr("x1", i * hourSpace)
              .attr("y1", listArrStations[k][0].y)
              .attr("x2", i * hourSpace)
              .attr("y2", listArrStations[k][sizeList-1].y)
              .attr("hour",times[i])
              .attr("minutes",0)
              .attr("fill", "none")
              .attr("stroke-width", 1)
              .attr("stroke", "gray");
              // .on("mouseover", gridMouseover)
              // .on("mouseout",gridMouseout);

              for (var j = 1; j < 6; j++) {
                  // Minor line
                layer0.append("line")
                      .attr("x1", i * hourSpace + j * tenMinSpace)
                      .attr("hour",times[i])
                      .attr("minutes",j * 10)
                      .attr("y1", listArrStations[k][0].y)
                      .attr("x2", i * hourSpace + j * tenMinSpace)
                      .attr("y2", listArrStations[k][sizeList-1].y)
                      .attr("fill", "none")
                      .attr("stroke-width", 0.5)
                      .attr("stroke", function () { return j != 3 ? "lightgray" : "lightgreen"; });
                      // .on("mouseover", mouseoverTrainLine);
                      // .on("mouseover", gridMouseover)
                      // .on("mouseout",gridMouseout);
              }
            }
    }
    for (var i = 0; i < times.length; i++) {
        // Display time
        var text = layer0.append("text")
        .attr("id", 'timelinetext' + i)
        .text(times[i])
        .attr("x", i * hourSpace)
        .attr("y", -50)
        .attr("hour",times[i])
        .style("font-size", 20)
        .style("font-family", "Segoe UI")
        .style("text-anchor", "middle");
        // .on("mouseover", gridMouseover)
        // .on("mouseout",gridMouseout);
    }
    // for (var i = 0; i < times.length - 1; i++)
    //     for (var j = 1; j < 6; j++) {
    //         // Minor line
    //         var line = layer0.append("line")
    //             .attr("x1", i * hourSpace + j * tenMinSpace)
    //             .attr("hour",times[i])
    //             .attr("minutes",j * 10)
    //             .attr("y1", 0)
    //             .attr("x2", i * hourSpace + j * tenMinSpace)
    //             .attr("y2", viewerHeight)
    //             .attr("fill", "none")
    //             .attr("stroke-width", 0.5)
    //             .attr("stroke", function () { return j != 3 ? "lightgray" : "lightgreen"; })
    //             // .on("mouseover", mouseoverTrainLine);
    //             .on("mouseover", gridMouseover)
    //             .on("mouseout",gridMouseout);
    //     }
}

// Set Y-position for all stations, it can be change in the future
function setStationsY() {
    for (var i = 0; i < stations.length; i++) {
        stations[i].y = i * stationSpace;
    }
}

// Draw stations: name, line
function drawStations() {
  listArrStations = [];
  var bIndex = -1;
  var lastGroup;
  for (var i = 0; i < stations.length; i++) {
    if(stations[i].group != lastGroup){
      listArrStations[++bIndex] = [];
      lastGroup = stations[i].group;
    }
    listArrStations[bIndex].push(stations[i]);
  }

      for (i = 0; i < stations.length; i++) {
        // Main line
        var line = layer0.append("line")
            .attr("id", 'stationline' + i)
            .attr("x1", 0)
            .attr("y1", stations[i].y)
            .attr("x2", viewerWidth)
            .attr("y2", stations[i].y)
            .attr("fill", "none")
            .attr("stroke-width", stations[i].bold ? 1 : 0.5)
            .attr("stroke", "lightgray");

        // Display station name
        var text = layer0.append("text")
        .attr("id", 'stationtext' + i)
        .text(stations[i].name)
        .attr("x", -50)
        .attr("y", stations[i].y + 6)
        .style("font-size", 20)
        .style("font-family", "Segoe UI")
        .style("font-weight", stations[i].bold ? 500 : 250)
        .style("text-anchor", "end");
    }
}

// Return x position matched with a time value
function getX(timeValue, day) {
    var hour = Math.floor(timeValue / 100);
    var min = timeValue % 100;
    return ((hour + 72 - times[0]) % 24) * hourSpace + day * 24 * hourSpace + min * minSpace;
}

// Append and assign a line to a train at a stop
function appendLine(layer, prefix, trainIndex, stopIndex, x1, y1, x2, y2, colorType) {
    var lineObj = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex);
    if (lineObj[0][0] == null) {
        var line = layer.append("line")
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("x1-backup", x1)
            .attr("x2-backup", x2)
            .attr("fill", "none")
            .attr("stroke-width", 2 - colorType)
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1);

        // Line can be dragged and dropped
        if (prefix == 'trainline_2')
            line
            .on("mouseover", mouseoverTrainLine)
            // .on("mouseout", mouseoutTrainLine)
            .on("click",lineClick)
            .call(dragTrainLineListener);
    }
    else {
        lineObj
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("x1-backup", x1)
            .attr("x2-backup", x2)
            .attr("fill", "none")
            .attr("stroke-width", 2 - colorType)
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1);
    }
}

// Mouse over train line event
function mouseoverTrainLine() {
    var lineID = d3.select(this).attr("id");
    d3.select(this).attr("style", "cursor:pointer");

    var circleID = lineID.replace("line", "circle");
    var circle = d3.select("#" + circleID);

    if ((popupOpen && circleID != currentCircleID) || editting)
        return;

    currentCircleID = circleID;
    currentCircle = circle;

    currentCircle
        .transition().duration(200)
        .attr("style", "cursor:pointer")
        .attr("r", 5);

    defineChangesFromLine(circleID);

    popupOpen = true;

    updatePopupCircleSize(currentCircle);
    updatePopupCircleContent();
}

// Mouse out train line event
function mouseoutTrainLine() {
    var lineID = d3.select(this).attr("id");

    var circleID = lineID.replace("line", "circle");
    var circle = d3.select("#" + circleID);

    circle
        .transition().duration(200)
        .attr("r", 2);
    if (!editting) {
        popup.style("visibility", "hidden");
        popupRect.style("visibility", "hidden");
        popupOpen = false;
    }
}

// Drag train line
var dragTrainLineListener = d3.behavior.drag()
    .on("dragstart", function () {
        var lineID = d3.select(this).attr("id");
        var circleID = lineID.replace("line", "circle");

        // Do not allow dragging with happenned events
        if (currentColorType == 0 || circleID != currentCircleID)
            return;
        console.log("dragstart");
        currentCircle
            .transition().duration(200)
            .attr("r", 2);
        popupOpen = false;
        editting = true;

        updatePopupCircleSize(currentCircle);
        updatePopupCircleContent();

        d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function () {
        var lineID = d3.select(this).attr("id");
        var circleID = lineID.replace("line", "circle");

        // Do not allow dragging with happenned events
        if (currentColorType == 0 || circleID != currentCircleID)
            return;

        updateOnDraggingCircle(d3.event.dx);
        updatePopupCircleContent();
    })
    .on("dragend", function () {
        var lineID = d3.select(this).attr("id");
        var circleID = lineID.replace("line", "circle");
        var circle = d3.select("#" + circleID);

        // Do not allow dragging with happenned events
        if (currentColorType == 0 || circleID != currentCircleID)
            return;
        // If there is something changed
        if (circle.attr("cx") != circle.attr("cx-backup")) {
            updatePopupCircleSizeEnd(currentCircle);
            updatePopupCircleContentEnd();
        }
        else {
            popup.style("visibility", "hidden");
            popupRect.style("visibility", "hidden");
            editting = false;
        }
        console.log("dragend");
    });

// Draw train lines
function drawTrainLines(k) {
  console.log("draw train lines",k);
  var train = trains[k];
  var listStops = train.stops;//.filter(st => st.type == 1);
  console.log("listStops",listStops);
    var colorType = 0;
    if (train.currStopIndex == -1)
        colorType = 1;
    // Draw first stop
    // var currStop = train.stops[0];
    var currStop = listStops[0];
    var currY = stations.filter(st => st.id == currStop.stationIndex)[0].y;
    //console.log(newy);
    //var currY = stations[currStop.stationIndex].y;
    var lineaY = train.inDirection == trainDirection.DOWN ? currY - verticalSpace : currY + verticalSpace;
    var dy = train.inDirection == trainDirection.UP ? 1 : -1;

    switch (train.inStatus) {
        case statusType.ARRIVAL:
            if (!train.inSpecial) {
                appendLine(layer1a, 'trainline_a', k, 0,
                    getX(currStop.arrivalTime, currStop.arrivalDay) - horizontalSpace, lineaY,
                    getX(currStop.arrivalTime, currStop.arrivalDay) - horizontalSpace / 2, lineaY,
                    colorType);

                appendLine(layer1a, 'trainline_b', k, 0,
                    getX(currStop.arrivalTime, currStop.arrivalDay) - horizontalSpace / 2, lineaY,
                    getX(currStop.arrivalTime, currStop.arrivalDay), currY,
                    colorType);

                // Train name at start
                appendTextName(layer3, "trainname_in", k, 0, getX(currStop.arrivalTime, currStop.arrivalDay) - horizontalSpace, lineaY + dy,
                    dy, "start", train.name + '' + (train.engine == '' ? '':'/'+train.engine), colorType);
            }
            // if (train.currStopIndex == 0 && train.currStatus == statusType.ARRIVAL)
            //     colorType = 1;
            appendLine(layer1, 'trainline_1', k, 0,
                getX(currStop.arrivalTime, currStop.arrivalDay), currY,
                getX(currStop.departedTime, currStop.departedDay), currY,
                colorType);
            break;

        case statusType.DEPARTED:
            if (!train.inSpecial) {
                appendLine(layer1a, 'trainline_a', k, 0,
                getX(currStop.departedTime, currStop.departedDay) - horizontalSpace, lineaY,
                getX(currStop.departedTime, currStop.departedDay), lineaY,
                colorType);

                appendLine(layer1a, 'trainline_b', k, 0,
                    getX(currStop.departedTime, currStop.departedDay), lineaY,
                    getX(currStop.departedTime, currStop.departedDay), currY,
                    colorType);

                // Train name at start
                appendTextName(layer3, "trainname_in", k, 0, getX(currStop.departedTime, currStop.departedDay) - horizontalSpace, lineaY + dy,
                    dy, "start", train.name+ '' + (train.engine == '' ? '':'/'+train.engine), colorType);
            }
            break;

        case statusType.CREATED:
            if (!train.inSpecial) {
                appendLine(layer1a, 'trainline_a', k, 0,
                getX(currStop.departedTime, currStop.departedDay) - horizontalSpace / 2, lineaY,
                getX(currStop.departedTime, currStop.departedDay) + horizontalSpace / 2, lineaY,
                colorType);

                appendLine(layer1a, 'trainline_b', k, 0,
                    getX(currStop.departedTime, currStop.departedDay), currY - verticalSpace,
                    getX(currStop.departedTime, currStop.departedDay), currY,
                    colorType);

                // Train name at start
                appendTextName(layer3, "trainname_in", k, 0, getX(currStop.departedTime, currStop.departedDay), lineaY + dy,
                    dy, "middle", train.name+ '' + (train.engine == '' ? '':'/'+train.engine), colorType);
            }
            break;
    }
    // if (train.stops.length > 1) {
    if (listStops.length > 1) {
        // if (train.currStopIndex == 0 && train.currStatus == statusType.DEPARTED)
        //     colorType = 1;

        var nextStop = listStops[1];
        console.log("nextStop",nextStop);
        var nextY = stations.filter(st => st.id == nextStop.stationIndex)[0].y;
        //var nextY = stations[nextStop.stationIndex].y;
        appendLine(layer1a, 'trainline_2', k, 0,
            getX(currStop.departedTime, currStop.departedDay), currY,
            getX(nextStop.arrivalTime, nextStop.arrivalDay), nextY,
            colorType);
    }

    // Draw middle stops
    for (var i = 1; i < listStops.length - 1; i++) {
        // var currStop = train.stops[i];
        currStop = listStops[i];
        if(currStop.type === 1){
          // if (i == train.currStopIndex && train.currStatus == statusType.ARRIVAL)
          //     colorType = 1;
          currY = stations.filter(st => st.id == currStop.stationIndex)[0].y;
  //        var currY = stations[currStop.stationIndex].y;
  // vẽ đoạn nối giữa 2 điểm đón tiễn
          appendLine(layer1, 'trainline_1', k, i,
              getX(currStop.arrivalTime, currStop.arrivalDay), currY,
              getX(currStop.departedTime, currStop.departedDay), currY,
              colorType);

          // if (i == train.currStopIndex && train.currStatus == statusType.DEPARTED)
          //     colorType = 1;
          // var nextStop = train.stops[i + 1];
          nextStop = listStops[i + 1];
          nextY = stations.filter(st => st.id == nextStop.stationIndex)[0].y;
          //var nextY = stations[nextStop.stationIndex].y;
          appendLine(layer1a, 'trainline_2', k, i,
              getX(currStop.departedTime, currStop.departedDay), currY,
              getX(nextStop.arrivalTime, nextStop.arrivalDay), nextY,
              colorType);
        }

    }

    // Draw last stop
    // var currStop = train.stops[train.stops.length - 1];
    var currStop = listStops[listStops.length - 1];
    //var currY = stations[currStop.stationIndex].y;
    var currY = stations.filter(st => st.id == currStop.stationIndex)[0].y;
    var lineaY = train.outDirection == trainDirection.DOWN ? currY + verticalSpace : currY - verticalSpace;
    var dissolvedY = train.outDirection == trainDirection.DOWN ? currY + 2 * verticalSpace : currY - 2 * verticalSpace;
    switch (train.outStatus) {
        case statusType.DEPARTED:
        console.log("DEPARTED");
            appendLine(layer1, 'trainline_1', k, train.stops.length - 1,
                getX(currStop.arrivalTime, currStop.arrivalDay), currY,
                getX(currStop.departedTime, currStop.departedDay), currY,
                colorType);

            if (!train.outSpecial) {
                appendLine(layer1a, 'trainline_b', k, listStops.length - 1,
                // appendLine(layer1a, 'trainline_b', k, listStops.length - 1,
                    getX(currStop.departedTime, currStop.departedDay), currY,
                    getX(currStop.departedTime, currStop.departedDay) + horizontalSpace / 2, lineaY,
                    colorType);

                // appendLine(layer1a, 'trainline_a', k, train.stops.length - 1,
                appendLine(layer1a, 'trainline_a', k, listStops.length - 1,
                    getX(currStop.departedTime, currStop.departedDay) + horizontalSpace / 2, lineaY,
                    getX(currStop.departedTime, currStop.departedDay) + horizontalSpace, lineaY,
                    colorType);

                // Train name at end
                appendTextName(layer3, "trainname_out", k, listStops.length - 1, getX(currStop.departedTime, currStop.departedDay) + horizontalSpace, lineaY - dy,
                // appendTextName(layer3, "trainname_out", k, train.stops.length - 1, getX(currStop.departedTime, currStop.departedDay) + horizontalSpace, lineaY - dy,
                    -dy, "end", train.name + '' + (train.engine == '' ? '':'/'+train.engine), colorType);
            }
            break;

        case statusType.DISSOLVED:
            if (!train.outSpecial) {
                // appendLine(layer1a, 'trainline_b', k, train.stops.length - 1,
                appendLine(layer1a, 'trainline_b', k, listStops.length - 1,
                getX(currStop.arrivalTime, currStop.arrivalDay), currY,
                getX(currStop.arrivalTime, currStop.arrivalDay), dissolvedY,
                colorType);

                // appendLine(layer1a, 'trainline_a', k, train.stops.length - 1,
                appendLine(layer1a, 'trainline_a', k, listStops.length - 1,
                    getX(currStop.arrivalTime, currStop.arrivalDay) - horizontalSpace / 2, lineaY,
                    getX(currStop.arrivalTime, currStop.arrivalDay) + horizontalSpace / 2, lineaY,
                    colorType);

                // Train name at end
                // appendTextName(layer3, "trainname_out", k, train.stops.length - 1, getX(currStop.arrivalTime, currStop.arrivalDay), dissolvedY - dy,
                appendTextName(layer3, "trainname_out", k, listStops.length - 1, getX(currStop.arrivalTime, currStop.arrivalDay), dissolvedY - dy,
                    -dy, "middle", train.name + '' + (train.engine == '' ? '':'/'+train.engine), colorType);
            }
            break;
    }
}

// Check if selected circle is departed or arrival
function isDepartedCircle(circleID) {
    return d3.select("#" + circleID).attr("id").includes("traincircle_2");
}

// Push an not-null object to a changing list
function pushChangingList(list, id) {
    var obj = d3.select(id);
    if (obj[0][0] != null)
        list.push(obj);
}

// Define exactly what is being changed
function defineChanges(circleID) {
    console.log("defineChanges");
    var currentCircle = d3.select("#" + circleID);
    currentStopIndex = parseInt(currentCircle.attr("stop-index"));
    currentTrainIndex = parseInt(currentCircle.attr("train-index"));
    currentStationIndex = trains[currentTrainIndex].stops[currentStopIndex].stationIndex;
    currentColorType = parseInt(currentCircle.attr("color-type"));
    console.log("Tau: ", trains[currentTrainIndex].name);
    console.log("Diem dung: ", currentStopIndex);

    currentTextObjs = [];
    currentCircleObjs = [];
    currentLineObjs = [];
    currentFirstLine = null;

    // Define exactly what is being changed AND define objects which would be changed
    if (currentStopIndex == 0) {
        if (isDepartedCircle(circleID)) {
            if (trains[currentTrainIndex].inStatus == statusType.CREATED) { // Khởi hành (đi)
                currentChange = changeType.CREATED;
                dragMinX = 0;

                // Define objects which would be changed
                currentCircleObjs.push(currentCircle);
                for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }

                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_0");
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_0");
                for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                pushChangingList(currentTextObjs, "#trainname_in_" + currentTrainIndex + "_" + 0);
                for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            }
            else if (trains[currentTrainIndex].inStatus == statusType.DEPARTED) { // Tàu đi
                currentChange = changeType.DEPARTED;
                dragMinX = 0;

                // Define objects which would be changed
                currentCircleObjs.push(currentCircle);
                for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }

                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_0");
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_0");
                for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                pushChangingList(currentTextObjs, "#trainname_in_" + currentTrainIndex + "_" + 0);
                for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            }
            else {
                if (trains[currentTrainIndex].stops[currentStopIndex].arrivalTime == trains[currentTrainIndex].stops[currentStopIndex].departedTime) {// Tàu đến: Đi hoặc Thông qua
                    currentChange = changeType.PASS_THROUGH;
                    dragMinX = 0;

                    // Define objects which would be changed
                    for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                        pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                        pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                    }

                    pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_0");
                    pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_0");
                    for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                        pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                        pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                    }
                    pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                    pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                    pushChangingList(currentTextObjs, "#trainname_in_" + currentTrainIndex + "_" + 0);
                    for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                        pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                        pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                    }
                    pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                }
                else {
                    currentChange = changeType.DEPARTED;
                    dragMinX = parseFloat(d3.select("#traincircle_1_" + currentTrainIndex + "_" + currentStopIndex).attr("cx"));

                    // Define objects which would be changed
                    currentCircleObjs.push(currentCircle);
                    for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                        pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                        pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                    }
                    console.log("currentFirstLine","#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
                    currentFirstLine = d3.select("#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
                    pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + currentStopIndex);
                    for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                        pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                        pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                    }
                    pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                    pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                    pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + 0);
                    for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                        pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                        pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                    }
                    pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                }
            }
        }
        else {
            currentChange = changeType.ARRIVAL;
            dragMinX = 0;

            // Define objects which would be changed
            for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
            }

            pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_0");
            pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_0");
            for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

            pushChangingList(currentTextObjs, "#trainname_in_" + currentTrainIndex + "_" + 0);
            for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
        }
    }
    else {
      console.log("circleID",circleID);
        if (isDepartedCircle(circleID)) {
            if (trains[currentTrainIndex].stops[currentStopIndex].arrivalTime == trains[currentTrainIndex].stops[currentStopIndex].departedTime) {// Tàu đến: Đi hoặc Thông qua
                currentChange = changeType.PASS_THROUGH;
                //TODO: check drag
                dragMinX = 0;//parseFloat(d3.select("#traincircle_2_" + currentTrainIndex + "_" + (currentStopIndex - 1)).attr("cx"));

                // Define objects which would be changed
                for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }
                console.log("currentFirstLine","#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
                currentFirstLine = d3.select("#trainline_2_" + currentTrainIndex + "_" + parseInt(currentStopIndex - 1));
                for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            }
            else {
                currentChange = changeType.DEPARTED;
                dragMinX = parseFloat(d3.select("#traincircle_1_" + currentTrainIndex + "_" + currentStopIndex).attr("cx"));

                // Define objects which would be changed
                console.log("push circle object",currentCircle);
                currentCircleObjs.push(currentCircle);
                for (var i = currentStopIndex + 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }
                console.log("currentFirstLine","#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
                currentFirstLine = d3.select("#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
                pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + currentStopIndex);
                for (var i = currentStopIndex + 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + currentStopIndex);
                for (var i = currentStopIndex + 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            }
        }
        else {
            currentChange = changeType.ARRIVAL;
            dragMinX = parseFloat(d3.select("#traincircle_2_" + currentTrainIndex + "_" + (currentStopIndex - 1)).attr("cx"));

            // Define objects which would be changed
            for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
            }
            console.log("currentFirstLine","#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
            currentFirstLine = d3.select("#trainline_2_" + currentTrainIndex + "_" + parseInt(currentStopIndex - 1));
            for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

            for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
        }
    }

    console.log("Thay doi: ", timeChangingText[currentColorType][currentChange]);
    console.log("dragMinX: ", dragMinX);
}

// Define exactly what is being changed from line
function defineChangesFromLine(circleID) {
  console.log("circleID",circleID);
    var currentCircle = d3.select("#" + circleID);
    currentStopIndex = parseInt(currentCircle.attr("stop-index"));
    currentTrainIndex = parseInt(currentCircle.attr("train-index"));
    currentStationIndex = trains[currentTrainIndex].stops[currentStopIndex].stationIndex;
    console.log("defineChangesFromLine",currentStationIndex);
    currentColorType = parseInt(currentCircle.attr("color-type"));
    console.log("Tau: ", trains[currentTrainIndex].name);
    console.log("Diem dung: ", currentStopIndex);

    currentTextObjs = [];
    currentCircleObjs = [];
    currentLineObjs = [];
    currentFirstLine = null;

    // Define exactly what is being changed AND define objects which would be changed
    if (currentStopIndex == 0) {
        if (trains[currentTrainIndex].inStatus == statusType.CREATED) { // Khởi hành (đi)
            currentChange = changeType.CREATED;
            dragMinX = 0;

            // Define objects which would be changed
            currentCircleObjs.push(currentCircle);
            for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
            }

            pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_0");
            pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_0");
            for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

            pushChangingList(currentTextObjs, "#trainname_in_" + currentTrainIndex + "_" + 0);
            for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
        }
        else if (trains[currentTrainIndex].inStatus == statusType.DEPARTED) { // Tàu đi
            currentChange = changeType.DEPARTED;
            dragMinX = 0;

            // Define objects which would be changed
            currentCircleObjs.push(currentCircle);
            for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
            }

            pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_0");
            pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_0");
            for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

            pushChangingList(currentTextObjs, "#trainname_in_" + currentTrainIndex + "_" + 0);
            for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
            }
            pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
        }
        else {
            if (trains[currentTrainIndex].stops[currentStopIndex].arrivalTime == trains[currentTrainIndex].stops[currentStopIndex].departedTime) {// Tàu đến: Đi hoặc Thông qua
                currentChange = changeType.PASS_THROUGH;
                dragMinX = 0;

                // Define objects which would be changed
                for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }

                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_0");
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_0");
                for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                pushChangingList(currentTextObjs, "#trainname_in_" + currentTrainIndex + "_" + 0);
                for (var i = 0; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            }
            else {
                currentChange = changeType.DEPARTED;
                dragMinX = parseFloat(d3.select("#traincircle_1_" + currentTrainIndex + "_" + currentStopIndex).attr("cx"));

                // Define objects which would be changed
                currentCircleObjs.push(currentCircle);
                for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }
                console.log("currentFirstLine","#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
                currentFirstLine = d3.select("#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
                pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + currentStopIndex);
                for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
                pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

                pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + 0);
                for (var i = 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
                }
                pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
            }
        }
    }
    else {
        currentChange = changeType.DEPARTED;
        if (currentCircle.attr("color-type") == "0" && (trains[currentTrainIndex].stops[currentStopIndex].arrivalTime == trains[currentTrainIndex].stops[currentStopIndex].departedTime))
            currentChange = changeType.PASS_THROUGH;
        dragMinX = parseFloat(d3.select("#traincircle_1_" + currentTrainIndex + "_" + currentStopIndex).attr("cx"));

        // Define objects which would be changed
        currentCircleObjs.push(currentCircle);
        for (var i = currentStopIndex + 1; i < trains[currentTrainIndex].stops.length; i++) {
            pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
            pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
        }
        console.log("currentFirstLine","#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
        currentFirstLine = d3.select("#trainline_1_" + currentTrainIndex + "_" + currentStopIndex);
        pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + currentStopIndex);
        for (var i = currentStopIndex + 1; i < trains[currentTrainIndex].stops.length; i++) {
            pushChangingList(currentLineObjs, "#trainline_1_" + currentTrainIndex + "_" + i);
            pushChangingList(currentLineObjs, "#trainline_2_" + currentTrainIndex + "_" + i);
        }
        pushChangingList(currentLineObjs, "#trainline_a_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
        pushChangingList(currentLineObjs, "#trainline_b_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));

        pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + currentStopIndex);
        for (var i = currentStopIndex + 1; i < trains[currentTrainIndex].stops.length; i++) {
            pushChangingList(currentTextObjs, "#trainhour_1_" + currentTrainIndex + "_" + i);
            pushChangingList(currentTextObjs, "#trainhour_2_" + currentTrainIndex + "_" + i);
        }
        pushChangingList(currentTextObjs, "#trainname_out_" + currentTrainIndex + "_" + parseInt(trains[currentTrainIndex].stops.length - 1));
    }
    console.log("Thay doi: ", timeChangingText[currentColorType][currentChange]);
    console.log("dragMinX: ", dragMinX);
}

// Convert xAxis value to hours
function xToHour(x) {
  console.log("to hour X",x);
    var hour = (Math.floor(times[0] + parseInt(x) / hourSpace)) % 24;
    return (hour >= 10) ? hour : "0" + hour;
}

// Convert xAxis value to minutes
function xToMinute(x) {
    //x = x - (Math.floor(x / hourSpace) * hourSpace);
    var min = Math.round(x / minSpace) % 60;
    return (min >= 10) ? min : "0" + min;
}

// Update size of a popup circle
function updatePopupCircleSize(circle) {
    popup.style("visibility", "visible")
        .attr("x", parseFloat(circle.attr("cx")) - popupWidth)
        .attr("y", parseFloat(circle.attr("cy")) - popupHeight - 20)
        .attr("class", "popup");
    console.log("Toa do: ", parseFloat(circle.attr("cx")) - popupWidth);

    popupRect.style("visibility", "visible")
        .attr("x", parseFloat(circle.attr("cx")) - popupWidth)
        .attr("y", parseFloat(circle.attr("cy")) - popupHeight - 20)
        .attr("width", popupWidth + 1)
        .attr("height", popupHeight + 1)
}

// Update content of a circle
function updatePopupCircleContent() {
    var x = currentCircle.attr("cx");
    console.log(currentTrainIndex);
    var htmlText = '<h2>Tàu: ' + trains[currentTrainIndex].name + '</h2>';
    htmlText += '<h2>Ga: ' + stations.filter(st => st.id == currentStationIndex)[0].name + '</h2>';
    htmlText += '<h2>' + timeChangingText[currentColorType][currentChange] + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    popup.html(htmlText)
        .attr("x", x - popupWidth);
    popupRect.attr("x", x - popupWidth);
}

// Update size of a circle at the end
function updatePopupCircleSizeEnd(circle) {
    if (isChanged() && allowAction()) {
        popup
            .attr("class", "popupend")
            .attr("y", parseFloat(circle.attr("cy")) - popupHeightEnd - 20);
        popupRect
            .attr("y", parseFloat(circle.attr("cy")) - popupHeightEnd - 20)
            .attr("width", popupWidthEnd + 1)
            .attr("height", popupHeightEnd + 1)
    }
    else {
    	console.log("Short");
        popup
            .attr("class", "popupendshort")
            .attr("y", parseFloat(circle.attr("cy")) - popupHeightEndShort - 20);
        popupRect
            .attr("y", parseFloat(circle.attr("cy")) - popupHeightEndShort - 20)
            .attr("width", popupWidthEndShort + 1)
            .attr("height", popupHeightEndShort + 1)
    }
}

// Check if there is changing time
function isChanged() {
    var x = currentCircle.attr("cx");
    var xBackup = currentCircle.attr("cx-backup");
    return Math.round(parseFloat(x) / minSpace) != Math.round(parseFloat(xBackup) / minSpace);
}

// Check if it is allowed to take an action
function allowAction() {
    var previousCircleID;
    var previousCircle;
    if (currentStopIndex == 0) {
        if (trains[currentTrainIndex].stops[currentStopIndex].arrivalTime == trains[currentTrainIndex].stops[currentStopIndex].departedTime)
            previousCircleID = currentCircleID;
        else
            previousCircleID = currentCircleID.replace("traincircle_2", "traincircle_1");
    }
    else {
        if (isDepartedCircle(currentCircleID)) {
            if (currentChange != changeType.PASS_THROUGH)
                previousCircleID = currentCircleID.replace("traincircle_2", "traincircle_1");
            else
                previousCircleID = "traincircle_2_" + currentTrainIndex + "_" + (currentStopIndex - 1);
        }
        else
            previousCircleID = "traincircle_2_" + currentTrainIndex + "_" + (currentStopIndex - 1);

    }
    previousCircle = d3.select("#" + previousCircleID);
    if(previousCircle === null) return false;
    return (previousCircleID == currentCircleID || previousCircle[0][0] == null || previousCircle.attr("color-type") == "0")
}

// Update content of a circle at the end
function updatePopupCircleContentEnd() {
    var x = currentCircle.attr("cx");
    // var htmlText = '<h2>Tàu: ' + train.name + '</h2>';
    var htmlText = '<h2>Tàu: ' + trains[currentTrainIndex].name + '</h2>';
    console.log("currentStationIndex",currentStationIndex);
    htmlText += '<h2>Ga: ' + stations.filter(st => st.id == currentStationIndex)[0].name + '</h2>';
    htmlText += '<h2>' + timeChangingText[currentColorType][currentChange] + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    if (allowAction())
        htmlText += '<button id="action" type="submit" class="btn btn-success btn-block" onclick="applyAction()" style="margin: 10px 0 0 0;padding: 0px 15px 0px 15px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">' + confirmLabel[currentChange] + '</button>';
    if (isChanged())
        htmlText += '<button id="apply" type="submit" class="btn btn-primary btn-block" onclick="applyChangeTime()" style="margin: 10px 0 0 0px;padding: 0px 15px 0px 15px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Thay đổi kế hoạch</button>';
    htmlText += '<button id="cancel" type="submit" class="btn btn-danger btn-block" onclick="cancelChangeTime()" style="margin: 10px 0 00px;padding: 0px 15px 0px 15px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Hủy</button>';
    //htmlText += '<input type="text" class="form-control" id="time" placeholder="Thời gian">';
    popup.html(htmlText);
}

// Apply action: ĐÓN TÀU/TIỄN TÀU/THÔNG QUA/KHỞI HÀNH
function applyAction() {
    //ARRIVAL: 0, DEPARTED: 1, CREATED: 2, PASS_THROUGH: 3
    console.log("applyAction");

    // Update new position
    var train = trains[currentTrainIndex];
    train.currStopIndex = currentStopIndex;

    switch (currentChange) {
        case changeType.ARRIVAL:
            if (currentStopIndex == train.stops.length && train.outStatus == statusType.DISSOLVED)
                train.currStatus = statusType.DISSOLVED;
            else
                train.currStatus = statusType.ARRIVAL;
            break;
        case changeType.DEPARTED:
            train.currStatus = statusType.DEPARTED;
            break;
        case changeType.CREATED:
            train.currStatus = statusType.DEPARTED;
            break;
        case changeType.PASS_THROUGH:
            train.currStatus = statusType.DEPARTED;
            break;
    }

    // Update time changing
    applyChangeTime();
}

// Popup-Apply changing
function applyChangeTime() {
    console.log("applyChangeTime");

    // Have to adjust a little bit to make the position is absoluted correct
    var backupCx = parseFloat(currentCircle.attr("cx-backup"));
    var expectedCx = backupCx + adjustedMinutes() * minSpace;
    updateOnDraggingCircle(expectedCx - currentCircle.attr("cx"));

    // Update data of trains
    updateTrainData();

    // Update circles for new backup
    for (var i = 0; i < currentCircleObjs.length; i++) {
        var cx = parseFloat(currentCircleObjs[i].attr("cx"));
        currentCircleObjs[i].attr("cx-backup", cx);
    }

    popup.style("visibility", "hidden");
    popupRect.style("visibility", "hidden");
    currentCircleID = "";
    editting = false;

    // Redraw this train
    drawTrains(currentTrainIndex);
}

// Update data of trains
function updateTrainData() {
    console.log("Update train data");

    var train = trains[currentTrainIndex];
    // currentCircleObjs = currentCircleObjs.filter(st => st.type ==1);

    // Update time
    for (var i = 0; i < currentCircleObjs.length; i++) {
        var stop = train.stops[parseInt(currentCircleObjs[i].attr("stop-index"))];
        var newCx = parseFloat(currentCircleObjs[i].attr("cx"));
        if (isDepartedCircle(currentCircleObjs[i].attr("id"))) {
            totalOldMins = Math.floor(stop.departedTime / 100) * 60 + (stop.departedTime % 100);
            totalNewMins = totalOldMins + currentAdjustedMinutes + 1440; // Avoid wrong convertion when time moved from 00:15 to 23:45 for example
            newHour = Math.floor(totalNewMins / 60) % 24;
            newMin = totalNewMins % 60;
            stop.departedTime = newHour * 100 + newMin;
            if (newCx < 0)
                stop.departedDay = dayType.YESTERDAY;
            else if (newCx >= viewerWidth)
                stop.departedDay = dayType.TOMORROW;
            else
                stop.departedDay = dayType.TODAY;
        }
        else {
            totalOldMins = Math.floor(stop.arrivalTime / 100) * 60 + (stop.arrivalTime % 100);
            totalNewMins = totalOldMins + currentAdjustedMinutes + 1440; // Avoid wrong convertion when time moved from 00:15 to 23:45 for example
            newHour = Math.floor(totalNewMins / 60) % 24;
            newMin = totalNewMins % 60;
            stop.arrivalTime = newHour * 100 + newMin;
            if (newCx < 0)
                stop.arrivalDay = dayType.YESTERDAY;
            else if (newCx >= viewerWidth)
                stop.arrivalDay = dayType.TOMORROW;
            else
                stop.arrivalDay = dayType.TODAY;
        }
    }
    updateVirtualData();
}

function updateVirtualData(){
  if(virtualStops[currentTrainIndex] === undefined) return;
  var trainStops = trains[currentTrainIndex].stops;
  // var lastTime;
  // var lastVirtualIndex = 0;
  // console.log('virtualStops',virtualStops);
  trainStops.forEach(function(stop,k){
    for(var i = 0;i < virtualStops[currentTrainIndex].length;i++){
        if(virtualStops[currentTrainIndex][i].stationIndex === stop.stationIndex){
          // console.log("update virtual stop",stop);
          // lastVirtualIndex = i;
          // console.log("lastVirtualIndex",lastVirtualIndex);
          virtualStops[currentTrainIndex][i].arrivalTime = stop.arrivalTime;
          virtualStops[currentTrainIndex][i].departedTime = stop.departedTime;
          // lastTime = stop.departedTime;
        }
        // else if(i > lastVirtualIndex){
        //     lastTime = parseInt(getTime(lastTime,noMinpassPerSt));
        //     virtualStops[currentTrainIndex][i].arrivalTime = lastTime;
        //     virtualStops[currentTrainIndex][i].departedTime = lastTime;
        //     console.log("stop.arrivalTime",stop.arrivalTime);
        // }
    }
  });
}

// Popup-Cancel changing
function cancelChangeTime() {
    console.log("Hủy thay đổi thời gian!");
    updateOnDraggingCircle(-adjustedX());
    popup.style("visibility", "hidden");
    popupRect.style("visibility", "hidden");
    currentCircleID = "";
    editting = false;
}

// Calculate the adjusted X
function adjustedX() {
    return parseFloat(currentCircle.attr("cx")) - parseFloat(currentCircle.attr("cx-backup"));
}

// Calculate the adjusted minutes
function adjustedMinutes() {
    var newCX = parseFloat(currentCircle.attr("cx"));
    var backupCX = parseFloat(currentCircle.attr("cx-backup"));
    return Math.round(newCX / minSpace) - Math.round(backupCX / minSpace);
}

// Mouse over train circle event
function mouseoverTrainCircle() {
    console.log("MOUSE OVER");
    var circle = d3.select(this);
    var circleID = circle.attr("id");

    if ((popupOpen && circleID != currentCircleID) || editting)
        return;

    currentCircleID = circleID;
    currentCircle = circle;

    currentCircle
        .transition().duration(200)
        .attr("style", "cursor:pointer")
        .attr("r", 5);

    defineChanges(circleID);

    popupOpen = true;

    updatePopupCircleSize(currentCircle);
    updatePopupCircleContent();
}

// Mouse out train circle event
function mouseoutTrainCircle() {
    d3.select(this)
        .transition().duration(200)
        .attr("r", 2);
    if (!editting) {
        popup.style("visibility", "hidden");
        popupRect.style("visibility", "hidden");
        popupOpen = false;
    }
}

// Drag train circle
var dragTrainCircleListener = d3.behavior.drag()
    .on("dragstart", function () {
        // Do not allow dragging with happenned events
        if (currentColorType == 0 || d3.select(this).attr("id") != currentCircleID)
            return;
        console.log("dragstart");
        currentCircle
            .transition().duration(200)
            .attr("r", 2);
        popupOpen = false;
        editting = true;

        // updatePopupCircleSize(currentCircle);
        // updatePopupCircleContent();
        updatePopupCircleSizeEnd(currentCircle);
        updatePopupCircleEdit();

        d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function () {
        // Do not allow dragging with happenned events
        if (currentColorType == 0 || d3.select(this).attr("id") != currentCircleID)
            return;

        updateOnDraggingCircle(d3.event.dx);
        updatePopupCircleContent();
    })
    .on("dragend", function () {
        // Do not allow dragging with happenned events
        if (currentColorType == 0 || d3.select(this).attr("id") != currentCircleID)
            return;
        if (isChanged()
        // || allowAction()
      )
         {
            updatePopupCircleSizeEnd(currentCircle);
            console.log("init dragTrainCircleListener");
            updatePopupCircleContentEnd();
        }
        // else {
        //     popup.style("visibility", "hidden");
        //     popupRect.style("visibility", "hidden");
        //     editting = false;
        // }
        console.log("dragend");
    });

// Update all information while dragging
function updateOnDraggingCircle(dx) {
    // Do not allow to change over the minimum value
    if (parseFloat(currentCircleObjs[0].attr("cx")) + dx < dragMinX)
        dx = dragMinX - parseFloat(currentCircleObjs[0].attr("cx"));

    // Update circles
    for (var i = 0; i < currentCircleObjs.length; i++) {
        var newCx = parseFloat(currentCircleObjs[i].attr("cx")) + dx;
        currentCircleObjs[i].attr("cx", newCx);
    }

    // Calculate increase/decrease value to have even values
    currentAdjustedMinutes = adjustedMinutes();

    // Update lines
    if (currentFirstLine != null) {
        var newX2 = parseFloat(currentFirstLine.attr("x2")) + dx;
        currentFirstLine.attr("x2", newX2);
    }

    for (var i = 0; i < currentLineObjs.length; i++) {
        var newX1 = parseFloat(currentLineObjs[i].attr("x1")) + dx;
        var newX2 = parseFloat(currentLineObjs[i].attr("x2")) + dx;
        currentLineObjs[i].attr("x1", newX1).attr("x2", newX2);
    }

    // Update texts
    for (var i = 0; i < currentTextObjs.length; i++) {
        var newX = parseFloat(currentTextObjs[i].attr("x")) + dx;
        currentTextObjs[i].attr("x", newX);
        if (currentTextObjs[i].attr("id").includes("trainhour")) {
            // Have to be sure that all values increase/decrease the same
            var circleID = currentTextObjs[i].attr("id").replace("trainhour", "traincircle");
            var backupX = parseFloat(d3.select("#" + circleID).attr("cx-backup"));
            var minute = (Math.round(backupX / minSpace) + 1000 + currentAdjustedMinutes) % 10;
            currentTextObjs[i].text(minute % 10);
        }
    }
}

// Append and assign a circle to a train at a stop
function appendCircle(layer, prefix, trainIndex, stopIndex, cx, cy, colorType) {
    var circle = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex);
    if (circle[0][0] == null)
        layer.append("circle")
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 2)
            .attr("cx-backup", cx)
            .attr("fill", "white")
            .attr("stroke-width",2)
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1)
            .on("mouseover", mouseoverTrainCircle)
            .on("mouseout", mouseoutTrainCircle)
            .call(dragTrainCircleListener);
    else
        circle
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 2)
            .attr("cx-backup", cx)
            .attr("fill", "white")
            .attr("stroke-width", 1)
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1)
            .on("mouseover", mouseoverTrainCircle)
            .on("mouseout", mouseoutTrainCircle)
            .call(dragTrainCircleListener);
}

// Append and assign hour to a train at a stop
function appendTextHour(layer, prefix, trainIndex, stopIndex, x, y, dy, align, visible, text, colorType) {
    var textObj = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex);
    if (textObj[0][0] == null)
        layer.append("text")
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            .attr("y-backup", y)
            // .attr("fill", hourColor[colorType][trains[trainIndex].type])
            .attr("fill", "black")
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", 8)
            .style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge")
            .style("visibility", visible ? "visible" : "hidden");
    else
        textObj
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            .attr("y-backup", y)
            // .attr("fill", hourColor[colorType][trains[trainIndex].type])
            .attr("fill", "black")
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", 8)
            .style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge")
            .style("visibility", visible ? "visible" : "hidden");
}

// Append and assign name to a train
function appendTextName(layer, prefix, trainIndex, stopIndex, x, y, dy, align, text, colorType) {
    var textObj = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex);
    if (textObj[0][0] == null)
        layer.append("text")
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            // .attr("fill", hourColor[colorType][trains[trainIndex].type])
            .attr("fill", "black")
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", 12)
            .style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge");
    else
        textObj
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            // .attr("fill", hourColor[colorType][trains[trainIndex].type])
            .attr("fill", "black")
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", 12)
            .style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge");
}


// Append and assign name to a train
function appendTextNode(layer, prefix, trainIndex, stopIndex, x, y, dy, align, text, colorType) {
    var textObj = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex+'_node');
    if (textObj[0][0] == null)
        layer.append("text")
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex+'_node')
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            .attr("fill", 'red')
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", 10)
            .style("font-weight", 500)
            // .style('font-color','red')
            .style("text-anchor", align);
            // .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge");
    else
        textObj
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex+'_node')
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            .attr("fill", 'red')
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", 10)
            .style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge");
}

// Draw train circles
function drawTrainCircles(k) {
    train = trains[k];
    var dy = train.inDirection == trainDirection.UP ? 1 : -1;
    var dx = -1.5;
    var colorType = 0;
    if (train.currStopIndex == -1)
        colorType = 1;
    // Draw first stop
    var listStops = train.stops.filter(st => st.type == 1);
    // var currStop = train.stops[0];
    var currStop = listStops[0];
    var currY = stations.filter(st => st.id == currStop.stationIndex)[0].y;
    //var currY = stations[currStop.stationIndex].y;
    var lineaY = train.inDirection == trainDirection.DOWN ? currY - verticalSpace : currY + verticalSpace;
    switch (train.inStatus) {
        case statusType.ARRIVAL:
            appendCircle(layer2, 'traincircle_1', k, 0,
                getX(currStop.arrivalTime, currStop.arrivalDay), currY,
                colorType);
            appendTextHour(layer3, "trainhour_1", k, 0, getX(currStop.arrivalTime, currStop.arrivalDay) + dx, currY + dy,
                dy, "right", currStop.arrivalTime != currStop.departedTime, currStop.arrivalTime % 10, colorType);
            break;
    }

    // if (train.currStopIndex == 0 && train.currStatus == statusType.ARRIVAL)
    //     colorType = 1;
    appendCircle(layer2a, 'traincircle_2', k, 0,
        getX(currStop.departedTime, currStop.departedDay), currY,
        colorType);
    appendTextHour(layer3, "trainhour_2", k, 0, getX(currStop.departedTime, currStop.departedDay) - dx, currY - dy,
        -dy, "end", true, currStop.departedTime % 10, colorType);
    appendTextNode(layer3, "trainnode_1", k, i, getX(currStop.departedTime, currStop.departedDay), currY,
            -dy, "start", currStop.note, colorType);

    // Draw middle stops
    // for (var i = 1; i < train.stops.length - 1; i++) {
    for (var i = 1; i < listStops.length - 1; i++) {
        var currStop = listStops[i];
        if(currStop.type === 1){
          var currY = stations.filter(st => st.id == currStop.stationIndex)[0].y;
          //var currY = stations[currStop.stationIndex].y;
          // if (i > train.currStopIndex)
          //     colorType = 1;
          appendCircle(layer2, 'traincircle_1', k, i,
              getX(currStop.arrivalTime, currStop.arrivalDay), currY,
              colorType);
          appendTextHour(layer3, "trainhour_1", k, i, getX(currStop.arrivalTime, currStop.arrivalDay) + dx, currY + dy,
              dy, "start", currStop.arrivalTime != currStop.departedTime, currStop.arrivalTime % 10, colorType);

          // if (i == train.currStopIndex && train.currStatus == statusType.ARRIVAL)
          //     colorType = 1;
          appendCircle(layer2a, 'traincircle_2', k, i,
              getX(currStop.departedTime, currStop.departedDay), currY,
              colorType);
          appendTextHour(layer3, "trainhour_2", k, i, getX(currStop.departedTime, currStop.departedDay) - dx, currY - dy,
              -dy, "end", true, currStop.departedTime % 10, colorType);

          appendTextNode(layer3, "trainnode_1", k, i, getX(currStop.departedTime, currStop.departedDay), currY,
              -dy, "start", currStop.note, colorType);
        }
    }

    // Draw last stop
    // if (train.stops.length - 1 > train.currStopIndex && train.currStatus == statusType.DEPARTED)
    //     colorType = 1;
    // var currStop = train.stops[train.stops.length - 1];
    var currStop = listStops[listStops.length - 1];
    var currY = stations.filter(st => st.id == currStop.stationIndex)[0].y;
    //var currY = stations[currStop.stationIndex].y;
    var lineaY = train.inDirection == trainDirection.DOWN ? currY + verticalSpace : currY - verticalSpace;
    var dissolvedY = train.inDirection == trainDirection.DOWN ? currY + 2 * verticalSpace : currY - 2 * verticalSpace;
    // appendCircle(layer2, 'traincircle_1', k, train.stops.length - 1,
    appendCircle(layer2, 'traincircle_1', k, listStops.length - 1,
        getX(currStop.arrivalTime, currStop.arrivalDay), currY,
        colorType);
    // appendTextHour(layer3, "trainhour_1", k, train.stops.length - 1, getX(currStop.arrivalTime, currStop.arrivalDay) + dx, currY + dy,
    appendTextHour(layer3, "trainhour_1", k, listStops.length - 1, getX(currStop.arrivalTime, currStop.arrivalDay) + dx, currY + dy,
        dy, "start", currStop.arrivalTime != currStop.departedTime, currStop.arrivalTime % 10, colorType);
    appendTextNode(layer3, "trainnode_1", k, i, getX(currStop.departedTime, currStop.departedDay), currY,
        -dy, "start", currStop.note, colorType);

    // if (train.stops.length - 1 == train.currStopIndex && train.currStatus == statusType.ARRIVAL)
    //     colorType = 1;
    switch (train.outStatus) {
        case statusType.DEPARTED:
            // appendCircle(layer2a, 'traincircle_2', k, train.stops.length - 1,
            appendCircle(layer2a, 'traincircle_2', k, listStops.length - 1,
                getX(currStop.departedTime, currStop.departedDay), currY,
                colorType);
            // appendTextHour(layer3, "trainhour_2", k, train.stops.length - 1, getX(currStop.departedTime, currStop.departedDay) - dx, currY - dy,
            appendTextHour(layer3, "trainhour_2", k, listStops.length - 1, getX(currStop.departedTime, currStop.departedDay) - dx, currY - dy,
                -dy, "end", true, currStop.departedTime % 10, colorType);

            break;
    }
}

// Draw train texts
function drawTrainTexts(k) {
    trains.forEach(function (train) {
    });
}

// Draw trains
function drawTrains(trainIndex) {
    if (trainIndex == -1) {  // Draw all
        // DRAW LINES
        for (var k = 0; k < trains.length; k++){
          if(trains[k].stops.length < 3) generateCoordinate(k);
            drawTrainLines(k);
            drawTrainCircles(k);
            drawTrainTexts(k);
        }
        // DRAW CIRCLES
        // for (var k = 0; k < trains.length; k++)
        //     drawTrainCircles(k);
        //
        // // DRAW TEXTS
        // for (var k = 0; k < trains.length; k++)
        //     drawTrainTexts(k);
    }
    else { // Draw only a train
        // DRAW LINES
        drawTrainLines(trainIndex);

        // DRAW CIRCLES
        drawTrainCircles(trainIndex);

        // DRAW TEXTS
        drawTrainTexts(trainIndex);
    }
}

// Prepare popup
function preparePopup() {
    // Popup for changing plan
    popupRect = layer4.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", popupWidth + 1)
        .attr("height", popupHeight + 1)
        .style("opacity", 0.8)
        .attr("fill", "#610B0B")
        .style("visibility", "hidden");

    popup = layer4.append("foreignObject")
        .attr("class", "popup")
        .attr("x", 0)
        .attr("y", 0)
        .style("visibility", "hidden");
}
//
// function getCircleIdByTime(hour,minutes){
// listHoverCircle = [];
// for(var k = 0; k < trains.length; k++){
//   var train = trains[k];
//   for(var i = 0;i<train.stops.length;i++){
//     var time = train.stops[i].arrivalTime;
//     if((Math.round(time/100) == hour) && (Math.round((time%100)/10)*10 == minutes)){
//       var object = {circleIds:'traincircle_1_'+k+'_'+i, trainindex:k,propsindex:i};
//       listHoverCircle.push(object);
//       break;
//     }
//   }
// }
// //return trainCirleIDs;
// }

function updateMultiTrainPopupContent(listCircleIds){
 console.log(listCircleIds);
 hidePopup();
  var htmlText = "";
  for(var i = 0;i<listCircleIds.length;i++){
    var c = d3.select('#'+listCircleIds[i].circleIds);
    if(c !== undefined){
      var x = c.attr("cx");
      var tindex = listCircleIds[i].trainindex;
      var pindex = listCircleIds[i].propsindex;
      console.log(tindex);
      console.log(pindex);

      c.transition().duration(200)
          .attr("style", "cursor:pointer")
          .attr("r", 5);
      updatePopupCircleSize(c);

      htmlText += '<h2>Tàu: ' + trains[tindex].name + '</h2>';
      htmlText += '<h2>Ga: ' + stations.filter(st => st.id == trains[tindex].stops[pindex].stationIndex)[0].name + '</h2>';
      htmlText += '<h2>Thông qua: '+ xToHour(x) + ':' + xToMinute(x) + '</h2>';
      htmlText+='</br>'

      //     .attr("x", x - popupWidth);
    }
    popup.html(htmlText);
    popupRect.attr("height", popupHeight*listCircleIds.length);
  }
}

// function gridMouseover() {
//   console.log("gridMouseover");
//   var x1 = d3.select(this).attr("hour");
//   var x2 = d3.select(this).attr("minutes");
//   getCircleIdByTime(x1,x2);
//
//   popupOpen = true;
//   updateMultiTrainPopupContent(listHoverCircle);
// }

// Mouse out train circle event
function gridMouseout() {
  console.log("Mouse Out");
  for(var i = 0; i< listHoverCircle.length;i++){
    var c = d3.select('#'+listHoverCircle[i].circleIds);
    c.transition().duration(200)
        .attr("r", 2);
  }
}
function hidePopup(){

    // if (!editting) {
        popup.style("visibility", "hidden");
        popupRect.style("visibility", "hidden");
        popupOpen = false;
    // }
}

// MAIN

// Open layers
var layer0 = baseSvg.append('g'); // Background + Boundary
var layer1 = baseSvg.append('g'); // Horizontal train lines (waiting at a stop) - TRAINLINE_1
var layer1a = baseSvg.append('g'); // Other train lines (moving betweeen 2 stops) - TRAINLINE_2
var layer2 = baseSvg.append('g'); // Departed circles - TRAINCIRCLE_2
var layer2a = baseSvg.append('g'); // Arrival circles - TRAINCIRCLE_1
var layer3 = baseSvg.append('g'); // Text + Number
var layer4 = baseSvg.append('g'); // Popup

setStationsY();

drawStations();
//
drawBoundary();
//
drawTimeline();
//
drawTrains(-1);
//
preparePopup();

console.log(baseSvg);

function generateCoordinate(trainIndex){
  var train = trains[trainIndex];
  var stops = train.stops;
  var st1Idx = 0;
  var st2Idx = 0;
  for(var i = 0;i< stations.length;i++){
    if(stations[i].id === stops[0].stationIndex) st1Idx = i;
    if(stations[i].id === stops[1].stationIndex) st2Idx = i;
    if(st1Idx !== 0 && st2Idx !== 0){
      break;
    }
  }
  var noPassMin = countNoMinBetween(stops[0].arrivalTime,stops[1].arrivalTime);
  console.log(""+train.name,noPassMin);
  noMinpassPerSt = 0;

  var lastMin = stops[0].arrivalTime;
  console.log("st1Idx",st1Idx);
  console.log("st2Idx",st2Idx);
  var listSt = getListStBetween(st1Idx,st2Idx);
  console.log("listSt",listSt);
  if(listSt.length > 0){
    noMinpassPerSt = Math.floor(noPassMin/listSt.length);
  }
  var newStops = [];
  newStops[0] = stops[0];
  //{ stationIndex: 101, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1749, departedTime: 1800 },
  for(var j = 0;j< listSt.length;j++){
    lastMin = getTime(lastMin,noMinpassPerSt),
    newStops.push({
      stationIndex: listSt[j].id,
      arrivalDay:dayType.TODAY,
      departedDay: dayType.TODAY,
      arrivalTime: parseInt(lastMin),
      departedTime: parseInt(lastMin),
      note:'',
      type:0
    });
  }
  newStops.push(stops[1]);
  virtualStops[trainIndex] = newStops;
  console.log("train",train);

  drawTrains(trainIndex);

}

function getListStBetween(st1Idx,st2Idx){
  var listSt = [];
  if(st1Idx > st2Idx){
    for(var i = st1Idx-1;i> st2Idx;i--){
      listSt.push(stations[i]);
    }
  } else {
    for(var i = st1Idx+1;i< st2Idx;i++){
      listSt.push(stations[i]);
    }
  }
  return listSt;
}

function getTime(inTime, addTime){
  var current = new Date();
  current.setHours(Math.floor(inTime/100));
  current.setMinutes(inTime%100);
  var newDate = new Date(current.getTime()+addTime*60*1000);
  return newDate.getHours()+''+ (newDate.getMinutes() < 10 ? '0':'')+''+newDate.getMinutes();
}

//tinh so phut tau da di tu khoi hanh va ket thuc
function countNoMinBetween(startTime, endTime){
  console.log("startTime",startTime);
  console.log("endTime",endTime);
  var total = 0;
  var hourNo = 0;// = Math.floor(total/100);
  var minNo = 0;//total%100;
  if(endTime > startTime) {
      total = endTime - startTime;
      hourNo = Math.floor(total/100);
      minNo = total%100;
      if(minNo > 60) minNo -= 60;
  }
  else{
      total = 2359 - (startTime - endTime);
      hourNo = Math.floor(total/100);
      minNo = total%100;
      if(minNo >= 60) {
        hourNo +=1;
        minNo -= 60;
      }
  }
  return hourNo*60 + minNo;
}

function updatePopupCircleEdit(){
  var x = currentCircle.attr("cx");
  // var htmlText = '<h2>Tàu: ' + train.name + '</h2>';
  console.log("current stops index",currentStopIndex);
  var htmlText = '<h2>Tàu: ' + trains[currentTrainIndex].name + '</h2>';
  console.log("currentStationIndex",currentStationIndex);
  htmlText += '<h2>Ga: ' + stations.filter(st => st.id == currentStationIndex)[0].name + '</h2>';
  htmlText += '<h2>' + timeChangingText[currentColorType][currentChange] + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    // htmlText += '<button id="action" type="submit" class="btn btn-success btn-block" onclick="applyAction()" style="margin: 10px 0 0 0;padding: 0px 15px 0px 15px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">' + confirmLabel[currentChange] + '</button>';
  if(currentChange === changeType.PASS_THROUGH){
      htmlText += '<button id="apply-add-action" type="submit" class="btn btn-primary btn-block" onclick="addAction('+currentStationIndex+')" style="margin: 10px 0 0 0px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Thêm Đón/Tiễn</button>';
  } else if(currentChange == changeType.ARRIVAL){
    htmlText += '<button id="apply-add-note" type="submit" class="btn btn-primary btn-block" onclick="addNote('+currentStationIndex+')" style="margin: 10px 0 0 0px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Thêm Cắt/Móc</button>';
    htmlText += '<div id="add-note" class="input-group" style="display:none"><input id="add-note-content" value="'+getNoteContent()+'" class="form-control" /><div class="input-group-append"><button type="button" onclick="addNoteContent()" class="btn btn-outline-secondary">Thêm</button></div></div>'
  }

  if(currentStopIndex === 0 || currentStopIndex === (trains[currentTrainIndex].stops.length - 1)){
    htmlText += '<button id="apply-edit-info" type="submit" class="btn btn-primary btn-block" onclick="editTrainInfo()" style="margin: 10px 0 0 0px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Sửa Thông Tin</button>';
    htmlText += '<div id="div-edit-train-name" class="input-group" style="display:none"><input id="edit-train-name" value="'+trains[currentTrainIndex].name+'" class="form-control" /></div>'
    htmlText += '<div id="div-edit-train-engine" class="input-group" style="display:none"><input id="edit-train-engine" value="'+trains[currentTrainIndex].engine+'" class="form-control" /><div class="input-group-append"><button type="button" onclick="updateTrainInfo()" class="btn btn-outline-secondary">Sửa</button></div></div>'
  } else {
    htmlText += '<button id="apply-remove-action" type="submit" class="btn btn-danger btn-block" onclick="removeAction()" style="margin: 10px 0 0 0px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Xóa tác nghiệp</button>';
  }


  htmlText += '<button id="cancel" type="submit" class="btn btn-danger btn-block" onclick="cancelChangeTime()" style="margin: 10px 0 00px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Hủy</button>';
  //htmlText += '<input type="text" class="form-control" id="time" placeholder="Thời gian">';
  popup.html(htmlText);
}

function editTrainInfo(){
  d3.select('#div-edit-train-name').style('display','flex');
  d3.select('#div-edit-train-engine').style('display','flex');
  d3.select('#apply-edit-info').style('display','none');

}

function updateTrainInfo(){
  trains[currentTrainIndex].name = d3.select('#edit-train-name').property('value');
  trains[currentTrainIndex].engine = d3.select('#edit-train-engine').property('value');
  clearTrainLine(currentTrainIndex);
  drawTrains(currentTrainIndex);
  closePopup();
}

//Them tac nghiep don tien
function addAction(gaid){
  var i = 0;
  for(i = 0;i< virtualStops[currentTrainIndex].length;i++){
    if(virtualStops[currentTrainIndex][i].stationIndex === gaid) {
      break;
    }
  }
  var changedTime = getTime(virtualStops[currentTrainIndex][i].departedTime,5);
  virtualStops[currentTrainIndex][i].departedTime = parseInt(changedTime);
  virtualStops[currentTrainIndex][i].type = 1;
  trains[currentTrainIndex].stops = virtualStops[currentTrainIndex].filter(st => st.type == 1);
  clearTrainLine(currentTrainIndex);
  drawTrains(currentTrainIndex);
  closePopup();
}

function addNote(gaid){
  // trains[currentTrainIndex].stops[currentStopIndex].note = "add note";
  d3.select('#add-note').style('display','flex');
  d3.select('#apply-add-note').style('display','none');
}

function addNoteContent(){
  trains[currentTrainIndex].stops[currentStopIndex].note = d3.select('#add-note-content').property('value');
  clearTrainLine(currentTrainIndex);
  drawTrains(currentTrainIndex);
  closePopup();
}

function getNoteContent(){
  return trains[currentTrainIndex].stops[currentStopIndex].note;
}

//xoa tac nghiep
function removeAction(){
  var stops = trains[currentTrainIndex].stops;
  if(currentChange === changeType.PASS_THROUGH){//update lai type cua virtualStops
    virtualStops[currentTrainIndex].forEach(function(stop){
      if(stop.stationIndex === trains[currentTrainIndex].stops[currentStopIndex].stationIndex){
        stop.type = 0;
      }
    });
    stops.splice(currentStopIndex,1);
    trains.stops = stops;
  } else if(currentChange === changeType.ARRIVAL){
    stops[currentStopIndex].arrivalTime = stops[currentStopIndex].departedTime;
  } else if(currentChange === changeType.DEPARTED){
    stops[currentStopIndex].departedTime = stops[currentStopIndex].arrivalTime;
  }
  updateVirtualData();
  clearTrainLine(currentTrainIndex);
  drawTrains(currentTrainIndex);
  closePopup();
}
function closePopup(){
    popup.style("visibility", "hidden");
    popupRect.style("visibility", "hidden");
    editting = false;
}

function clearTrainLine(k){
  console.log("clear trainline",k);
  d3.selectAll("[id^='trainline_1_"+k+"']").each(function(){ this.remove(); });
  d3.selectAll("[id^='trainline_2_"+k+"']").each(function(){ this.remove(); });
  d3.selectAll("[id^='trainline_a_"+k+"']").each(function(){ this.remove(); });
  d3.selectAll("[id^='trainline_b_"+k+"']").each(function(){ this.remove(); });
  console.log("clear trainhour");
  d3.selectAll("[id^='trainhour_2_"+k+"']").each(function(){ this.remove(); });
  d3.selectAll("[id^='trainhour_1_"+k+"']").each(function(){ this.remove(); });
  console.log("clear train cirlce");
  d3.selectAll("[id^='traincircle_1_"+k+"']").each(function(){ this.remove(); });
  d3.selectAll("[id^='traincircle_2_"+k+"']").each(function(){ this.remove(); });
  console.log("clear train name");
  d3.selectAll("[id^='trainname_in_"+k+"']").each(function(){ this.remove(); });
  d3.selectAll("[id^='trainname_out_"+k+"']").each(function(){ this.remove(); });
}

function getClickGa(arrXY){
  var clickX = arrXY[0];
  var clickY = arrXY[1];
  console.log("clickX",clickX);
  console.log("clickY",clickY);
  var clickGa = {
   y:clickY,
   gaid: 0
  }
  stations.forEach(function(st){
      if(Math.abs(st.y - clickY) < clickGa.y){
        clickGa.y = Math.abs(st.y - clickY);
        clickGa.gaid = st.id;
      }
  });
  return clickGa;
}

function lineClick(){
  var clickGa = getClickGa(d3.mouse(this));
  console.log("clickGa",clickGa);
  var stops = virtualStops[currentTrainIndex];
  var clickStops;
  for(var j = 0;j<stops.length;j++){
    if(stops[j].stationIndex === clickGa.gaid){
      currentStopIndex = j;
      clickStops = stops[j];
      if(clickStops.departedTime === clickStops.arrivalTime) currentChange = changeType.PASS_THROUGH;
      break;
    }
    // var clickStops = stops.filter(st => st.stationIndex === clickGa.gaid)[0];
  }
  updatePopupCircleClick(clickGa.gaid, getX(clickStops.departedTime, clickStops.departedDay), clickGa.y);
}

function updatePopupCircleClick(gaid,x,y){
  console.log("updatePopupCircleClick");
  // var htmlText = '<h2>Tàu: ' + train.name + '</h2>';
  var htmlText = '<h2>Tàu: ' + trains[currentTrainIndex].name + '</h2>';
  htmlText += '<h2>Ga: ' + stations.filter(st => st.id == gaid)[0].name + '</h2>';
  htmlText += '<h2>' + timeChangingText[currentColorType][currentChange] + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    // htmlText += '<button id="action" type="submit" class="btn btn-success btn-block" onclick="applyAction()" style="margin: 10px 0 0 0;padding: 0px 15px 0px 15px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">' + confirmLabel[currentChange] + '</button>';
  if(currentChange === changeType.PASS_THROUGH){
      htmlText += '<button id="apply" type="submit" class="btn btn-primary btn-block" onclick="addAction('+gaid+')" style="margin: 10px 0 0 0px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Thêm Đón/Tiễn</button>';
  }
  if(virtualStops[currentTrainIndex].type == 1){
      htmlText += '<button id="apply" type="submit" class="btn btn-danger btn-block" onclick="removeAction()" style="margin: 10px 0 0 0px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Xóa tác nghiệp</button>';
  }

  htmlText += '<button id="cancel" type="submit" class="btn btn-danger btn-block" onclick="cancelChangeTime()" style="margin: 10px 0 00px;padding: 0px 10px 0px 10px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Hủy</button>';
  //htmlText += '<input type="text" class="form-control" id="time" placeholder="Thời gian">';
  popup.html(htmlText);
  showPopupClick(x,y);
}

function showPopupClick(cx, cy){
  popup.style("visibility", "visible")
      .attr("class", "popupend")
      .attr("x", parseFloat(cx))
      .attr("y", parseFloat(cy) - 20)
      .attr("class", "popup");
  popupRect.style("visibility", "visible")
      .attr("x", parseFloat(cx))
      .attr("y", parseFloat(cy) - 20)
      .attr("width", popupWidth + 1)
      .attr("height", popupHeightEnd + 1)
  popupOpen = true;
}
