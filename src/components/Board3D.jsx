import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react'
import Piece3D from './Piece3D';
import { select } from 'three/tsl';


const Board3D = ({board, onSquareClick, selected, validMoves, 
    capturedPieces,
    removeCapturedPiece
}) => {
    const tileSize = 1;
    const offset = tileSize * board.length / 2;

    const isValidTile = (r,c) => validMoves.some(m => m.to.row === r && m.to.col === c);
    const isTileSelected = selected && selected.row !== undefined && selected.col !== undefined;

    return (
        <div style={{ width: "80vw", height: "75vh", margin: "auto" }}>
            <Canvas camera={{ position: [0, 8, 8], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 10, 5]} intensity={0.5} />
                <OrbitControls enablePan={false} enableZoom={true} />

                {board.map((row, r) =>
                    row.map((piece, c) => {
                    const x = c * tileSize - offset + tileSize / 2;
                    const z = r * tileSize - offset + tileSize / 2;
                    const isDark = (r + c) % 2 === 1;
                    const isHighlighted = isValidTile(r, c);
                    const isSelected = selected && selected.row === r && selected.col === c;

                    // check if the piece is captured
                    const captured = capturedPieces?.some(
                        p => p.row === r && p.col === c 
                    ) || false;

                    return (
                        <group key={`${r}-${c}`}>
                            {/* Tile */}
                            <mesh
                                position={[x, 0, z]}
                                onClick={() => onSquareClick(r, c)}
                            >
                                <boxGeometry args={[tileSize, 0.1, tileSize]} />
                                <meshStandardMaterial color={isDark ? "#444" : "#eee"} 
                                    emissive={isHighlighted || isSelected ? "yellow" : "black"} 
                                    emissiveIntensity={isHighlighted || isSelected ? 0.4 : 0} />
                            </mesh>

                            {/* Piece */}
                            {piece && (
                                <Piece3D 
                                    position={[x, 0.2, z]}
                                    color={piece.player === 1 ? "red" : "#999"}
                                    king={piece.king}
                                    isSelected={selected && selected.row === r && selected.col === c}
                                    captured={captured}
                                    onRemove={() => removeCapturedPiece(r, c)}
                                />
                            )}
                        </group>
                    );
                    })
                )}
            </Canvas>
        </div>
    );
}

export default Board3D