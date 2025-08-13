import React from "react";
import { ColDef } from "ag-grid-community";

type Cell = {
  value: string;
  formula?: string; // Optional, used if the cell contains a formula
};

// Flat data structure for easier updates.
type Row = {
  rowId: number;
} & Partial<{
  [K in ColumnKey]: Cell;
}>;

type RowId = number;
type Grid = Record<RowId, Row>;

export type { Row, Grid, ColumnKey, Cell };

function generateGrid(columns: ColDef[], rows: number): Grid {
  const grid: Grid = {};
  for (let rowId = 1; rowId <= rows; rowId++) {
    grid[rowId] = {
      rowId,
    };
  }

  return grid;
}

const columnFields = [
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
] as const;

type ColumnKey = (typeof columnFields)[number];

function evaluateFormula(_formula: string, grid: Grid): string {
  if (!_formula.startsWith("=")) {
    return _formula; // Not a formula, return as is
  }

  try {
    // Replace all cell references like A1, b2, etc.
    const expression = _formula.replace(
      /([a-zA-Z]+)(\d+)/g,
      (_, colId, rowId) => {
        if (!columnFields.includes(colId as ColumnKey)) {
          throw new Error(`Invalid column reference: ${colId}`);
        }

        if (!grid[rowId]) {
          throw new Error(`Row with ID ${rowId} does not exist.`);
        }

        const _row = grid[rowId];
        const _cell = _row[colId as ColumnKey];
        const cellValue = _cell?.value ?? "0";
        const numeric = parseFloat(cellValue);
        return isNaN(numeric) ? "0" : numeric.toString();
      }
    );

    // Evaluate the numeric expression
    const result = Function(`return ${expression.split("=")[1]}`)();
    return result.toString();
  } catch (err) {
    throw err;
  }
}

export function useGrid() {
  const columns: ColDef[] = columnFields.map((letter) => ({
    field: letter,
    editable: true,
    headerName: letter.toUpperCase(),
    cellDataType: "object",
    valueFormatter: (params) => {
      console.log("params", params);
      return params.value?.value ?? ""; // Return the cell value or an empty string if undefined
    },
    valueParser: (params) => {
      const value = params.newValue;
      const cell: Cell = {
        value: evaluateFormula(value, grid) || value, // Evaluate formula if it starts with '='
        formula: value.startsWith("=") ? value : undefined, // Store the formula if it exists
      };
      return cell; // Return an object with the value for consistency
    },
    keyCreator: (params) => {
      return params.colDef.field as ColumnKey;
    },
  }));
  const defaultGrid: Grid = generateGrid(columns, 100);

  const [grid, setGrid] = React.useState<Grid>(defaultGrid);

  function updateCellValue({
    rowId,
    columnId,
    value: _value,
  }: { rowId: number; columnId: ColumnKey } & Omit<Cell, "formula">) {
    setGrid((previousGridState) => {
      const existingRow = previousGridState[rowId];

      console.log("Updating cell:", {
        rowId,
        columnId,
        value: _value,
      });

      if (!existingRow) {
        console.warn(`Row with ID ${rowId} does not exist.`);
        return previousGridState;
      }

      if (_value.startsWith("=")) {
        // User is entering a formula
        const formula = _value.slice(1); // remove '='
        const evaluatedValue = evaluateFormula(formula, previousGridState);

        console.log("evaluatedValue", evaluatedValue);
        return {
          ...previousGridState,
          [rowId]: {
            ...existingRow,
            [columnId]: {
              value: evaluatedValue,
              formula: _value, // store the raw value with '='
            },
          },
        };
      }

      return {
        ...previousGridState,
        [rowId]: {
          ...existingRow,
          [columnId]: {
            value: _value,
          },
        },
      };
    });
  }

  function readCellValue(rowId: number, columnId: string): string {
    const row = grid[rowId];
    if (!row) {
      console.warn(`Row with ID ${rowId} does not exist.`);
      return "";
    }

    const cell = row[columnId as ColumnKey];
    if (!cell) {
      console.warn(
        `Cell with column ID ${columnId} does not exist in row ${rowId}.`
      );
      return "";
    }

    return cell.value;
  }

  return {
    updateCellValue,
    readCellValue,
    columns,
    rows: Object.values(grid),
  };
}
