"use client";
import { useEffect, useRef, useState } from "react";
import { getExistingShapes } from "./http";
import { Game } from "./Game";

type Shape = "circle" | "rect" | "pencil" | "hand" | "eraser" | "text" | "select" | "diamond";

export function useGame(roomId: number, socket: WebSocket) {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const topCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");
  const [strokeColor, setStrokeColor] = useState<string>("#ffff00");
  const [boardColor, setBoardColor] = useState<string>("#3d2b1f");
  const [game, setGame] = useState<Game | null>(null);
  const [existingShapes, setExistingShapes] = useState<any[]>([]);
  const [allShapeXRect, setAllShapeXRect] = useState<number[]>([]);
  const [allShapeYRect, setAllShapeYRect] = useState<number[]>([]);

  useEffect(() => {
    async function fetchShapes() {
      const shapes = await getExistingShapes(roomId);
      setExistingShapes(shapes);

      const xCoords: number[] = [];
      const yCoords: number[] = [];
      shapes.forEach((shape: any) => {
        let theshape = shape;
        if (typeof shape !== "object") {
          try {
            const firstParse = JSON.parse(shape);
            theshape = typeof firstParse === "string" ? JSON.parse(firstParse) : firstParse;
          } catch (err) {
            console.error("Failed to parse shape:", shape, err);
            return;
          }
        }
        try {
          if (theshape.type === "rect") {
            if (theshape.width > 0) {
              for (let i = theshape.x; i <= theshape.x + theshape.width; i++) xCoords.push(i);
            } else {
              for (let i = theshape.x; i >= theshape.x + theshape.width; i--) xCoords.push(i);
            }
            if (theshape.height > 0) {
              for (let i = theshape.y; i <= theshape.y + theshape.height; i++) yCoords.push(i);
            } else {
              for (let i = theshape.y; i >= theshape.y + theshape.height; i--) yCoords.push(i);
            }
          }
        } catch (error) { }
      });

      setAllShapeXRect(xCoords);
      setAllShapeYRect(yCoords);
    }

    fetchShapes();
  }, [roomId]);

  useEffect(() => {
    if (bgCanvasRef.current && topCanvasRef.current) {
      const g = new Game(
        bgCanvasRef.current,
        topCanvasRef.current,
        roomId,
        socket,
        existingShapes,
        allShapeXRect,
        allShapeYRect,
      );
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [
    bgCanvasRef.current,
    topCanvasRef.current,
    existingShapes,
    allShapeXRect,
    allShapeYRect,
    roomId,
    socket,
  ]);

  useEffect(() => {
    if (game) {
      game.setTool(selectedTool);
    }
  }, [selectedTool, game]);

  useEffect(() => {
    if (game) {
      game.setStrokeColor(strokeColor);
    }
  }, [strokeColor, game]);

  useEffect(() => {
    if (game) {
      game.setBoardBackgroundColor(boardColor);
    }
  }, [boardColor, game]);

  const undo = () => game?.undo();
  const redo = () => game?.redo();

  return {
    bgCanvasRef,
    topCanvasRef,
    selectedTool,
    setSelectedTool,
    strokeColor,
    setStrokeColor,
    boardColor,
    setBoardColor,
    undo,
    redo
  };
}
