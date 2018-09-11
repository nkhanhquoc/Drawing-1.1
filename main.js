// DATA

var timeline = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
var stations = ['THANH HÓA', 'Yên Thái', 'Thị Long', 'Khoa Trường', 'Hoàng Mai', 'CẦU GIÁT', 'Yên Lý', 'Chợ Sy', 'Mỹ Lý', 'Quán Hành', 'VINH'];
var viewerWidth = 1200;
var viewerHeight = 600;
var hourSpace = viewerWidth / (timeline.length - 1);
var minSpace = viewerWidth / ((timeline.length - 1) * 60)
var tenMinSpace = viewerWidth / ((timeline.length - 1) * 6);
var stationSpace = viewerHeight / (stations.length - 1);
var popupWidth = 200;
var popupHeight = 80;
var popupWidthEnd = 200;
var popupHeightEnd = 120;
var dragStartX;
var popupOpen = false;
var touchStroke = 10;
var currentCircleID = "";

// Train
var train = {
    name: 'SE7',
    time: [[0928, 0933],  // THANH HÓA
            [0947, 0947], // Yên Thái
            [1003, 1003], // Thị Long
            [1021, 1021], // Khoa Trường
            [1038, 1045], // Hoàng Mai
            [1100, 1100], // CẦU GIÁT
            [1110, 1110], // Yên Lý
            [1118, 1121], // Chợ Sy
            [1134, 1134], // Mỹ Lý
            [1149, 1149], // Quán Hành
            [1201, 1208]], // VINH
    currentStation: 4,
    departed: false
    };
// END OF DATA

function zoom() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

// define the baseSvg, attaching a class for styling and the zoomListener
var baseSvg = d3.select("#main-container").append("svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight)
    .attr("class", "overlay")
    .call(zoomListener);
// Append a group which holds all nodes and which the zoom Listener can act upon.
var svgGroup = baseSvg.append("g");

function drawBoundary() {
    var boundary = svgGroup.append("rect")
        .attr("id", 'boundary')
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("stroke", "black");
}

function drawTimeline() {
    for (var i = 0; i < timeline.length; i++) {
        // Main line
        var line = svgGroup.append("line")
            .attr("id", 'timeline' + i)
            .attr("x1", i * hourSpace)
            .attr("y1", 0)
            .attr("x2", i * hourSpace)
            .attr("y2", viewerHeight)
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .attr("stroke", "gray");

        // Display time
        var text = svgGroup.append("text")
        .attr("id", 'timelinetext' + i)
        .text(timeline[i])
        .attr("x", i * hourSpace)
        .attr("y", -10)
        .style("font-size", 24)
        .style("text-anchor", "middle");
    }

    for (var i = 0; i < timeline.length - 1; i++)
        for (var j = 1; j < 6; j++) {
            // Minor line
            var line = svgGroup.append("line")
                .attr("x1", i * hourSpace + j * tenMinSpace)
                .attr("y1", 0)
                .attr("x2", i * hourSpace + j * tenMinSpace)
                .attr("y2", viewerHeight)
                .attr("fill", "none")
                .attr("stroke-width", 0.5)
                .attr("stroke", function () { return j != 3 ? "lightgray" : "lightgreen"; });
    }
}

function drawStations() {
    for (var i = 0; i < stations.length; i++) {
        // Main line
        var line = svgGroup.append("line")
            .attr("id", 'stationline' + i)
            .attr("x1", 0)
            .attr("y1", i * stationSpace)
            .attr("x2", viewerWidth)
            .attr("y2", i * stationSpace)
            .attr("fill", "none")
            .attr("stroke-width", 0.5)
            .attr("stroke", "gray");

        // Display station name
        var text = svgGroup.append("text")
        .attr("id", 'stationtext' + i)
        .text(stations[i])
        .attr("x", -10)
        .attr("y", i * stationSpace + 5)
        .style("font-size", 24)
        .style("text-anchor", "end");
    }
}

function getX(stationIndex, i) {
    var timeValue = train.time[stationIndex][i];
    var hour = Math.floor(timeValue / 100);
    var min = timeValue % 100;
    return (hour - 6) * hourSpace + min * minSpace;
}

function getY(stationIndex) {
    return stationIndex * stationSpace;
}

function drawTrain() {
    // LINES
    // Passed
    for (var i = 0; i < train.currentStation; i++) {
        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'trainlinea' + i)
            .attr("x1", getX(i, 0))
            .attr("x1-backup", getX(i, 0))
            .attr("y1", getY(i))
            .attr("x2", getX(i, 1))
            .attr("x2-backup", getX(i, 1))
            .attr("y2", getY(i))
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", "red");

        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'touch_trainlinea' + i)
            .attr("x1", getX(i, 0))
            .attr("x1-backup", getX(i, 0))
            .attr("y1", getY(i))
            .attr("x2", getX(i, 1))
            .attr("x2-backup", getX(i, 1))
            .attr("y2", getY(i))
            .attr("fill", "none")
            .attr("stroke-width", touchStroke)
            .attr("stroke", "red")
            .style("opacity", 0);

        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'trainlineb' + i)
            .attr("x1", getX(i, 1))
            .attr("x1-backup", getX(i, 1))
            .attr("y1", getY(i))
            .attr("x2", getX(i + 1, 0))
            .attr("x2-backup", getX(i + 1, 0))
            .attr("y2", getY(i + 1))
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", "red");

        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'touch_trainlineb' + i)
            .attr("x1", getX(i, 1))
            .attr("x1-backup", getX(i, 1))
            .attr("y1", getY(i))
            .attr("x2", getX(i + 1, 0))
            .attr("x2-backup", getX(i + 1, 0))
            .attr("y2", getY(i + 1))
            .attr("fill", "none")
            .attr("stroke-width", touchStroke)
            .attr("stroke", "red")
            .style("opacity", 0);
        }

    // Current
    if (train.departed) {
        var line = svgGroup.append("line")
            .attr("station-index", train.currentStation)
            .attr("id", 'trainlinea' + train.currentStation)
            .attr("x1", getX(train.currentStation, 0))
            .attr("x1-backup", getX(train.currentStation, 0))
            .attr("y1", getY(train.currentStation))
            .attr("x2", getX(train.currentStation, 1))
            .attr("x2-backup", getX(train.currentStation, 1))
            .attr("y2", getY(train.currentStation))
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", "red");

        var line = svgGroup.append("line")
            .attr("station-index", train.currentStation)
            .attr("id", 'touch_trainlinea' + train.currentStation)
            .attr("x1", getX(train.currentStation, 0))
            .attr("x1-backup", getX(train.currentStation, 0))
            .attr("y1", getY(train.currentStation))
            .attr("x2", getX(train.currentStation, 1))
            .attr("x2-backup", getX(train.currentStation, 1))
            .attr("y2", getY(train.currentStation))
            .attr("fill", "none")
            .attr("stroke-width", touchStroke)
            .attr("stroke", "red")
            .style("opacity", 0);
        }
    else {
        var line = svgGroup.append("line")
            .attr("station-index", train.currentStation)
            .attr("id", 'trainlinea' + train.currentStation)
            .attr("x1", getX(train.currentStation, 0))
            .attr("x1-backup", getX(train.currentStation, 0))
            .attr("y1", getY(train.currentStation))
            .attr("x2", getX(train.currentStation, 1))
            .attr("x2-backup", getX(train.currentStation, 1))
            .attr("y2", getY(train.currentStation))
            .attr("fill", "none")
            .attr("stroke-dasharray", ("5,2"))
            .attr("stroke-width", 1)
            .attr("stroke", "red");

        var line = svgGroup.append("line")
            .attr("station-index", train.currentStation)
            .attr("id", 'touch_trainlinea' + train.currentStation)
            .attr("x1", getX(train.currentStation, 0))
            .attr("x1-backup", getX(train.currentStation, 0))
            .attr("y1", getY(train.currentStation))
            .attr("x2", getX(train.currentStation, 1))
            .attr("x2-backup", getX(train.currentStation, 1))
            .attr("y2", getY(train.currentStation))
            .attr("fill", "none")
            .attr("stroke-dasharray", ("5,2"))
            .attr("stroke-width", touchStroke)
            .attr("stroke", "red")
            .style("opacity", 0);
        }

    if (train.currentStation < stations.length - 1) {
        var line = svgGroup.append("line")
            .attr("station-index", train.currentStation)
            .attr("id", 'trainlineb' + train.currentStation)
            .attr("x1", getX(train.currentStation, 1))
            .attr("x1-backup", getX(train.currentStation, 1))
            .attr("y1", getY(train.currentStation))
            .attr("x2", getX(train.currentStation + 1, 0))
            .attr("x2-backup", getX(train.currentStation + 1, 0))
            .attr("y2", getY(train.currentStation + 1))
            .attr("fill", "none")
            .attr("stroke-dasharray", ("5,2"))
            .attr("stroke-width", 1)
            .attr("stroke", "red");
            //.call(dragTraiLineListener)
            //.on("mouseover", mouseoverTrainLine);

        var line = svgGroup.append("line")
            .attr("station-index", train.currentStation)
            .attr("id", 'touch_trainlineb' + train.currentStation)
            .attr("x1", getX(train.currentStation, 1))
            .attr("x1-backup", getX(train.currentStation, 1))
            .attr("y1", getY(train.currentStation))
            .attr("x2", getX(train.currentStation + 1, 0))
            .attr("x2-backup", getX(train.currentStation + 1, 0))
            .attr("y2", getY(train.currentStation + 1))
            .attr("fill", "none")
            .attr("stroke-dasharray", ("5,2"))
            .attr("stroke-width", touchStroke)
            .attr("stroke", "red")
            .call(dragTraiLineListener)
            .on("mouseover", mouseoverTrainLine)
            .style("opacity", 0);
        }

    // Coming
    for (var i = train.currentStation + 1; i < stations.length; i++) {
        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'trainlinea' + i)
            .attr("x1", getX(i, 0))
            .attr("x1-backup", getX(i, 0))
            .attr("y1", getY(i))
            .attr("x2", getX(i, 1))
            .attr("x2-backup", getX(i, 1))
            .attr("y2", getY(i))
            .attr("fill", "none")
            .attr("stroke-dasharray", ("5,2"))
            .attr("stroke-width", 1)
            .attr("stroke", "red");

        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'touch_trainlinea' + i)
            .attr("x1", getX(i, 0))
            .attr("x1-backup", getX(i, 0))
            .attr("y1", getY(i))
            .attr("x2", getX(i, 1))
            .attr("x2-backup", getX(i, 1))
            .attr("y2", getY(i))
            .attr("fill", "none")
            .attr("stroke-width", touchStroke)
            .attr("stroke", "red")
            .style("opacity", 0);

        if (i == stations.length - 1)
            break;

        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'trainlineb' + i)
            .attr("x1", getX(i, 1))
            .attr("x1-backup", getX(i, 1))
            .attr("y1", getY(i))
            .attr("x2", getX(i + 1, 0))
            .attr("x2-backup", getX(i + 1, 0))
            .attr("y2", getY(i + 1))
            .attr("fill", "none")
            .attr("stroke-dasharray", ("5,2"))
            .attr("stroke-width", 1)
            .attr("stroke", "red");
            //.call(dragTraiLineListener)
            //.on("mouseover", mouseoverTrainLine);

        var line = svgGroup.append("line")
            .attr("station-index", i)
            .attr("id", 'touch_trainlineb' + i)
            .attr("x1", getX(i, 1))
            .attr("x1-backup", getX(i, 1))
            .attr("y1", getY(i))
            .attr("x2", getX(i + 1, 0))
            .attr("x2-backup", getX(i + 1, 0))
            .attr("y2", getY(i + 1))
            .attr("fill", "none")
            .attr("stroke-width", touchStroke)
            .attr("stroke", "red")
            .call(dragTraiLineListener)
            .on("mouseover", mouseoverTrainLine)
            .style("opacity", 0);
            //.style("visibility", "hidden");

    }

    // CIRCLES
    for (var i = 0; i < stations.length; i++) {
        var circle = svgGroup.append("circle")
            .attr("station-index", i)
            .attr("id", 'traincircleb' + i)
            .attr("cx", getX(i, 1))
            .attr("cx-backup", getX(i, 1))
            .attr("cy", getY(i))
            .attr("r", 5)
            .attr("fill", "#fff")
            .attr("stroke-width", 1)
            .attr("stroke", "darkred")
            .on("mouseover", mouseoverTrainCircle)
            .on("mouseout", mouseoutTrainCircle);

        var circle = svgGroup.append("circle")
            .attr("station-index", i)
            .attr("id", 'traincirclea' + i)
            .attr("cx", getX(i, 0))
            .attr("cx-backup", getX(i, 0))
            .attr("cy", getY(i))
            .attr("r", 5)
            .attr("fill", "#fff")
            .attr("stroke-width", 1)
            .attr("stroke", "darkred")
            .on("mouseover", mouseoverTrainCircle)
            .on("mouseout", mouseoutTrainCircle);
    }

    if (!train.departed)
        d3.select("#traincircleb" + train.currentStation).call(dragTrainCircleListener);

    for (var i = train.currentStation + 1; i < stations.length; i++) {
        d3.select("#traincirclea" + i).call(dragTrainCircleListener);
        d3.select("#traincircleb" + i).call(dragTrainCircleListener);
    }
}

// Mouse over train circle event
function mouseoverTrainCircle() {
    d3.select(this)
        .attr("style", "cursor:pointer")
        .attr("fill", "brown");
}

// Mouse out train circle event
function mouseoutTrainCircle() {
    d3.select(this)
        .attr("fill", "#fff");
}

// Check if selected circle is departed or arrival
function isDepartedCircle(circleID) {
    return d3.select("#" + circleID).attr("id").indexOf("traincircleb") >= 0;
}

// Convert xAxis value to hours
function xToHour(x) {
    var hour = Math.floor(timeline[0] + parseInt(x) / hourSpace);
    return (hour >= 10) ? hour : "0" + hour;
}

// Convert xAxis value to minutes
function xToMinute(x) {
    var min = Math.floor((parseInt(x) % hourSpace) / minSpace);
    return (min >= 10) ? min : "0" + min;
}

// Update content of main POP-UP
function updatePopupContent() {
    var obj = d3.select("#" + currentCircleID);
    var x = parseFloat(obj.attr("cx"));
    var htmlText = '<h2>Tàu: ' + train.name + '</h2>';
    htmlText += '<h2>Ga: ' + stations[parseInt(obj.attr("station-index"))] + '</h2>';
    if (isDepartedCircle(currentCircleID))
        htmlText += '<h2>Thời gian đi: ' + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    else
        htmlText += '<h2>Thời gian đến: ' + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    //htmlText += '<input type="text" class="form-control" id="time" placeholder="Thời gian">';
    popup.html(htmlText)
        .attr("x", x);
    popupRect.attr("x", x);
}

// Update content of main POP-UP
function updatePopupContentEnd() {
    var obj = d3.select("#" + currentCircleID);
    var x = parseFloat(obj.attr("cx"));
    var htmlText = '<h2>Tàu: ' + train.name + '</h2>';
    htmlText += '<h2>Ga: ' + stations[parseInt(obj.attr("station-index"))] + '</h2>';
    if (isDepartedCircle(currentCircleID))
        htmlText += '<h2>Thời gian đi: ' + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    else
        htmlText += '<h2>Thời gian đến: ' + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    htmlText += '<span>';
    htmlText += '<button id="cancel" type="submit" class="btn btn-success" onclick="applyChangeTime()" style="margin: 15px 0 0 15px;padding: 0px 15px 0px 15px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Đồng ý</button>';
    htmlText += '<button id="cancel" type="submit" class="btn btn-danger" onclick="cancelChangeTime()" style="margin: 15px 0 0 20px;padding: 0px 15px 0px 15px;font-family: \'Segoe UI\';font-size: 14px;font-weight:500">Hủy</button>';
    htmlText += '</span>';
    //htmlText += '<input type="text" class="form-control" id="time" placeholder="Thời gian">';
    popup.html(htmlText);
}

// Popup-Cancel changing
function applyChangeTime() {
    //var obj = d3.select("#time");
    //console.log(obj, obj.property("value"));
    console.log("Đồng ý thay đổi thời gian!");
    var obj = d3.select("#" + currentCircleID);
    var stationIndex = parseInt(obj.attr("station-index"));
    if (isDepartedCircle(currentCircleID) || stationIndex == 0)
        applyChangeFromDepartedCircle(obj);
    else
        applyChangeFromArrivalCircle(obj);
    popup.style("visibility", "hidden");
    popupRect.style("visibility", "hidden");
    currentCircleID = "";
    popupOpen = false;
}

// Popup-Cancel changing
function cancelChangeTime() {
    console.log("Hủy thay đổi thời gian!");
    var obj = d3.select("#" + currentCircleID);
    var stationIndex = parseInt(obj.attr("station-index"));
    if (isDepartedCircle(currentCircleID) || stationIndex == 0)
        discardChangeFromDepartedCircle(obj);
    else
        discardChangeFromArrivalCircle(obj);
    popup.style("visibility", "hidden");
    popupRect.style("visibility", "hidden");
    currentCircleID = "";
    popupOpen = false;
}

// Apply change from departed circle
function applyChangeFromDepartedCircle(object) {
    // Get the current station
    var stationIndex = parseInt(object.attr("station-index"));

    // Current station
    var obj = d3.select("#trainlinea" + stationIndex);
    var xx1 = parseFloat(obj.attr("x1"));
    var xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    var obj = d3.select("#touch_trainlinea" + stationIndex);
    var xx1 = parseFloat(obj.attr("x1"));
    var xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    obj = d3.select("#traincircleb" + stationIndex);
    var cx1 = parseFloat(obj.attr("cx"));
    obj.attr("cx-backup", cx1);

    // If it is the last station, there is no next line to change, then RETURN
    if (stationIndex == stations.length - 1)
        return;

    obj = d3.select("#trainlineb" + stationIndex);
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    obj = d3.select("#touch_trainlineb" + stationIndex);
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    // Middle stations
    for (var i = stationIndex + 1; i < stations.length - 1; i++) {
        obj = d3.select("#trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#touch_trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#traincirclea" + i);
        cx1 = parseFloat(obj.attr("cx"));
        obj.attr("cx-backup", cx1);

        obj = d3.select("#trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#touch_trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#traincircleb" + i);
        cx1 = parseFloat(obj.attr("cx"));
        obj.attr("cx-backup", cx1);
    }

    // End station
    obj = d3.select("#trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    obj = d3.select("#touch_trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    obj = d3.select("#traincirclea" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx"));
    obj.attr("cx-backup", cx1);

    obj = d3.select("#traincircleb" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx"));
    obj.attr("cx-backup", cx1);
}

// Apply change from departed circle
function applyChangeFromArrivalCircle(object) {
    // Get the current station
    var stationIndex = parseInt(object.attr("station-index"));

    if (stationIndex > 0) {
        // Previous station
        var obj = d3.select("#trainlineb" + (stationIndex - 1));
        var xx1 = parseFloat(obj.attr("x1"));
        var xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        var obj = d3.select("#touch_trainlineb" + (stationIndex - 1));
        var xx1 = parseFloat(obj.attr("x1"));
        var xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);
    }

    // Middle stations
    for (var i = stationIndex; i < stations.length - 1; i++) {
        obj = d3.select("#trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#touch_trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#traincirclea" + i);
        cx1 = parseFloat(obj.attr("cx"));
        obj.attr("cx-backup", cx1);

        obj = d3.select("#trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#touch_trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1"));
        xx2 = parseFloat(obj.attr("x2"));
        obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

        obj = d3.select("#traincircleb" + i);
        cx1 = parseFloat(obj.attr("cx"));
        obj.attr("cx-backup", cx1);
    }

    // End station
    obj = d3.select("#trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    obj = d3.select("#touch_trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2"));
    obj.attr("x1-backup", xx1).attr("x2-backup", xx2);

    obj = d3.select("#traincirclea" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx"));
    obj.attr("cx-backup", cx1);

    obj = d3.select("#traincircleb" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx"));
    obj.attr("cx-backup", cx1);
}

// Discard change from departed circle
function discardChangeFromDepartedCircle(object) {
    // Get the current station
    var stationIndex = parseInt(object.attr("station-index"));

    // Current station
    var obj = d3.select("#trainlinea" + stationIndex);
    var xx1 = parseFloat(obj.attr("x1"));
    var xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    var obj = d3.select("#touch_trainlinea" + stationIndex);
    var xx1 = parseFloat(obj.attr("x1"));
    var xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincircleb" + stationIndex);
    var cx1 = parseFloat(obj.attr("cx-backup"));
    obj.transition().duration(1000).attr("cx", cx1);

    // If it is the last station, there is no next line to change, then RETURN
    if (stationIndex == stations.length - 1)
        return;

    obj = d3.select("#trainlineb" + stationIndex);
    xx1 = parseFloat(obj.attr("x1-backup"));
    xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlineb" + stationIndex);
    xx1 = parseFloat(obj.attr("x1-backup"));
    xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    // Middle stations
    for (var i = stationIndex + 1; i < stations.length - 1; i++) {
        obj = d3.select("#trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincirclea" + i);
        cx1 = parseFloat(obj.attr("cx-backup"));
        obj.transition().duration(1000).attr("cx", cx1);

        obj = d3.select("#trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincircleb" + i);
        cx1 = parseFloat(obj.attr("cx-backup"));
        obj.transition().duration(1000).attr("cx", cx1);
    }

    // End station
    obj = d3.select("#trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1-backup"));
    xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1-backup"));
    xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincirclea" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx-backup"));
    obj.transition().duration(1000).attr("cx", cx1);

    obj = d3.select("#traincircleb" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx-backup"));
    obj.transition().duration(1000).attr("cx", cx1);
}

// Discard change from departed circle
function discardChangeFromArrivalCircle(object) {
    // Get the current station
    var stationIndex = parseInt(object.attr("station-index"));

    if (stationIndex > 0) {
        // Previous station
        var obj = d3.select("#trainlineb" + (stationIndex - 1));
        var xx1 = parseFloat(obj.attr("x1"));
        var xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        var obj = d3.select("#touch_trainlineb" + (stationIndex - 1));
        var xx1 = parseFloat(obj.attr("x1"));
        var xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);
    }

    // Middle stations
    for (var i = stationIndex; i < stations.length - 1; i++) {
        obj = d3.select("#trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincirclea" + i);
        cx1 = parseFloat(obj.attr("cx-backup"));
        obj.transition().duration(1000).attr("cx", cx1);

        obj = d3.select("#trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1-backup"));
        xx2 = parseFloat(obj.attr("x2-backup"));
        obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincircleb" + i);
        cx1 = parseFloat(obj.attr("cx-backup"));
        obj.transition().duration(1000).attr("cx", cx1);
    }

    // End station
    obj = d3.select("#trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1-backup"));
    xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1-backup"));
    xx2 = parseFloat(obj.attr("x2-backup"));
    obj.transition().duration(1000).attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincirclea" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx-backup"));
    obj.transition().duration(1000).attr("cx", cx1);

    obj = d3.select("#traincircleb" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx-backup"));
    obj.transition().duration(1000).attr("cx", cx1);
}

// Drag train circle
var dragTrainCircleListener = d3.behavior.drag()
    .on("dragstart", function () {
        var circleID = d3.select(this).attr("id");
        console.log(circleID);
        if (popupOpen && circleID != currentCircleID)
            return;
        console.log("dragstart");
        currentCircleID = circleID;
        popupOpen = true;
        var stationIndex = parseInt(d3.select(this).attr("station-index"));
        if (isDepartedCircle(currentCircleID) || stationIndex == 0)
            dragStartX = parseFloat(d3.select("#traincirclea" + stationIndex).attr("cx"));
        else
            dragStartX = parseFloat(d3.select("#traincircleb" + (stationIndex - 1)).attr("cx"));

        popup.style("visibility", "visible")
            .attr("x", parseFloat(d3.select(this).attr("cx")))
            .attr("y", parseFloat(d3.select(this).attr("cy")) - popupHeight - 20)
            .attr("class", "popup");
        popupRect.style("visibility", "visible")
            .attr("x", parseFloat(d3.select(this).attr("cx")))
            .attr("y", parseFloat(d3.select(this).attr("cy")) - popupHeight - 20)
            .attr("width", popupWidth + 1)
            .attr("height", popupHeight + 1)
        updatePopupContent();
        d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function () {
        var circleID = d3.select(this).attr("id");
        console.log(circleID);
        if (popupOpen && circleID != currentCircleID)
            return;
        if (isDepartedCircle(currentCircleID))
            changeFromDepartedCircle(this, d3.event.dx);
        else
            changeFromArrivalCircle(this, d3.event.dx);
        updatePopupContent();
    })
    .on("dragend", function () {
        var circleID = d3.select(this).attr("id");
        console.log(circleID);
        if (popupOpen && circleID != currentCircleID)
            return;
        // If there is no change, no need to confirm, automatically close pop-up
        if (d3.select(this).attr("cx") == d3.select(this).attr("cx-backup")) {
            popup.style("visibility", "hidden");
            popupRect.style("visibility", "hidden");
            popupOpen = false;
        }
        popup
            .attr("class", "popupend")
            .attr("y", parseFloat(d3.select(this).attr("cy")) - popupHeightEnd - 20);
        popupRect
            .attr("y", parseFloat(d3.select(this).attr("cy")) - popupHeightEnd - 20)
            .attr("width", popupWidthEnd + 1)
            .attr("height", popupHeightEnd + 1)
        updatePopupContentEnd();
        console.log("dragend");
    });

function changeFromDepartedCircle(object, dx) {
    // Get the current station
    var stationIndex = parseInt(d3.select(object).attr("station-index"));

    // Do not allow to move the line backward
    dx = parseFloat(dx);
    var newX = parseFloat(d3.select("#traincircleb" + stationIndex).attr("cx"));
    if (newX + dx < dragStartX)
        dx = dragStartX - newX;

    // Current station
    var obj = d3.select("#trainlinea" + stationIndex);
    var xx1 = parseFloat(obj.attr("x1"));
    var xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    var obj = d3.select("#touch_trainlinea" + stationIndex);
    var xx1 = parseFloat(obj.attr("x1"));
    var xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincircleb" + stationIndex);
    var cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);

    // If it is the last station, there is no next line to change, then RETURN
    if (stationIndex == stations.length - 1)
        return;

    obj = d3.select("#trainlineb" + stationIndex);
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlineb" + stationIndex);
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    // Middle stations
    for (var i = stationIndex + 1; i < stations.length - 1; i++) {
        obj = d3.select("#trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincirclea" + i);
        cx1 = parseFloat(obj.attr("cx")) + dx;
        obj.attr("cx", cx1);

        obj = d3.select("#trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincircleb" + i);
        cx1 = parseFloat(obj.attr("cx")) + dx;
        obj.attr("cx", cx1);
    }

    // End station
    obj = d3.select("#trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincirclea" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);

    obj = d3.select("#traincircleb" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);
}

function changeFromArrivalCircle(object, dx) {
    // Get the current station
    var stationIndex = parseInt(d3.select(object).attr("station-index"));

    // Do not allow to move the line backward
    dx = parseFloat(dx);
    var newX = parseFloat(d3.select("#traincirclea" + stationIndex).attr("cx"));
    if (newX + dx < dragStartX)
        dx = dragStartX - newX;

    if (stationIndex > 0) {
        // Previous station
        var obj = d3.select("#trainlineb" + (stationIndex - 1));
        var xx1 = parseFloat(obj.attr("x1"));
        var xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        var obj = d3.select("#touch_trainlineb" + (stationIndex - 1));
        var xx1 = parseFloat(obj.attr("x1"));
        var xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);
    }

    // Middle stations
    for (var i = stationIndex; i < stations.length - 1; i++) {
        obj = d3.select("#trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincirclea" + i);
        cx1 = parseFloat(obj.attr("cx")) + dx;
        obj.attr("cx", cx1);

        obj = d3.select("#trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincircleb" + i);
        cx1 = parseFloat(obj.attr("cx")) + dx;
        obj.attr("cx", cx1);
    }

    // End station
    obj = d3.select("#trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincirclea" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);

    obj = d3.select("#traincircleb" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);
}

// Mouse over train line event
function mouseoverTrainLine() {
    d3.select(this).attr("style", "cursor:pointer; opacity: 0");
}

// Drag train line
var dragTraiLineListener = d3.behavior.drag()
    .on("dragstart", function () {
        var stationIndex = parseInt(d3.select(this).attr("station-index"));
        circleID = "traincircleb" + stationIndex;
        if (popupOpen && circleID != currentCircleID)
            return;
        currentCircleID = circleID;
        popupOpen = true;
        dragStartX = parseFloat(d3.select("#trainlinea" + stationIndex).attr("x1"));
        popup.style("visibility", "visible")
            .attr("x", parseFloat(d3.select("#" + currentCircleID).attr("cx")))
            .attr("y", parseFloat(d3.select("#" + currentCircleID).attr("cy")) - popupHeight - 20)
            .attr("class", "popup");
        popupRect.style("visibility", "visible")
            .attr("x", parseFloat(d3.select("#" + currentCircleID).attr("cx")))
            .attr("y", parseFloat(d3.select("#" + currentCircleID).attr("cy")) - popupHeight - 20)
            .attr("width", popupWidth + 1)
            .attr("height", popupHeight + 1);
        updatePopupContent();
        console.log("dragstart", dragStartX);
        d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function (d) {
        var stationIndex = parseInt(d3.select(this).attr("station-index"));
        circleID = "traincircleb" + stationIndex;
        if (popupOpen && circleID != currentCircleID)
            return;
        changeAttachedLines(this, d3.event.dx);
        updatePopupContent();
    })
    .on("dragend", function () {
        var stationIndex = parseInt(d3.select(this).attr("station-index"));
        circleID = "traincircleb" + stationIndex;
        if (popupOpen && circleID != currentCircleID)
            return;
        // If there is no change, no need to confirm, automatically close pop-up
        if (d3.select("#" + circleID).attr("cx") == d3.select("#" + circleID).attr("cx-backup")) {
            popup.style("visibility", "hidden");
            popupRect.style("visibility", "hidden");
            popupOpen = false;
        }
        popup.attr("y", parseFloat(d3.select("#" + currentCircleID).attr("cy")) - popupHeightEnd - 20)
            .attr("class", "popupend");
        popupRect.attr("y", parseFloat(d3.select("#" + currentCircleID).attr("cy")) - popupHeightEnd - 20)
            .attr("width", popupWidthEnd + 1)
            .attr("height", popupHeightEnd + 1);
        updatePopupContentEnd();
        console.log("dragend");
    });

function changeAttachedLines(object, dx) {
    // Get the current station
    var stationIndex = parseInt(d3.select(object).attr("station-index"));

    // Do not allow to move the line backward
    dx = parseFloat(dx);
    var newX = parseFloat(d3.select("#trainlineb" + stationIndex).attr("x1"));
    if (newX + dx < dragStartX)
        dx = dragStartX - newX;

    // Current station
    var obj = d3.select("#trainlineb" + stationIndex);
    var xx1 = parseFloat(obj.attr("x1")) + dx;
    var xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlineb" + stationIndex);
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincircleb" + stationIndex);
    var cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);

    obj = d3.select("#trainlinea" + stationIndex);
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlinea" + stationIndex);
    xx1 = parseFloat(obj.attr("x1"));
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    // Middle stations
    for (var i = stationIndex + 1; i < stations.length - 1; i++) {
        obj = d3.select("#trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlinea" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincirclea" + i);
        cx1 = parseFloat(obj.attr("cx")) + dx;
        obj.attr("cx", cx1);

        obj = d3.select("#trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#touch_trainlineb" + i);
        xx1 = parseFloat(obj.attr("x1")) + dx;
        xx2 = parseFloat(obj.attr("x2")) + dx;
        obj.attr("x1", xx1).attr("x2", xx2);

        obj = d3.select("#traincircleb" + i);
        cx1 = parseFloat(obj.attr("cx")) + dx;
        obj.attr("cx", cx1);
    }

    // End station
    obj = d3.select("#trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#touch_trainlinea" + (stations.length - 1));
    xx1 = parseFloat(obj.attr("x1")) + dx;
    xx2 = parseFloat(obj.attr("x2")) + dx;
    obj.attr("x1", xx1).attr("x2", xx2);

    obj = d3.select("#traincirclea" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);

    obj = d3.select("#traincircleb" + (stations.length - 1));
    cx1 = parseFloat(obj.attr("cx")) + dx;
    obj.attr("cx", cx1);
}

// MAIN

drawBoundary();

drawTimeline();

drawStations();

drawTrain();

var popupRect = svgGroup
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", popupWidth + 1)
    .attr("height", popupHeight + 1)
    .style("opacity", 0.8)
    .attr("fill", "#610B0B")
    .style("visibility", "hidden");

var popup = svgGroup
    .append("foreignObject")
    .attr("class", "popup")
    .attr("x", 0)
    .attr("y", 0)
    .style("visibility", "hidden");

console.log(svgGroup);
