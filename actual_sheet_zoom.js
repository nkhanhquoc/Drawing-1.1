var times = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6];
//var times = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

var stations = [
    { id: 100, name: 'VINH', y: 0, bold: true, expand: false, newoffset: false },             // 0
    { id: 100, name: 'Yên Xuân', y: 0, bold: false, expand: false, newoffset: false },        // 1
    { id: 100, name: 'Yên Trung', y: 0, bold: false, expand: false, newoffset: false },       // 2
    { id: 100, name: 'Đức Lạc', y: 0, bold: false, expand: false, newoffset: false },         // 3
    { id: 100, name: 'Yên Duệ', y: 0, bold: false, expand: false, newoffset: false },         // 4
    { id: 100, name: 'Hòa Duyệt', y: 0, bold: false, expand: false, newoffset: false },       // 5
    { id: 100, name: 'Thanh Luyện', y: 0, bold: false, expand: false, newoffset: false },     // 6
    { id: 100, name: 'Chu Lễ', y: 0, bold: false, expand: false, newoffset: false },          // 7
    { id: 100, name: 'Hương Phố', y: 0, bold: false, expand: false, newoffset: false },       // 8
    { id: 100, name: 'Phúc Trạch', y: 0, bold: true, expand: false, newoffset: false },       // 9
    { id: 100, name: 'La Khê', y: 0, bold: false, expand: false, newoffset: false },          // 10
    { id: 100, name: 'Tân Ấp', y: 0, bold: false, expand: false, newoffset: false },          // 11
    { id: 100, name: 'Đồng Chuối', y: 0, bold: false, expand: false, newoffset: false },      // 12
    { id: 100, name: 'Kim Lũ', y: 0, bold: true, expand: false, newoffset: false },           // 13
    { id: 100, name: 'Đồng Lê', y: 0, bold: false, expand: false, newoffset: false },         // 14
    { id: 100, name: 'Ngọc Lâm', y: 0, bold: false, expand: false, newoffset: false },        // 15
    { id: 100, name: 'Minh Cầm (T)', y: 0, bold: false, expand: false, newoffset: false },    // 16
    { id: 100, name: 'Lạc Sơn', y: 0, bold: false, expand: false, newoffset: false },         // 17
    { id: 100, name: 'Lệ Sơn', y: 0, bold: false, expand: false, newoffset: false },          // 18
    { id: 100, name: 'Lạc Giao (T)', y: 0, bold: false, expand: false, newoffset: false },    // 19
    { id: 100, name: 'Minh Lễ', y: 0, bold: false, expand: false, newoffset: false },         // 20
    { id: 100, name: 'Ngân Sơn', y: 0, bold: false, expand: false, newoffset: false },        // 21
    { id: 100, name: 'Thọ Lộc', y: 0, bold: false, expand: false, newoffset: false },         // 22
    { id: 100, name: 'Hoàn Lão', y: 0, bold: false, expand: false, newoffset: false },        // 23
    { id: 100, name: 'Phúc Tự', y: 0, bold: false, expand: false, newoffset: false },         // 24
    { id: 100, name: 'ĐỒNG HỚI', y: 0, bold: true, expand: false, newoffset: false }];        // 25

var viewerWidth = 7200;
var viewerHeight = 3600;
var hourSpace = viewerWidth / (times.length - 1);
var minSpace = viewerWidth / ((times.length - 1) * 60)
var tenMinSpace = viewerWidth / ((times.length - 1) * 6);
var stationSpace = viewerHeight / (stations.length - 1);
var horizontalSpace = hourSpace / 6;
var verticalSpace = (stationSpace * 2) / 5;
var currentTranslate = [0, 0];
var currentScale = 1;
var lastScale = 1;

// TRAIN DATA
statusType = { ARRIVAL: 0, DEPARTED: 1, CREATED: 2, DISSOLVED: 3 };
dayType = { YESTERDAY: -1, TODAY: 0, TOMORROW: 1 };
trainType = { KHACH: 0, HANG: 1, HONHOP: 2 };
trainDirection = { UP: 0, DOWN: 1 };
changeType = { ARRIVAL: 0, DEPARTED: 1, CREATED: 2, PASS_THROUGH: 3 };
timeChangingText = [['Đến: ', 'Đi: ', 'Khởi hành: ', 'Thông qua: '], // Actual
    ['Dự kiến đến: ', 'Dự kiến đi: ', 'Dự kiến khởi hành: ', 'Dự kiến thông qua: ']]; // Planned

confirmLabel = ['Xác nhận đến', 'Xác nhận đi', 'Xác nhận khởi hành', 'Xác nhận thông qua']; // Confirm

trainColor = [["red", "blue", "purple"],    // Actual
    ["#ffb3b3", "#b3b3ff", "pupple"]];      // Planned
hourColor = [["black", "black", "black"],    // Actual
    ["lightgray", "lightgray", "lightgray"]];      // Planned
trains = [
    {
        id: 100, name: 'H1', type: trainType.HANG,
        inDirection: trainDirection.DOWN, inStatus: statusType.CREATED, inSpecial: false,
        outDirection: trainDirection.DOWN, outStatus: statusType.DISSOLVED, outSpecial: false,
        currStatus: statusType.CREATED, currStopIndex: -1,
        stops: [
            { stationIndex: 0, arrivalDay: dayType.YESTERDAY, departedDay: dayType.TODAY, arrivalTime: 1749, departedTime: 1824 },
            { stationIndex: 1, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1839, departedTime: 1839 },
            { stationIndex: 2, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1850, departedTime: 1850 },
            { stationIndex: 3, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1856, departedTime: 1856 },
            { stationIndex: 4, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1905, departedTime: 1905 },
            { stationIndex: 5, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1916, departedTime: 1927 },
            { stationIndex: 6, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1945, departedTime: 1945 },
            { stationIndex: 7, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1958, departedTime: 1958 },
            { stationIndex: 8, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2003, departedTime: 2003 },
            { stationIndex: 9, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2015, departedTime: 2025 },
            { stationIndex: 10, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2037, departedTime: 2037 },
            { stationIndex: 11, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2046, departedTime: 2059 },
            { stationIndex: 12, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2116, departedTime: 2232 },
            { stationIndex: 13, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2259, departedTime: 2304 },
            { stationIndex: 14, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2316, departedTime: 2316 },
            { stationIndex: 15, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2332, departedTime: 2332 },
            { stationIndex: 17, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2345, departedTime: 2345 },
            { stationIndex: 18, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2359, departedTime: 2359 },
            { stationIndex: 20, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 16, departedTime: 16 },
            { stationIndex: 21, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 25, departedTime: 25 },
            { stationIndex: 22, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 39, departedTime: 39 },
            { stationIndex: 23, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 49, departedTime: 49 },
            { stationIndex: 24, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 56, departedTime: 104 },
            { stationIndex: 25, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 129, departedTime: 209 }]
    },
    {
        id: 101, name: 'SE4', type: trainType.KHACH,
        inDirection: trainDirection.UP, inStatus: statusType.ARRIVAL, inSpecial: false,
        outDirection: trainDirection.UP, outStatus: statusType.DEPARTED, outSpecial: false,
        currStatus: statusType.DEPARTED, currStopIndex: 3,
        stops: [
            { stationIndex: 25, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1937, departedTime: 1951 },
            { stationIndex: 23, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2005, departedTime: 2005 },
            { stationIndex: 22, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2016, departedTime: 2016 },
            { stationIndex: 21, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2028, departedTime: 2028 },
            { stationIndex: 20, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2035, departedTime: 2035 },
            { stationIndex: 18, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2048, departedTime: 2048 },
            { stationIndex: 17, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2058, departedTime: 2058 },
            { stationIndex: 15, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2108, departedTime: 2108 },
            { stationIndex: 14, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2123, departedTime: 2123 },
            { stationIndex: 13, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2131, departedTime: 2131 },
            { stationIndex: 11, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2159, departedTime: 2159 },
            { stationIndex: 10, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2204, departedTime: 2204 },
            { stationIndex: 9, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2212, departedTime: 2212 },
            { stationIndex: 8, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2222, departedTime: 2225 },
            { stationIndex: 7, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2231, departedTime: 2231 },
            { stationIndex: 6, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2243, departedTime: 2243 },
            { stationIndex: 5, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2258, departedTime: 2258 },
            { stationIndex: 4, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2305, departedTime: 2305 },
            { stationIndex: 3, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2313, departedTime: 2313 },
            { stationIndex: 2, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2319, departedTime: 2322 },
            { stationIndex: 1, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2333, departedTime: 2333 },
            { stationIndex: 0, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2346, departedTime: 2353 }]
    },
    {
        id: 102, name: 'H4', type: trainType.HANG,
        inDirection: trainDirection.UP, inStatus: statusType.ARRIVAL, inSpecial: false,
        outDirection: trainDirection.UP, outStatus: statusType.DEPARTED, outSpecial: false,
        currStatus: statusType.ARRIVAL, currStopIndex: -1,
        stops: [
            { stationIndex: 11, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1807, departedTime: 1807 },
            { stationIndex: 10, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1815, departedTime: 1837 },
            { stationIndex: 9, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1848, departedTime: 1848 },
            { stationIndex: 8, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1907, departedTime: 1907 },
            { stationIndex: 7, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1912, departedTime: 1912 },
            { stationIndex: 6, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 1928, departedTime: 1948 },
            { stationIndex: 5, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2006, departedTime: 2006 },
            { stationIndex: 4, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2015, departedTime: 2015 },
            { stationIndex: 3, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2022, departedTime: 2030 },
            { stationIndex: 2, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2038, departedTime: 2038 },
            { stationIndex: 1, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2050, departedTime: 2050 },
            { stationIndex: 0, arrivalDay: dayType.TODAY, departedDay: dayType.TODAY, arrivalTime: 2105, departedTime: 2208 }]
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
var popupBackground;
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

// MENU
var menuIcon;
var menuBackground;
var menuHtml;
var menuOpen = false;
// GRAPHIC OBJECTS
var minScale = 0.15;
var maxScale = 2;

// Station names
var stationNames = [];
var stationNameSize = 14;
var stationNameLeftMargin = 30;

// Station lines
var stationLines = [];
var stationBoldLineStrokeWidth = 1;
var stationThinLineStrokeWidth = 0.5;

// Time names
var timeNames = [];
var timeNameSize = 14;
var timeNameUpMargin = 30;


// Time lines
var timeLines = [];
var timeBoldLineStrokeWidth = 1;
var timeThinLineStrokeWidth = 0.5;

// Train lines
var trainLines = [];
var trainBoldLineStrokeWidth = 2;
var trainThinLineStrokeWidth = 1;

var trainCircles = [];
var trainCircleR = 4;
var trainCircleFocusedR = 10;
var trainCircleStrokeWidth = 1;
var trainCircleScaleLimit = 0.3;

// Train names and hour texts
var trainNames = [];
var trainNameSize = 14;

var trainHourTexts = [];
var trainHourTextSize = 16;
var trainHourTextScaleLimit = 0.3;

function zoom() {
    //console.log("Zoom scale: ", d3.event.scale, d3.event.translate);

    layer0.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer1a.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer2a.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    layer3.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    //layer4.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

    lastScale = currentScale;
    currentScale = d3.event.scale;
    currentTranslate = d3.event.translate;

    // Adjust all objects attributes accordint to new scale
    updateZooming();

}

function updateZooming() {
    if ((popupOpen || editting) && currentCircle != "" && currentCircle[0][0] != null) {
        if (!editting)
            updatePopupCircleSize(currentCircle);
        else
            updatePopupCircleSizeEnd(currentCircle);
    }
    //console.log("Old scale: ", lastScale);
    //console.log("New scale: ", currentScale);

    var zoomingRatio = lastScale/ currentScale;

    // Update Stations
    stationNames.forEach(function (name) {
        var leftMargin = -parseFloat(name.attr("x"));
        var nameSize = parseFloat(name.style("font-size"));
        name.style("font-size", nameSize * zoomingRatio)
                .attr("x", -leftMargin * zoomingRatio);
    });

    stationLines.forEach(function (line) {
        var strokeWidth = parseFloat(line.attr("stroke-width"));
        line.attr("stroke-width", strokeWidth * zoomingRatio);
    });

    // Update times
    timeNames.forEach(function (name) {
        var upMargin = -parseFloat(name.attr("y"));
        var nameSize = parseFloat(name.style("font-size"));
        name.style("font-size", nameSize * zoomingRatio)
                .attr("y", -upMargin * zoomingRatio);
    });

    timeLines.forEach(function (line) {
        var strokeWidth = parseFloat(line.attr("stroke-width"));
        line.attr("stroke-width", strokeWidth * zoomingRatio);
    });

    // Update trains
    trainLines.forEach(function (line) {
        var strokeWidth = parseFloat(line.attr("stroke-width"));
        line.attr("stroke-width", strokeWidth * zoomingRatio);
    });

    trainCircles.forEach(function (circle) {
        var r = parseFloat(circle.attr("r"));
        var strokeWidth = parseFloat(circle.attr("stroke-width"));
        circle.attr("r", r * zoomingRatio)
            .attr("stroke-width", strokeWidth * zoomingRatio)
            .style("visibility", currentScale >= trainCircleScaleLimit ? "visible" : "hidden");
    });

    trainNames.forEach(function (name) {
        var nameSize = parseFloat(name.style("font-size"));
        name.style("font-size", nameSize * zoomingRatio);
    });

    trainHourTexts.forEach(function (name) {
        var nameSize = parseFloat(name.style("font-size"));
        var k = 1;
        if (currentScale >= trainHourTextScaleLimit && lastScale < trainHourTextScaleLimit)
            k = 2;
        if (currentScale < trainHourTextScaleLimit && lastScale >= trainHourTextScaleLimit)
            k = 0.5;

        name.style("font-size", nameSize * zoomingRatio * k);
    });


}

// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
var zoomListener = d3.behavior.zoom().scaleExtent([minScale, maxScale]).on("zoom", zoom);

// define the baseSvg, attaching a class for styling and the zoomListener
var baseSvg = d3.select("#main-container").append("svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight)
    .attr("class", "overlay")
    .call(zoomListener);

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
    for (var i = 0; i < times.length; i++) {
        // Main line
        var line = layer0.append("line")
            .attr("id", 'timeline' + i)
            .attr("x1", i * hourSpace)
            .attr("y1", 0)
            .attr("x2", i * hourSpace)
            .attr("y2", viewerHeight)
            .attr("fill", "none")
            .attr("stroke-width", timeBoldLineStrokeWidth) // 1
            .attr("stroke", "gray");

        timeLines.push(line);

        // Display time
        var text = layer0.append("text")
            .attr("id", 'timelinetext' + i)
            .text(times[i])
            .attr("x", i * hourSpace)
            .attr("y", -timeNameUpMargin)
            .style("font-size", timeNameSize) //20
            .style("font-family", "Segoe UI")
            .style("text-anchor", "middle");

        timeNames.push(text);
    }

    for (var i = 0; i < times.length - 1; i++)
        for (var j = 1; j < 6; j++) {
            // Minor line
            var line = layer0.append("line")
                .attr("x1", i * hourSpace + j * tenMinSpace)
                .attr("y1", 0)
                .attr("x2", i * hourSpace + j * tenMinSpace)
                .attr("y2", viewerHeight)
                .attr("fill", "none")
                .attr("stroke-width", timeThinLineStrokeWidth) // 0.5
                .attr("stroke", function () { return j != 3 ? "lightgray" : "lightgreen"; });

            timeLines.push(line);
        }
}

// Set Y-position for all stations, it can be change in the future
function setStationsY() {
    for (var i = 0; i < stations.length; i++) {
        stations[i].y = i * stationSpace;
    }
}

// Draw stations: name, line
function drawStations() {
    for (var i = 0; i < stations.length; i++) {
        // Main line
        var line = layer0.append("line")
            .attr("id", 'stationline' + i)
            .attr("x1", 0)
            .attr("y1", stations[i].y)
            .attr("x2", viewerWidth)
            .attr("y2", stations[i].y)
            .attr("fill", "none")
            .attr("stroke-width", stations[i].bold ? stationBoldLineStrokeWidth : stationThinLineStrokeWidth) // 1 : 0.5
            .attr("stroke", "lightgray");

        stationLines.push(line);

        // Display station name
        var text = layer0.append("text")
            .attr("id", 'stationtext' + i)
            .text(stations[i].name)
            .attr("x", -stationNameLeftMargin)
            .attr("y", stations[i].y)
            .style("font-size", stationNameSize) // 20
            .style("font-family", "Segoe UI")
            .style("font-weight", stations[i].bold ? 500 : 250)
            .style("alignment-baseline", "middle")
            .style("text-anchor", "end");

        stationNames.push(text);
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
            .attr("stroke-width", colorType == 0 ? trainBoldLineStrokeWidth : trainThinLineStrokeWidth)
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1);

        // Line can be dragged and dropped
        if (prefix == 'trainline_2')
            line
            .on("mouseover", mouseoverTrainLine)
            .on("mouseout", mouseoutTrainLine)
            .call(dragTrainLineListener);

        trainLines.push(line);
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
            .attr("stroke-width", colorType == 0 ? trainBoldLineStrokeWidth * (1 / currentScale) : trainThinLineStrokeWidth * (1 / currentScale))
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1);
    }
}

// Mouse over train line event
function mouseoverTrainLine() {
    var lineID = d3.select(this).attr("id");

    var circleID = lineID.replace("line", "circle");
    var circle = d3.select("#" + circleID);

    if ((popupOpen && circleID != currentCircleID) || editting)
        return;

    console.log("MOUSE OVER LINE");
    d3.select(this).style("cursor", "pointer");

    currentCircleID = circleID;
    currentCircle = circle;

    currentCircle
        .transition().duration(200)
        .style("cursor", "pointer")
        .attr("r", trainCircleFocusedR * (1 / currentScale));

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
        .attr("r", trainCircleR * (1 / currentScale));
    if (!editting) {
        popup.style("visibility", "hidden");
        popupBackground.style("visibility", "hidden");
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
            .attr("r", trainCircleR * (1 / currentScale));
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
            popupBackground.style("visibility", "hidden");
            editting = false;
        }
        console.log("dragend");
    });

// Draw train lines
function drawTrainLines(k) {
    var train = trains[k];
    var colorType = 0;
    if (train.currStopIndex == -1)
        colorType = 1;
    // Draw first stop
    var currStop = train.stops[0];
    var currY = stations[currStop.stationIndex].y;
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
                    dy, "start", train.name, colorType);
            }
            if (train.currStopIndex == 0 && train.currStatus == statusType.ARRIVAL)
                colorType = 1;
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
                    dy, "start", train.name, colorType);
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
                    dy, "middle", train.name, colorType);
            }
            break;
    }
    if (train.stops.length > 1) {
        if (train.currStopIndex == 0 && train.currStatus == statusType.DEPARTED)
            colorType = 1;
        var nextStop = train.stops[1];
        var nextY = stations[nextStop.stationIndex].y;
        appendLine(layer1a, 'trainline_2', k, 0,
            getX(currStop.departedTime, currStop.departedDay), currY,
            getX(nextStop.arrivalTime, nextStop.arrivalDay), nextY,
            colorType);
    }

    // Draw middle stops
    for (var i = 1; i < train.stops.length - 1; i++) {
        var currStop = train.stops[i];
        if (i == train.currStopIndex && train.currStatus == statusType.ARRIVAL)
            colorType = 1;
        var currY = stations[currStop.stationIndex].y;
        appendLine(layer1, 'trainline_1', k, i,
            getX(currStop.arrivalTime, currStop.arrivalDay), currY,
            getX(currStop.departedTime, currStop.departedDay), currY,
            colorType);

        if (i == train.currStopIndex && train.currStatus == statusType.DEPARTED)
            colorType = 1;
        var nextStop = train.stops[i + 1];
        var nextY = stations[nextStop.stationIndex].y;
        appendLine(layer1a, 'trainline_2', k, i,
            getX(currStop.departedTime, currStop.departedDay), currY,
            getX(nextStop.arrivalTime, nextStop.arrivalDay), nextY,
            colorType);
    }

    if (train.stops.length - 1 == train.currStopIndex && train.currStatus == statusType.ARRIVAL && train.outStatus != statusType.DISSOLVED)
        colorType = 1;
    // Draw last stop
    var currStop = train.stops[train.stops.length - 1];
    var currY = stations[currStop.stationIndex].y;
    var lineaY = train.outDirection == trainDirection.DOWN ? currY + verticalSpace : currY - verticalSpace;
    var dissolvedY = train.outDirection == trainDirection.DOWN ? currY + 2 * verticalSpace : currY - 2 * verticalSpace;
    switch (train.outStatus) {
        case statusType.DEPARTED:
            appendLine(layer1, 'trainline_1', k, train.stops.length - 1,
                getX(currStop.arrivalTime, currStop.arrivalDay), currY,
                getX(currStop.departedTime, currStop.departedDay), currY,
                colorType);

            if (!train.outSpecial) {
                appendLine(layer1a, 'trainline_b', k, train.stops.length - 1,
                    getX(currStop.departedTime, currStop.departedDay), currY,
                    getX(currStop.departedTime, currStop.departedDay) + horizontalSpace / 2, lineaY,
                    colorType);

                appendLine(layer1a, 'trainline_a', k, train.stops.length - 1,
                    getX(currStop.departedTime, currStop.departedDay) + horizontalSpace / 2, lineaY,
                    getX(currStop.departedTime, currStop.departedDay) + horizontalSpace, lineaY,
                    colorType);

                // Train name at end
                appendTextName(layer3, "trainname_out", k, train.stops.length - 1, getX(currStop.departedTime, currStop.departedDay) + horizontalSpace, lineaY - dy,
                    -dy, "end", train.name, colorType);
            }
            break;

        case statusType.DISSOLVED:
            if (!train.outSpecial) {
                appendLine(layer1a, 'trainline_b', k, train.stops.length - 1,
                getX(currStop.arrivalTime, currStop.arrivalDay), currY,
                getX(currStop.arrivalTime, currStop.arrivalDay), dissolvedY,
                colorType);

                appendLine(layer1a, 'trainline_a', k, train.stops.length - 1,
                    getX(currStop.arrivalTime, currStop.arrivalDay) - horizontalSpace / 2, lineaY,
                    getX(currStop.arrivalTime, currStop.arrivalDay) + horizontalSpace / 2, lineaY,
                    colorType);

                // Train name at end
                appendTextName(layer3, "trainname_out", k, train.stops.length - 1, getX(currStop.arrivalTime, currStop.arrivalDay), dissolvedY - dy,
                    -dy, "middle", train.name, colorType);
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
        if (isDepartedCircle(circleID)) {
            if (trains[currentTrainIndex].stops[currentStopIndex].arrivalTime == trains[currentTrainIndex].stops[currentStopIndex].departedTime) {// Tàu đến: Đi hoặc Thông qua
                currentChange = changeType.PASS_THROUGH;
                dragMinX = parseFloat(d3.select("#traincircle_2_" + currentTrainIndex + "_" + (currentStopIndex - 1)).attr("cx"));

                // Define objects which would be changed
                for (var i = currentStopIndex; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }

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
                currentCircleObjs.push(currentCircle);
                for (var i = currentStopIndex + 1; i < trains[currentTrainIndex].stops.length; i++) {
                    pushChangingList(currentCircleObjs, "#traincircle_1_" + currentTrainIndex + "_" + i);
                    pushChangingList(currentCircleObjs, "#traincircle_2_" + currentTrainIndex + "_" + i);
                }

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
    var hour = (Math.floor(times[0] + parseInt(x) / hourSpace)) % 24;
    return (hour >= 10) ? hour : "0" + hour;
}

// Convert xAxis value to minutes
function xToMinute(x) {
    //x = x - (Math.floor(x / hourSpace) * hourSpace);
    var min = Math.round(x / minSpace) % 60;
    return (min >= 10) ? min : "0" + min;
}

// Define the current direction UP/DOWN of a train at a stop
function currentDirection() {
    if (currentStopIndex < trains[currentTrainIndex].stops.length)
        return (trains[currentTrainIndex].stops[currentStopIndex].stationIndex < trains[currentTrainIndex].stops[currentStopIndex + 1].stationIndex) ? 'down' : 'up';
    else
        if (currentStopIndex > 0)
            return (trains[currentTrainIndex].stops[currentStopIndex].stationIndex > trains[currentTrainIndex].stops[currentStopIndex - 1].stationIndex) ? 'down' : 'up';
    return 'up';
}

// Update size of a popup circle 
function updatePopupCircleSize(circle) {
    var transCx = parseFloat(circle.attr("cx")) * currentScale + currentTranslate[0];
    var transCy = parseFloat(circle.attr("cy")) * currentScale + currentTranslate[1];

    var dx = -popupWidth - 5;
    var dy = currentDirection() == 'up' ? -popupHeight - 25 : 25;

    popup.style("visibility", "visible")
        .attr("x", transCx + dx)
        .attr("y", transCy + dy)
        .attr("class", "popup");

    console.log("Toa do: ", transCx - popupWidth);

    var points = '';
    if (currentDirection() == 'up') {
        points = ' ' + (transCx + dx) + ',' + (transCy + dy);
        points += ' ' + (transCx + dx) + ',' + (transCy + dy + popupHeight + 1);
        points += ' ' + (transCx + dx + popupWidth * 0.5) + ',' + (transCy + dy + popupHeight + 1);
        points += ' ' + (transCx + dx + popupWidth + 1) + ',' + (transCy + dy + popupHeight + 1 + 25);
        points += ' ' + (transCx + dx + popupWidth * 0.75) + ',' + (transCy + dy + popupHeight + 1);
        points += ' ' + (transCx + dx + popupWidth + 1) + ',' + (transCy + dy + popupHeight + 1);
        points += ' ' + (transCx + dx + popupWidth + 1) + ',' + (transCy + dy);
    }
    else {
        points = ' ' + (transCx + dx) + ',' + (transCy + dy);
        points += ' ' + (transCx + dx) + ',' + (transCy + dy + popupHeight + 1);
        points += ' ' + (transCx + dx + popupWidth + 1) + ',' + (transCy + dy + popupHeight + 1);
        points += ' ' + (transCx + dx + popupWidth + 1) + ',' + (transCy + dy);
        points += ' ' + (transCx + dx + popupWidth * 0.75) + ',' + (transCy + dy);
        points += ' ' + (transCx + dx + popupWidth + 1) + ',' + (transCy + dy - 25);
        points += ' ' + (transCx + dx + popupWidth * 0.5) + ',' + (transCy + dy);
    }
    popupBackground.style("visibility", "visible")
        .attr("points", points);
}

// Update content of a circle
function updatePopupCircleContent() {
    var x = parseFloat(currentCircle.attr("cx"));
    var y = parseFloat(currentCircle.attr("cy"));
    var htmlText = '<h2>Tàu: ' + trains[currentTrainIndex].name + '</h2>';
    htmlText += '<h2>Ga: ' + stations[currentStationIndex].name + '</h2>';
    htmlText += '<h2>' + timeChangingText[currentColorType][currentChange] + xToHour(x) + ':' + xToMinute(x) + '</h2>';
    var transX = x * currentScale + currentTranslate[0];
    var transY = y * currentScale + currentTranslate[1];
    var dx = -popupWidth - 5;
    var dy = currentDirection() == 'up' ? -popupHeight - 25 : 25;

    popup.html(htmlText)
        .attr("x", transX + dx)
        .attr("y", transY + dy);

    var points = '';
    if (currentDirection() == 'up') {
        points = ' ' + (transX + dx) + ',' + (transY + dy);
        points += ' ' + (transX + dx) + ',' + (transY + dy + popupHeight + 1);
        points += ' ' + (transX + dx + popupWidth * 0.5) + ',' + (transY + dy + popupHeight + 1);
        points += ' ' + (transX + dx + popupWidth + 1) + ',' + (transY + dy + popupHeight + 1 + 25);
        points += ' ' + (transX + dx + popupWidth * 0.75) + ',' + (transY + dy + popupHeight + 1);
        points += ' ' + (transX + dx + popupWidth + 1) + ',' + (transY + dy + popupHeight + 1);
        points += ' ' + (transX + dx + popupWidth + 1) + ',' + (transY + dy);
    }
    else {
        points = ' ' + (transX + dx) + ',' + (transY + dy);
        points += ' ' + (transX + dx) + ',' + (transY + dy + popupHeight + 1);
        points += ' ' + (transX + dx + popupWidth + 1) + ',' + (transY + dy + popupHeight + 1);
        points += ' ' + (transX + dx + popupWidth + 1) + ',' + (transY + dy);
        points += ' ' + (transX + dx + popupWidth * 0.75) + ',' + (transY + dy);
        points += ' ' + (transX + dx + popupWidth + 1) + ',' + (transY + dy - 25);
        points += ' ' + (transX + dx + popupWidth * 0.5) + ',' + (transY + dy);
    }
    popupBackground.attr("points", points);
}

// Update size of a circle at the end
function updatePopupCircleSizeEnd(circle) {
    var transCx = parseFloat(circle.attr("cx")) * currentScale + currentTranslate[0];
    var transCy = parseFloat(circle.attr("cy")) * currentScale + currentTranslate[1];

    if (isChanged() && allowAction()) {
        console.log("Long");
        var dx = -popupWidthEnd - 5;
        var dy = currentDirection() == 'up' ? -popupHeightEnd - 25 : 25;
        popup
            .attr("class", "popupend")
            .attr("x", transCx + dx)
            .attr("y", transCy + dy);

        var points = '';
        if (currentDirection() == 'up') {
            points = ' ' + (transCx + dx) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx) + ',' + (transCy + dy + popupHeightEnd + 1);
            points += ' ' + (transCx + dx + popupWidthEnd * 0.5) + ',' + (transCy + dy + popupHeightEnd + 1);
            points += ' ' + (transCx + dx + popupWidthEnd + 1) + ',' + (transCy + dy + popupHeightEnd + 1 + 25);
            points += ' ' + (transCx + dx + popupWidthEnd * 0.75) + ',' + (transCy + dy + popupHeightEnd + 1);
            points += ' ' + (transCx + dx + popupWidthEnd + 1) + ',' + (transCy + dy + popupHeightEnd + 1);
            points += ' ' + (transCx + dx + popupWidthEnd + 1) + ',' + (transCy + dy);
        }
        else {
            console.log("Long down");
            points = ' ' + (transCx + dx) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx) + ',' + (transCy + dy + popupHeightEnd + 1);
            points += ' ' + (transCx + dx + popupWidthEnd + 1) + ',' + (transCy + dy + popupHeightEnd + 1);
            points += ' ' + (transCx + dx + popupWidthEnd + 1) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx + popupWidthEnd * 0.75) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx + popupWidthEnd + 1) + ',' + (transCy + dy - 25);
            points += ' ' + (transCx + dx + popupWidthEnd * 0.5) + ',' + (transCy + dy);
            console.log("Long down", points);
        }
        popupBackground.attr("points", points);
    }
    else {
        var dx = -popupWidthEndShort - 5;
        var dy = currentDirection() == 'up' ? -popupHeightEndShort - 25 : 25;
        console.log("Short1 ", dy);
        popup
            .attr("class", "popupendshort")
            .attr("x", transCx + dx)
            .attr("y", transCy + dy);

        var points = '';
        if (currentDirection() == 'up') {
            points = ' ' + (transCx + dx) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx) + ',' + (transCy + dy + popupHeightEndShort + 1);
            points += ' ' + (transCx + dx + popupWidthEndShort * 0.5) + ',' + (transCy + dy + popupHeightEndShort + 1);
            points += ' ' + (transCx + dx + popupWidthEndShort + 1) + ',' + (transCy + dy + popupHeightEndShort + 1 + 25);
            points += ' ' + (transCx + dx + popupWidthEndShort * 0.75) + ',' + (transCy + dy + popupHeightEndShort + 1);
            points += ' ' + (transCx + dx + popupWidthEndShort + 1) + ',' + (transCy + dy + popupHeightEndShort + 1);
            points += ' ' + (transCx + dx + popupWidthEndShort + 1) + ',' + (transCy + dy);
        }
        else {
            points = ' ' + (transCx + dx) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx) + ',' + (transCy + dy + popupHeightEndShort + 1);
            points += ' ' + (transCx + dx + popupWidthEndShort + 1) + ',' + (transCy + dy + popupHeightEndShort + 1);
            points += ' ' + (transCx + dx + popupWidthEndShort + 1) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx + popupWidthEndShort * 0.75) + ',' + (transCy + dy);
            points += ' ' + (transCx + dx + popupWidthEndShort + 1) + ',' + (transCy + dy - 25);
            points += ' ' + (transCx + dx + popupWidthEndShort * 0.5) + ',' + (transCy + dy);
        }
        popupBackground.attr("points", points);
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
    return (previousCircleID == currentCircleID || previousCircle[0][0] == null || previousCircle.attr("color-type") == "0")
}

// Update content of a circle at the end
function updatePopupCircleContentEnd() {
    var x = parseFloat(currentCircle.attr("cx"));
    var y = parseFloat(currentCircle.attr("cy"));
    var htmlText = '<h2>Tàu: ' + trains[currentTrainIndex].name + '</h2>';
    htmlText += '<h2>Ga: ' + stations[currentStationIndex].name + '</h2>';
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
    popupBackground.style("visibility", "hidden");
    currentCircleID = "";
    editting = false;

    // Redraw this train
    drawTrains(currentTrainIndex);
}

// Update data of trains
function updateTrainData() {
    console.log("Update train data");

    var train = trains[currentTrainIndex];

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
}

// Popup-Cancel changing
function cancelChangeTime() {
    console.log("Hủy thay đổi thời gian!");
    updateOnDraggingCircle(-adjustedX());
    popup.style("visibility", "hidden");
    popupBackground.style("visibility", "hidden");
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
    var circle = d3.select(this);
    var circleID = circle.attr("id");

    if ((popupOpen && circleID != currentCircleID) || editting)
        return;

    console.log("MOUSE OVER CIRCLE");

    currentCircleID = circleID;
    currentCircle = circle;

    currentCircle
        .transition().duration(200)
        .style("cursor", "pointer")
        .attr("r", trainCircleFocusedR * (1 / currentScale));

    defineChanges(circleID);

    popupOpen = true;

    updatePopupCircleSize(currentCircle);
    updatePopupCircleContent();
}

// Mouse out train circle event
function mouseoutTrainCircle() {
    d3.select(this)
        .transition().duration(200)
        .attr("r", trainCircleR * (1 / currentScale));
    if (!editting) {
        popup.style("visibility", "hidden");
        popupBackground.style("visibility", "hidden");
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
            .attr("r", trainCircleR * (1 / currentScale));
        popupOpen = false;
        editting = true;

        updatePopupCircleSize(currentCircle);
        updatePopupCircleContent();

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
        if (isChanged() || allowAction()) {
            updatePopupCircleSizeEnd(currentCircle);
            updatePopupCircleContentEnd();
        }
        else {
            popup.style("visibility", "hidden");
            popupBackground.style("visibility", "hidden");
            editting = false;
        }
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
    var circleObj = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex);
    if (circleObj[0][0] == null) {
        var circle = layer.append("circle")
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", trainCircleR)
            .attr("cx-backup", cx)
            .attr("fill", "white")
            .attr("stroke-width", trainCircleStrokeWidth)
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1)
            .on("mouseover", mouseoverTrainCircle)
            .on("mouseout", mouseoutTrainCircle)
            .call(dragTrainCircleListener);
        trainCircles.push(circle);
    }
    else
        circleObj
            .attr("train-index", trainIndex)
            .attr("stop-index", stopIndex)
            .attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", trainCircleR * (1 / currentScale))
            .attr("cx-backup", cx)
            .attr("fill", "white")
            .attr("stroke-width", trainCircleStrokeWidth * (1 / currentScale))
            .attr("stroke", trainColor[colorType][trains[trainIndex].type])
            .style("opacity", 1)
            .on("mouseover", mouseoverTrainCircle)
            .on("mouseout", mouseoutTrainCircle)
            .call(dragTrainCircleListener);
}

// Mouse over train text hour event
function mouseoverTrainTextHour() {
    var textHourID = d3.select(this).attr("id");

    var circleID = textHourID.replace("hour", "circle");
    var circle = d3.select("#" + circleID);

    if ((popupOpen && circleID != currentCircleID) || editting)
        return;

    console.log("MOUSE OVER TEXT HOUR");

    d3.select(this).style("cursor", "pointer");

    currentCircleID = circleID;
    currentCircle = circle;

    console.log(circleID);

    currentCircle
        .transition().duration(200)
        .style("cursor", "pointer")
        .attr("r", trainCircleFocusedR * (1 / currentScale));

    defineChanges(circleID);

    popupOpen = true;

    updatePopupCircleSize(currentCircle);
    updatePopupCircleContent();
}

// Mouse out text hour event
function mouseoutTrainTextHour() {
    var trainHourID = d3.select(this).attr("id");

    var circleID = trainHourID.replace("hour", "circle");
    var circle = d3.select("#" + circleID);

    circle
        .transition().duration(200)
        .attr("r", trainCircleR * (1 / currentScale));
    if (!editting) {
        popup.style("visibility", "hidden");
        popupBackground.style("visibility", "hidden");
        popupOpen = false;
    }
}

// Drag train text hour
var dragTrainTextHourListener = d3.behavior.drag()
    .on("dragstart", function () {
        // Do not allow dragging with happenned events
        if (currentColorType == 0 || d3.select(this).attr("id").replace("hour", "circle") != currentCircleID)
            return;
        console.log("dragstart");
        currentCircle
            .transition().duration(200)
            .attr("r", trainCircleR * (1 / currentScale));
        popupOpen = false;
        editting = true;

        updatePopupCircleSize(currentCircle);
        updatePopupCircleContent();

        d3.event.sourceEvent.stopPropagation();
    })
    .on("drag", function () {
        // Do not allow dragging with happenned events
        if (currentColorType == 0 || d3.select(this).attr("id").replace("hour", "circle") != currentCircleID)
            return;

        updateOnDraggingCircle(d3.event.dx);
        updatePopupCircleContent();
    })
    .on("dragend", function () {
        // Do not allow dragging with happenned events
        if (currentColorType == 0 || d3.select(this).attr("id").replace("hour", "circle") != currentCircleID)
            return;
        if (isChanged() || allowAction()) {
            updatePopupCircleSizeEnd(currentCircle);
            updatePopupCircleContentEnd();
        }
        else {
            popup.style("visibility", "hidden");
            popupBackground.style("visibility", "hidden");
            editting = false;
        }
        console.log("dragend");
    });

// Append and assign hour to a train at a stop
function appendTextHour(layer, prefix, trainIndex, stopIndex, x, y, dy, align, visible, text, colorType) {
    var textObj = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex);
    if (textObj[0][0] == null) {
        var text = layer.append("text")
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
            .attr("fill", hourColor[colorType][trains[trainIndex].type])
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", trainHourTextSize)
            .style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge")
            .style("visibility", visible ? "visible" : "hidden")
            .on("mouseover", mouseoverTrainTextHour)
            .on("mouseout", mouseoutTrainTextHour)
            .call(dragTrainTextHourListener);

        trainHourTexts.push(text);
    }
    else
        textObj
            //.attr("train-index", trainIndex)
            //.attr("stop-index", stopIndex)
            //.attr("station-index", trains[trainIndex].stops[stopIndex].stationIndex)
            .attr("color-type", colorType)
            //.attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            .attr("y-backup", y)
            .attr("fill", hourColor[colorType][trains[trainIndex].type])
            //.style("opacity", 1)
            //.style("font-family", "Segoe UI")
            //.style("font-size", trainHourTextSize * (1 / currentScale))
            //.style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge")
            .style("visibility", visible ? "visible" : "hidden");
}

// Append and assign name to a train
function appendTextName(layer, prefix, trainIndex, stopIndex, x, y, dy, align, text, colorType) {
    var textObj = d3.select("#" + prefix + '_' + trainIndex + '_' + stopIndex);
    if (textObj[0][0] == null) {
        var text = layer.append("text")
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            .attr("fill", hourColor[colorType][trains[trainIndex].type])
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", trainNameSize)
            .style("font-weight", 500)
            .style("text-anchor", align)
            .style("alignment-baseline", dy > 0 ? "text-before-edge" : "text-after-edge");

        trainNames.push(text);
    }
    else
        textObj
            .attr("id", prefix + '_' + trainIndex + '_' + stopIndex)
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .attr("x-backup", x)
            .attr("fill", hourColor[colorType][trains[trainIndex].type])
            .style("opacity", 1)
            .style("font-family", "Segoe UI")
            .style("font-size", trainNameSize * (1 / currentScale))
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
    var currStop = train.stops[0];
    var currY = stations[currStop.stationIndex].y;
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

    if (train.currStopIndex == 0 && train.currStatus == statusType.ARRIVAL)
        colorType = 1;
    appendCircle(layer2a, 'traincircle_2', k, 0,
        getX(currStop.departedTime, currStop.departedDay), currY,
        colorType);
    appendTextHour(layer3, "trainhour_2", k, 0, getX(currStop.departedTime, currStop.departedDay) - dx, currY - dy,
        -dy, "end", true, currStop.departedTime % 10, colorType);

    // Draw middle stops
    for (var i = 1; i < train.stops.length - 1; i++) {
        var currStop = train.stops[i];
        var currY = stations[currStop.stationIndex].y;
        if (i > train.currStopIndex)
            colorType = 1;
        appendCircle(layer2, 'traincircle_1', k, i,
            getX(currStop.arrivalTime, currStop.arrivalDay), currY,
            colorType);
        appendTextHour(layer3, "trainhour_1", k, i, getX(currStop.arrivalTime, currStop.arrivalDay) + dx, currY + dy,
            dy, "start", currStop.arrivalTime != currStop.departedTime, currStop.arrivalTime % 10, colorType);

        if (i == train.currStopIndex && train.currStatus == statusType.ARRIVAL)
            colorType = 1;
        appendCircle(layer2a, 'traincircle_2', k, i,
            getX(currStop.departedTime, currStop.departedDay), currY,
            colorType);
        appendTextHour(layer3, "trainhour_2", k, i, getX(currStop.departedTime, currStop.departedDay) - dx, currY - dy,
            -dy, "end", true, currStop.departedTime % 10, colorType);

    }

    // Draw last stop
    if (train.stops.length - 1 > train.currStopIndex && train.currStatus == statusType.DEPARTED)
        colorType = 1;
    var currStop = train.stops[train.stops.length - 1];
    var currY = stations[currStop.stationIndex].y;
    var lineaY = train.inDirection == trainDirection.DOWN ? currY + verticalSpace : currY - verticalSpace;
    var dissolvedY = train.inDirection == trainDirection.DOWN ? currY + 2 * verticalSpace : currY - 2 * verticalSpace;
    appendCircle(layer2, 'traincircle_1', k, train.stops.length - 1,
        getX(currStop.arrivalTime, currStop.arrivalDay), currY,
        colorType);
    appendTextHour(layer3, "trainhour_1", k, train.stops.length - 1, getX(currStop.arrivalTime, currStop.arrivalDay) + dx, currY + dy,
        dy, "start", currStop.arrivalTime != currStop.departedTime, currStop.arrivalTime % 10, colorType);

    if (train.stops.length - 1 == train.currStopIndex && train.currStatus == statusType.ARRIVAL)
        colorType = 1;
    switch (train.outStatus) {
        case statusType.DEPARTED:
            appendCircle(layer2a, 'traincircle_2', k, train.stops.length - 1,
                getX(currStop.departedTime, currStop.departedDay), currY,
                colorType);
            appendTextHour(layer3, "trainhour_2", k, train.stops.length - 1, getX(currStop.departedTime, currStop.departedDay) - dx, currY - dy,
                -dy, "end", true, currStop.departedTime % 10, colorType);

            break;
    }
    console.log(trains[1]);
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
        for (var k = 0; k < trains.length; k++)
            drawTrainLines(k);

        // DRAW CIRCLES
        for (var k = 0; k < trains.length; k++)
            drawTrainCircles(k);

        // DRAW TEXTS
        for (var k = 0; k < trains.length; k++)
            drawTrainTexts(k);
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
    // filters go in defs element
    var defs = layer4.append("defs");

    // create filter with id #drop-shadow
    // height=130% so that the shadow is not clipped
    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "130%");

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 3)
        .attr("result", "blur");

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 3)
        .attr("dy", 3)
        .attr("result", "offsetBlur");

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

    popupBackground = layer4.append("polygon")
        .attr("points", "0,0 0,1 0,2 1,2 2,2 2,1 2,0")
        .style("filter", "url(#drop-shadow)")
        .style("opacity", 0.8)
        .attr("fill", "#610B0B")
        .style("visibility", "hidden");

    popup = layer4.append("foreignObject")
        .attr("class", "popup")
        .attr("x", 0)
        .attr("y", 0)
        .style("visibility", "hidden");
}

// Prepare menu
function prepareMenu() {
    menuBackground = layer4.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("width", 200)
        .attr("height", 200)
        .style("filter", "url(#drop-shadow)")
        .style("opacity", 0.9)
        .attr("fill", "#003060")
        .attr("stroke", "white")
        .style("visibility", "hidden")
        .on("click", menuClick);

    var htmlText = '';
    htmlText += '<div>';
    htmlText += '   <div class="col-xs-12 col-md-8" style="padding: 0 0 0 0;">';
    htmlText += '       <h2>Sửa kế hoạch</h2>';
    htmlText += '   </div>';
    htmlText += '   <div class="col-xs-6 col-md-4" style="padding: 0 0 0 0">';
    htmlText += '       <input id="switch-state" data-size="mini" type="checkbox" checked data-on-text="ON" data-off-text="OFF" onchange="changePlanToggle(this)"/>';
    htmlText += '   </div>';
    htmlText += '</div>';
    htmlText += '<div>';
    htmlText += '   <div class="col-xs-12 col-md-8" style="padding: 10px 0 0 0;">';
    htmlText += '       <h2>Sửa thực tế</h2>';
    htmlText += '   </div>';
    htmlText += '   <div class="col-xs-6 col-md-4" style="padding: 10px 0 0 0;">';
    htmlText += '       <input id="switch-state" data-size="mini" type="checkbox" checked data-on-text="ON" data-off-text="OFF" onchange="changeActualToggle(this)"/>';
    htmlText += '   </div>';
    htmlText += '</div>';

    menuHtml = layer4.append("foreignObject")
        .attr("class", "popup")
        .attr("x", -4)
        .attr("y", 7)
        .html(htmlText)
        .style("visibility", "hidden");

    menuIcon = layer4.append("svg:image")
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 40)
        .attr('height', 40)
        .attr("xlink:href", "menu.png")
        .on("click", menuClick);

}

function menuClick() {
    if (menuOpen) {
        menuBackground.style("visibility", "hidden");
        menuHtml.style("visibility", "hidden");
        menuIcon.style("visibility", "visible");
    }
    else {
        menuBackground.style("visibility", "visible");
        menuHtml.style("visibility", "visible");
        menuIcon.style("visibility", "hidden");
    }
    menuOpen = !menuOpen;
}

function changePlanToggle(cb) {
    console.log("Sửa kế hoạch: ", cb.checked);
}

function changeActualToggle(cb) {
    console.log("Sửa thực tế: ", cb.checked);
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

drawBoundary();

drawTimeline();

drawTrains(-1);

preparePopup();

prepareMenu();


// First zooming
//currentScale = 0.15;
//currentTranslate = [90, 60];

//var z = d3.behavior.zoom();
//z.scale(currentScale);
//z.translate(currentTranslate);

//layer0.attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
//layer1.attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
//layer1a.attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
//layer2.attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
//layer2a.attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");
//layer3.attr("transform", "translate(" + currentTranslate + ")scale(" + currentScale + ")");

