import { jsPDF } from 'jspdf';

interface AutoTableOptions {
  startY: number;
  head: string[][];
  body: string[][];
  theme: string;
  styles: {
    fontSize: number;
  };
  columnStyles: {
    [key: number]: {
      cellWidth: number;
    };
  };
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => void;
  }
}

declare module 'jspdf-autotable' {
  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
} 