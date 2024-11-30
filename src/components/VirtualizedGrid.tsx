import { ReactNode, useRef, useState, useEffect } from 'react';
import { FixedSizeGrid } from 'react-window';
import { useResponsive } from '../hooks/useResponsive';

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, style: React.CSSProperties) => ReactNode;
  itemHeight?: number;
  gap?: number;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  itemHeight = 300,
  gap = 24
}: VirtualizedGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { breakpoint } = useResponsive();

  // Determina o número de colunas baseado no breakpoint
  const getColumnCount = () => {
    switch (breakpoint) {
      case '2xl':
      case 'xl':
        return 4;
      case 'lg':
        return 3;
      case 'md':
        return 2;
      default:
        return 1;
    }
  };

  const columnCount = getColumnCount();
  const rowCount = Math.ceil(items.length / columnCount);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const itemWidth = (containerWidth - (gap * (columnCount - 1))) / columnCount;

  return (
    <div ref={containerRef} className="w-full">
      {containerWidth > 0 && (
        <FixedSizeGrid
          columnCount={columnCount}
          columnWidth={itemWidth}
          height={Math.min(window.innerHeight - 200, rowCount * (itemHeight + gap))}
          rowCount={rowCount}
          rowHeight={itemHeight + gap}
          width={containerWidth}
        >
          {({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * columnCount + columnIndex;
            const item = items[index];

            if (!item) return null;

            const adjustedStyle = {
              ...style,
              left: `${parseFloat(style.left as string) + (columnIndex * gap)}px`,
              top: `${parseFloat(style.top as string) + (rowIndex * gap)}px`,
              width: itemWidth,
              height: itemHeight
            };

            return renderItem(item, adjustedStyle);
          }}
        </FixedSizeGrid>
      )}
    </div>
  );
} 