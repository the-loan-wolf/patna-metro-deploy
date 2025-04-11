const redLine = [
  "danapur cantonment",
  "saguna mor",
  "rps mor",
  "patlipura",
  "rukanpura",
  "raja bazar",
  "patna zoo",
  "vikas bhawan",
  "vidyut bhawan",
  "patna junction",
  "cnlu",
  "mithapur",
  "ramakrishna nagar",
  "jaganpura",
  "khemni chak",
];

const blueLine = [
  "patna junction",
  "akashvani",
  "gandhi maidan",
  "pmch",
  "university",
  "stadium",
  "rajendra nagar",
  "malahi pakri",
  "khemni chak",
  "bhoothnath",
  "zero mile",
  "new isbt",
];
const redBlue = ["patna junction", "khemni chak"];

const graph = {
  "Danapur Cantonment": { "Saguna Mor": 1 },
  "Saguna Mor": { "Danapur Cantonment": 1, "RPS Mor": 1 },
  "RPS Mor": { "Saguna Mor": 1, Patlipura: 1 },
  Patlipura: { "RPS Mor": 1, Rukanpura: 1 },
  Rukanpura: { Patlipura: 1, "Raja Bazar": 1 },
  "Raja Bazar": { Rukanpura: 1, "Patna Zoo": 1 },
  "Patna Zoo": { "Raja Bazar": 1, "Vikas Bhawan": 1 },
  "Vikas Bhawan": { "Patna Zoo": 1, "Vidyut Bhawan": 1 },
  "Vidyut Bhawan": { "Vikas Bhawan": 1, "Patna Junction": 1 },
  "Patna Junction": { "Vidyut Bhawan": 1, CNLU: 1, akashvani: 1 },
  CNLU: { "Patna Junction": 1, Mithapur: 1 },
  Mithapur: { CNLU: 1, "Ramakrishna Nagar": 1 },
  "Ramakrishna Nagar": { Mithapur: 1, Jaganpura: 1 },
  Jaganpura: { "Ramakrishna Nagar": 1, "Khemni Chak": 1 },
  "Khemni Chak": { Jaganpura: 1, Bhoothnath: 1, "Malahi Pakri": 1 },
  Bhoothnath: { "Khemni Chak": 1, "Zero Mile": 1 },
  "Zero Mile": { Bhoothnath: 1, "NEW ISBT": 1 },
  akashvani: { "Patna Junction": 1, "Gandhi Maidan": 1 },
  "Gandhi Maidan": { akashvani: 1, PMCH: 1 },
  PMCH: { "Gandhi Maidan": 1, university: 1 },
  university: { PMCH: 1, stadium: 1 },
  stadium: { university: 1, "rajendra nagar": 1 },
  "rajendra nagar": { stadium: 1, "Malahi Pakri": 1 },
  "Malahi Pakri": { "rajendra nagar": 1, "Khemni Chak": 1 },
  "NEW ISBT": { "Zero Mile": 1 },
};
const routeColors = { redBlue: redBlue, red: redLine, blue: blueLine };
function findColor(station) {
  for (let color in routeColors) {
    if (routeColors[color].includes(station.toLowerCase())) {
      return color;
    }
  }
  return null;
}

document.addEventListener("DOMContentLoaded", function () {
  const allStation = [...new Set(redLine.concat(blueLine))].sort();
  allStation.forEach((value) => {
    const option = document.createElement("option");
    option.text = camelCase(value);
    option.value = value.toLowerCase();
    document.getElementById("fromStation").appendChild(option);
  });
  allStation.forEach((value) => {
    const option = document.createElement("option");
    option.text = camelCase(value);
    option.value = value.toLowerCase();
    document.getElementById("toStation").appendChild(option);
  });
  const form = document.getElementById("findRoutes");
  form.addEventListener("submit", getRoutes);
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  if (from && to) {
    document.getElementById("fromStation").value = from.toLowerCase();
    document.getElementById("toStation").value = to.toLowerCase();
    getRoutes();
  }
});
function getRoutes(e) {
  if (e) {
    e.preventDefault();
  }
  let startStation = camelCase(document.getElementById("fromStation").value);
  let endStation = document.getElementById("toStation").value;
  const path = dijkstra(graph, startStation, endStation);
  if (path) {
    const ul = document.getElementById("routesList");
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    const li = document.createElement("li");
    li.textContent = startStation;
    li.setAttribute(
      "class",
      `list-group-item completed ${findColor(startStation)}`
    );
    ul.appendChild(li);
    for (let i = 0; i < path.length - 1; i++) {
      const currentStation = camelCase(path[i]);
      const nextStation = camelCase(path[i + 1]);
      const color = findColor(currentStation);
      console.log(`- ${currentStation} (${color} line) ->`);
      if (i === path.length - 2) {
        console.log(`- ${nextStation} (${findColor(nextStation)} line)`);
      }
      const li = document.createElement("li");
      li.textContent = nextStation;
      li.setAttribute(
        "class",
        `list-group-item completed ${findColor(nextStation)}`
      );
      ul.appendChild(li);
      document.getElementById(
        "info"
      ).innerHTML = `😊 Route found from ${startStation} to ${endStation}`;
    }
  } else {
    alert("No path found.");
  }
}
function camelCase(str) {
  if (
    str.toLowerCase() == "pmch" ||
    str.toLowerCase() == "cnlu" ||
    str.toLowerCase() == "new isbt"
  ) {
    return str.toUpperCase();
  } else {
    str = str.toLowerCase();
    if (str.indexOf(" ") > -1) {
      var camel = str
        .split(" ")
        .reduce(
          (s, c) =>
            s.charAt(0).toUpperCase() +
            s.slice(1) +
            " " +
            (c.charAt(0).toUpperCase() + c.slice(1))
        );
      return camel;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
function dijkstra(graph, start, end) {
  start = camelCase(start);
  end = camelCase(end);
  const nodes = Object.keys(graph);
  const visited = {};
  const distances = {};
  const path = {};
  let minNode;
  nodes.forEach((node) => {
    distances[node] = Infinity;
    path[node] = null;
  });
  distances[start] = 0;
  while (nodes.length !== 0) {
    minNode = nodes.reduce(
      (min, node) => (distances[node] < distances[min] ? node : min),
      nodes[0]
    );
    nodes.splice(nodes.indexOf(minNode), 1);
    if (minNode.toLowerCase() === end.toLowerCase()) {
      let pathNodes = [];
      while (path[minNode]) {
        pathNodes.push(minNode);
        minNode = path[minNode];
      }
      pathNodes.push(start);
      return pathNodes.reverse();
    }
    if (distances[minNode] === Infinity) break;
    for (let neighbor in graph[minNode]) {
      let newDist = distances[minNode] + graph[minNode][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        path[neighbor] = minNode;
      }
    }
  }
  return null;
}
