import React from "react";
import { ColDef } from "ag-grid-community";

// Flat data structure for easier updates.
type Cell = {
  rowId: number;
  columnId: string;
  value: string;
  formula?: string;
};

type ColumnId = string;

type Row = Record<ColumnId, Cell>;

// the key is a composite of column ID and row ID, formatted as columnId-rowId
type Grid = Record<string, Cell>;

export type { Cell, Grid };

type UpdateCellArgs = {
  rowId: number;
  columnId: string;
  value: string;
};

function generateGrid(columns: ColDef[], rows: number): Grid {
  const grid: Grid = {};

  for (let rowId = 1; rowId <= rows; rowId++) {
    for (const column of columns) {
      const key = `${column.field}${rowId}`;
      grid[key] = {
        rowId,
        columnId: column.field!,
        value: "",
      };
    }
  }

  return grid;
}

const columns: ColDef[] = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
].map((letter) => ({
  field: letter,
  editable: true,
  headerName: letter.toUpperCase(),
}));

const defaultGrid: Grid = generateGrid(columns, 100);

function evaluateFormula(_formula: string, grid: Grid): string {
  try {
    // Replace all cell references like A1, b2, etc.
    const expression = _formula.replace(/([a-zA-Z]+)(\d+)/g, (_, col, row) => {
      const refKey = `${col.toLowerCase()}${parseInt(row, 10)}`;

      const cell = grid[refKey];
      console.log("cell", cell);
      const cellValue = cell?.value ?? "0";
      const numeric = parseFloat(cellValue);
      return isNaN(numeric) ? "0" : numeric.toString();
    });

    // Evaluate the numeric expression
    const result = Function(`return ${expression}`)();
    return result.toString();
  } catch (err) {
    return "#ERR";
  }
}

export function useGrid() {
  const [grid, setGrid] = React.useState<Grid>(defaultGrid);

  function updateCellValue({ rowId, columnId, value: _value }: UpdateCellArgs) {
    setGrid((previousGridState) => {
      const key = `${columnId}${rowId}`;
      const existingCell = previousGridState[key];

      // User is entering a formula
      if (_value.startsWith("=")) {
        const formula = _value.slice(1); // remove '='
        const evaluatedValue = evaluateFormula(formula, previousGridState);

        console.log("evaluatedValue", evaluatedValue);
        return {
          ...previousGridState,
          [key]: {
            value: evaluatedValue,
            // need to include the '=', so use the raw value
            formula: _value,
            rowId: existingCell.rowId,
            columnId: existingCell.columnId,
          },
        };
      }

      return {
        ...previousGridState,
        [key]: {
          ...existingCell,
          value: _value,
        },
      };
    });
  }

  function updateRowName(rowId: number, displayName: string) {
    setGrid((previousGridState) => {
      const updatedGrid = { ...previousGridState };
      for (const key in updatedGrid) {
        if (updatedGrid[key].rowId === rowId) {
          updatedGrid[key].value = displayName;
        }
      }
      return updatedGrid;
    });
  }

  function updateColumnName(columnId: string, displayName: string) {
    setGrid((previousGridState) => {
      const updatedGrid = { ...previousGridState };
      for (const key in updatedGrid) {
        if (updatedGrid[key].columnId === columnId) {
          updatedGrid[key].value = displayName;
        }
      }
      return updatedGrid;
    });
  }

  function readCellValue(rowId: number, columnId: string): string {
    const key = `${columnId}${rowId}`;
    return grid[key].value;
  }

  return {
    updateCellValue,
    readCellValue,
    updateRowName,
    updateColumnName,
    columns,
    cells: Object.values(grid),
  };
}
