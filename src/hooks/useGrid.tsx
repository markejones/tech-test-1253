import React from "react";
import { ColDef } from "ag-grid-community";

// Flat data structure for easier updates.
type Cell = {
  rowId: number;
  columnId: string;
  value: string;
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
    for (const columnId of columns) {
      const key = `${columnId}-${rowId}`;
      grid[key] = {
        rowId,
        columnId: columnId.field!,
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

export function useGrid() {
  const [grid, setGrid] = React.useState<Grid>(defaultGrid);

  function updateCellValue({ rowId, columnId, value }: UpdateCellArgs) {
    setGrid((previousGridState) => {
      const key = `${columnId}-${rowId}`;
      const existingCell = previousGridState[key];
      return {
        ...previousGridState,
        [key]: {
          ...existingCell,
          value: value,
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
    const key = `${columnId}-${rowId}`;
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
