import React, { useCallback } from 'react';
import { PuzzleData } from "../puzzle/const";
import { KonvaEventObject } from 'konva/lib/Node';
import { Group, Line } from 'react-konva';
import Cell from './Cell';
import usePickupMino from '../hooks/usePickupMino';
import useDropMino from '../hooks/useDropMino';

type InventoryMinoProp = {
    index: number,
    drop_offset: { x: number, y: number },
    puzzle_data: PuzzleData,
    setPuzzleData: React.Dispatch<React.SetStateAction<PuzzleData>>,
    setDraggingMinoIndex: React.Dispatch<React.SetStateAction<number | undefined>>
};

const InventoryMino = ({ index, drop_offset, puzzle_data, setPuzzleData, setDraggingMinoIndex }: InventoryMinoProp): JSX.Element => {
    const picked_mino = puzzle_data[1][index];
    const onDragStart = usePickupMino(index, setPuzzleData, setDraggingMinoIndex);
    const pos = {
        x: 75 + 167.3 * index - (picked_mino.cell[0].x + picked_mino.cell[1].x + picked_mino.cell[2].x) * 19,
        y: 75 - (picked_mino.cell[0].y + picked_mino.cell[1].y + picked_mino.cell[2].y) * 19
    };
    const onDragEnd = useDropMino(index, drop_offset, setPuzzleData, setDraggingMinoIndex, pos, false);
    return (
        <Group
            draggable
            onDragStart={onDragStart}
            onDragMove={useCallback((e: KonvaEventObject<DragEvent>) => e.cancelBubble = true, [])}
            onDragEnd={onDragEnd}
            x={pos.x}
            y={pos.y}
            offset={{ x: 25, y: 25 }}
            scale={{ x: 0.75, y: 0.75 }}
            visible={picked_mino.pos === undefined}
        >
            <Line
                points={picked_mino.vertex}
                fill={"#c2c8cc"}
                closed={true}
                stroke={"#414958"}
                strokeWidth={4}
                lineJoin={"round"}
            />
            <Cell data={picked_mino.cell[0]} color={undefined} rect_visible={true} />
            <Cell data={picked_mino.cell[1]} color={undefined} rect_visible={true} />
            <Cell data={picked_mino.cell[2]} color={undefined} rect_visible={true} />
        </Group>
    );
}

export default React.memo(InventoryMino);
// export default InventoryMino;