const liveCellChance = 0.3;
let matrix = [];
let isPaused = false;

classes = {
  cell: [
    "cell",
    "bg-slate-900",
    "rounded",
    "transition-colors",
    "ease-out",
    "duration-300",
  ],
  row: ["gol-cell-row", "flex", "flex-row", "justify-evenly"],
  body: ["bg-slate-950", "flex", "flex-col", "justify-evenly", "!h-dvh"],
  activeCell: [
    "shadow-inner",
    "cursor-pointer",
    "opacity-80",
    "hover:opacity-100",
    "active:scale-105",
  ],
  activeCellColor: "bg-violet-600",
};

onload = () => {
  initialize();
  randomizeActiveCells(liveCellChance);
  runGameLoop();
};

onresize = () => {
  initialize();
  randomizeActiveCells(liveCellChance);
};

runGameLoop = () => {
  if (!isPaused) updateCells();
  setTimeout(() => runGameLoop(), 1000);
};

addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    isPaused = !isPaused;
  }
});

initialize = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const bodyPadding = 10;
  const gapSize = 5;
  const cellSize = 30;
  const totalCellSize = cellSize + gapSize;

  const body = document.getElementsByTagName("body")[0];
  const cell = document.createElement("div");
  const instructions = document.getElementById("instructions");

  body.innerHTML = "";
  body.className = "";
  body.classList.add(`p-[${bodyPadding / 2}px]`, ...classes.body);
  cell.classList.add(
    `w-[${cellSize}px]`,
    `h-[${cellSize}px]`,
    `m-[${gapSize / 2}px]`,
    ...classes.cell
  );

  body.appendChild(instructions);

  matrix = [];

  for (let row = 1; row < (height - bodyPadding) / totalCellSize; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add(...classes.row);
    body.append(rowDiv);

    const rowElements = [];

    for (let col = 1; col < (width - bodyPadding) / totalCellSize; col++) {
      const cellClone = cell.cloneNode();
      rowDiv.append(cellClone);
      rowElements.push(cellClone);
    }

    matrix.push(rowElements);
  }
};

randomizeActiveCells = (activeCellChance) => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      const cell = matrix[i][j];
      if (Math.random() < 1 - activeCellChance) {
        cell.classList.remove(classes.activeCellColor, ...classes.activeCell);
      } else {
        cell.classList.add(classes.activeCellColor, ...classes.activeCell);
      }
    }
  }
};

updateCells = () => {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      const cell = matrix[i][j];
      const aliveNeighourCount = countAliveNeighbors(i, j);
      const isAlive = cell.classList.contains(classes.activeCellColor);

      if (isAlive) {
        if (aliveNeighourCount < 2 || aliveNeighourCount > 3) {
          cell.classList.remove(classes.activeCellColor, ...classes.activeCell);
        }
      } else {
        if (aliveNeighourCount === 3) {
          cell.classList.add(classes.activeCellColor, ...classes.activeCell);
        }
      }
    }
  }
};

countAliveNeighbors = (row, col) => {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const x = row + i;
      const y = col + j;
      if (x >= 0 && x < matrix.length && y >= 0 && y < matrix[0].length) {
        if (matrix[x][y].classList.contains(classes.activeCellColor)) {
          count++;
        }
      }
    }
  }
  return count;
};
