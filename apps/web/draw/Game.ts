import { handleDeletion } from "./deleteShape";

type Tool = "circle" | "pencil" | "rect" | "hand" | "eraser" | "text" | "select" | "diamond";

export type Shape =
  | {
    id?: number;
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor?: string;
  }
  | {
    id?: number;
    type: "diamond";
    x: number;
    y: number;
    width: number;
    height: number;
    strokeColor?: string;
  }
  | {
    id?: number;
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
    strokeColor?: string;
  }
  | {
    id?: number;
    type: "pencil";
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
    BufferStroke: [number, number][];
    strokeColor?: string;
  }
  | {
    id?: number;
    type: "eraser";
    startX: number;
    startY: number;
    BufferStroke: [number, number][];
    strokeColor?: string;
  }
  | {
    id?: number;
    type: "text";
    x: number;
    y: number;
    text: string;
    fontSize: number;
    strokeColor?: string;
  };

export class Game {
  private bgCanvas: HTMLCanvasElement;
  private topCanvas: HTMLCanvasElement;
  private bgCtx: CanvasRenderingContext2D;
  private topCtx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: number;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private selectedTool: Tool = "circle";
  private BufferStroke: [number, number][];
  private scale: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private isPanning: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private allShapeXRect: any[];
  private allShapeYRect: any[];
  socket: WebSocket;
  private needsBgRedraw: boolean = true;
  private needsTopRedraw: boolean = true;
  private animationFrameId: number | null = null;
  private activeShape: Shape | null = null;
  private selectedShape: Shape | null = null;
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private undoStack: Shape[][] = [];
  private redoStack: Shape[][] = [];
  private activeTextInput: HTMLInputElement | null = null;
  private pendingSocketMessages: string[] = [];
  private currentStrokeColor: string = "#ffff00";
  private boardBackgroundColor: string = "#3d2b1f";
  private currentLineWidth: number = 4;
  private flushPendingMessages = () => {
    while (this.socket.readyState === WebSocket.OPEN && this.pendingSocketMessages.length > 0) {
      const message = this.pendingSocketMessages.shift();
      if (!message) {
        return;
      }
      this.socket.send(message);
    }
  };

  private parseShape(shape: any): any | null {
    if (shape !== null && typeof shape === "object" && !Array.isArray(shape)) {
      return shape;
    }
    if (typeof shape === "string") {
      try {
        return JSON.parse(shape);
      } catch (error) {
        console.error("Failed to parse shape string:", error);
        return null;
      }
    }
    return null;
  }

  constructor(
    bgCanvas: HTMLCanvasElement,
    topCanvas: HTMLCanvasElement,
    roomId: number,
    socket: WebSocket,
    existingShapes: any,
    allShapeXRect: any,
    allShapeYRect: any,
  ) {
    this.bgCanvas = bgCanvas;
    this.topCanvas = topCanvas;
    this.bgCtx = bgCanvas.getContext("2d")!;
    this.topCtx = topCanvas.getContext("2d")!;
    this.existingShapes = existingShapes;
    this.BufferStroke = [[-1, -1]];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;

    const width = document.body?.clientWidth || 800;
    const height = document.body?.clientHeight || 600;

    this.bgCanvas.width = width;
    this.bgCanvas.height = height;
    this.topCanvas.width = width;
    this.topCanvas.height = height;

    this.allShapeXRect = allShapeXRect || [];
    this.allShapeYRect = allShapeYRect || [];

    this.existingShapes = this.existingShapes.map((s) => this.parseShape(s)).filter((s) => s !== null);

    this.socket.addEventListener("open", this.flushPendingMessages);
    this.initHandlers();
    this.initMouseHandlers();
    this.startRenderLoop();
    window.addEventListener("resize", this.handleResize);
  }

  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener("resize", this.handleResize);
    this.removeActiveTextInput();
    this.socket.removeEventListener("open", this.flushPendingMessages);
    this.topCanvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.topCanvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.topCanvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.topCanvas.removeEventListener("wheel", this.mouseWheelHandler);
    this.topCanvas.removeEventListener("touchstart", this.touchStartHandler);
    this.topCanvas.removeEventListener("touchmove", this.touchMoveHandler);
    this.topCanvas.removeEventListener("touchend", this.touchEndHandler);
  }

  private sendSocketMessage(payload: unknown) {
    const message = JSON.stringify(payload);
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
      return;
    }
    this.pendingSocketMessages.push(message);
  }

  setTool(tool: Tool) {
    if (tool !== "text") {
      this.removeActiveTextInput();
    }
    this.selectedTool = tool;
  }

  setStrokeColor(color: string) {
    this.currentStrokeColor = color;
  }

  setLineWidth(width: number) {
    this.currentLineWidth = width;
  }

  setBoardBackgroundColor(color: string) {
    this.boardBackgroundColor = color;
    this.triggerBgRedraw();
  }

  private removeActiveTextInput() {
    if (this.activeTextInput?.parentNode) {
      this.activeTextInput.parentNode.removeChild(this.activeTextInput);
    }
    this.activeTextInput = null;
  }

  undo() {
    if (this.existingShapes.length > 0) {
      this.redoStack.push([...this.existingShapes]);
      this.existingShapes.pop();
      this.triggerBgRedraw();

      this.sendSocketMessage({
        type: "undo",
        roomId: Number(this.roomId)
      });
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.undoStack.push([...this.existingShapes]);
      const nextShapes = this.redoStack.pop();
      if (nextShapes) {
        this.existingShapes = nextShapes;
        this.triggerBgRedraw();

        // Redo is tricky with the current backend as it usually just adds the last shape
        // For now, let's sync the last shape added back
        const lastShape = this.existingShapes[this.existingShapes.length - 1];
        if (lastShape) {
          this.sendSocketMessage({
            type: "chat",
            message: JSON.stringify(lastShape),
            roomId: Number(this.roomId),
          });
        }
      }
    }
  }

  private startRenderLoop() {
    const loop = () => {
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  private triggerBgRedraw() {
    this.needsBgRedraw = true;
  }

  private triggerTopRedraw() {
    this.needsTopRedraw = true;
  }

  private render() {
    if (this.needsBgRedraw) {
      this.renderBackground();
      this.needsBgRedraw = false;
    }
    if (this.needsTopRedraw) {
      this.renderTop();
      this.needsTopRedraw = false;
    }
  }

  private offscreenCanvas: HTMLCanvasElement | null = null;
  private offscreenCtx: CanvasRenderingContext2D | null = null;

  private initOffscreenCanvas() {
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = this.bgCanvas.width;
    this.offscreenCanvas.height = this.bgCanvas.height;
    this.offscreenCtx = this.offscreenCanvas.getContext("2d")!;
  }

  private renderBackground() {
    if (!this.offscreenCanvas) {
      this.initOffscreenCanvas();
    }

    const { offscreenCanvas, offscreenCtx } = this;
    if (!offscreenCanvas || !offscreenCtx) return;

    // Redraw offscreen cache if needed
    offscreenCtx.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
    offscreenCtx.fillStyle = this.boardBackgroundColor;
    offscreenCtx.fillRect(
      -this.panX / this.scale,
      -this.panY / this.scale,
      offscreenCanvas.width / this.scale,
      offscreenCanvas.height / this.scale,
    );

    this.existingShapes.forEach((shape) => {
      this.drawShape(offscreenCtx, shape);
    });

    // Draw the cached background to the main canvas
    this.bgCtx.setTransform(1, 0, 0, 1, 0, 0);
    this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    this.bgCtx.drawImage(offscreenCanvas, 0, 0);
  }

  private renderTop() {
    this.topCtx.setTransform(this.scale, 0, 0, this.scale, this.panX, this.panY);
    this.topCtx.clearRect(
      -this.panX / this.scale,
      -this.panY / this.scale,
      this.topCanvas.width / this.scale,
      this.topCanvas.height / this.scale,
    );

    if (this.activeShape) {
      this.drawShape(this.topCtx, this.activeShape);
    }

    if (this.selectedShape) {
      this.drawSelectionHighlight(this.topCtx, this.selectedShape);
    }
  }

  private drawSelectionHighlight(ctx: CanvasRenderingContext2D, shape: Shape) {
    ctx.strokeStyle = "rgba(0, 150, 255, 0.5)";
    ctx.lineWidth = 2 / this.scale;
    ctx.setLineDash([5, 5]);

    if (shape.type === "rect" || shape.type === "diamond") {
      ctx.strokeRect(shape.x - 2 / this.scale, shape.y - 2 / this.scale, shape.width + 4 / this.scale, shape.height + 4 / this.scale);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius) + 2 / this.scale, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "pencil" || shape.type === "eraser") {
      // Simplified bounding box for pencil
      const points = shape.BufferStroke;
      if (points.length === 0) return;
      let minX = points[0]?.[0] ?? 0;
      let maxX = points[0]?.[0] ?? 0;
      let minY = points[0]?.[1] ?? 0;
      let maxY = points[0]?.[1] ?? 0;
      points.forEach(p => {
        if (!p || p[0] === -1) return;
        minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
        minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
      });
      ctx.strokeRect(minX - 4, minY - 4, (maxX - minX) + 8, (maxY - minY) + 8);
    } else if (shape.type === "text") {
      const bounds = this.getTextBounds(ctx, shape);
      ctx.strokeRect(bounds.left - 2, bounds.top - 2, (bounds.right - bounds.left) + 4, (bounds.bottom - bounds.top) + 4);
    }
    ctx.setLineDash([]);
  }

  private getTextBounds(ctx: CanvasRenderingContext2D, shape: Extract<Shape, { type: "text" }>) {
    ctx.font = `${shape.fontSize}px Arial`;
    const metrics = ctx.measureText(shape.text);
    return {
      left: shape.x,
      right: shape.x + metrics.width,
      top: shape.y - shape.fontSize,
      bottom: shape.y,
    };
  }

  private drawShape(ctx: CanvasRenderingContext2D, shape: Shape) {
    if (!shape) return;

    ctx.strokeStyle = shape.strokeColor || "rgba(255, 255, 255)";
    ctx.lineWidth = this.currentLineWidth / this.scale;

    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "diamond") {
      const midX = shape.x + shape.width / 2;
      const midY = shape.y + shape.height / 2;
      ctx.beginPath();
      ctx.moveTo(midX, shape.y);
      ctx.lineTo(shape.x + shape.width, midY);
      ctx.lineTo(midX, shape.y + shape.height);
      ctx.lineTo(shape.x, midY);
      ctx.closePath();
      ctx.stroke();
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();
    } else if (shape.type === "pencil" || shape.type === "eraser") {
      if (shape.type === "eraser") {
        ctx.lineWidth = 10 / this.scale;
      }
      const points = shape.BufferStroke;
      if (points.length < 2) return;

      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      let started = false;
      for (const point of points) {
        if (point[0] === -1 && point[1] === -1) continue;
        if (!started) {
          ctx.moveTo(point[0], point[1]);
          started = true;
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      }
      ctx.stroke();
    } else if (shape.type === "text") {
      ctx.fillStyle = shape.strokeColor || "rgba(255, 255, 255)";
      ctx.font = `${shape.fontSize}px Arial`;
      ctx.fillText(shape.text, shape.x, shape.y);
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat") {
        const message = typeof data.message === "string" ? JSON.parse(data.message) : data.message;
        const parsedShape = this.parseShape(message);
        if (parsedShape) {
          parsedShape.id = data.id;

          // Check if we already have this shape by ID
          const existingById = this.existingShapes.find(s => s.id === parsedShape.id);
          if (existingById) return;

          // Check if we have a local shape (no ID) that matches this one
          // This prevents duplication for the sender
          const localMatch = this.existingShapes.find(s =>
            !s.id &&
            s.type === parsedShape.type &&
            JSON.stringify(s) === JSON.stringify({ ...parsedShape, id: undefined })
          );

          if (localMatch) {
            localMatch.id = parsedShape.id;
          } else {
            this.existingShapes.push(parsedShape);
            this.triggerBgRedraw();
          }
        }
      } else if (data.type === "delete") {
        const deleteId = data.id;
        this.existingShapes = this.existingShapes.filter(s => s.id !== deleteId);
        this.triggerBgRedraw();
      } else if (data.type === "delete_by_props") {
        const shapeToMatch = data.shape;
        this.existingShapes = this.existingShapes.filter(s => {
          if (s.id) return true; // Don't delete by props if it has an ID
          return JSON.stringify(s) !== JSON.stringify(shapeToMatch);
        });
        this.triggerBgRedraw();
      } else if (data.type === "undo") {
        this.existingShapes.pop();
        this.triggerBgRedraw();
      }
    };
  }

  mouseDownHandler = (e: any) => {
    const mouseX = e.clientX - this.topCanvas.offsetLeft;
    const mouseY = e.clientY - this.topCanvas.offsetTop;

    if (this.selectedTool === "hand") {
      this.isPanning = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    }

    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;

    const transformedX = (mouseX - this.panX) / this.scale;
    const transformedY = (mouseY - this.panY) / this.scale;

    this.BufferStroke = [[transformedX, transformedY]];

    if (this.selectedTool === "pencil") {
      this.activeShape = {
        type: "pencil",
        startX: transformedX,
        startY: transformedY,
        BufferStroke: [...this.BufferStroke],
        strokeColor: this.currentStrokeColor,
      };
    } else if (this.selectedTool === "eraser") {
      this.activeShape = {
        type: "eraser",
        startX: transformedX,
        startY: transformedY,
        BufferStroke: [...this.BufferStroke],
        strokeColor: this.boardBackgroundColor,
      };
    } else if (this.selectedTool === "text") {
      this.clicked = false;
      this.removeActiveTextInput();

      // Create an inline input element
      const input = document.createElement("input");
      input.type = "text";
      input.style.position = "fixed";
      input.style.left = `${e.clientX}px`;
      input.style.top = `${e.clientY - (20 / this.scale)}px`;
      input.style.fontSize = `${20 * this.scale}px`; // Scale input font size visually
      input.style.fontFamily = "Arial";
      input.style.color = this.currentStrokeColor; // Match selected stroke color
      input.style.background = "rgba(0, 0, 0, 0.75)";
      input.style.border = "1px dashed rgba(255, 255, 255, 0.5)"; // Subtle border to indicate editing
      input.style.minWidth = "24px";
      input.style.outline = "none";
      input.style.padding = "2px 4px";
      input.style.margin = "0";
      input.style.zIndex = "1000";
      input.style.caretColor = "white";

      document.body.appendChild(input);
      this.activeTextInput = input;

      requestAnimationFrame(() => {
        if (this.activeTextInput === input) {
          input.focus();
        }
      });

      // Handle completion of text entry
      let finished = false;
      const finishTextEntry = () => {
        if (finished) return;
        finished = true;
        if (input.value.trim() !== "") {
          const textShape: Shape = {
            type: "text",
            x: transformedX,
            y: transformedY,
            text: input.value,
            fontSize: 20 / this.scale,
            strokeColor: this.currentStrokeColor,
          };
          this.existingShapes.push(textShape);
          this.triggerBgRedraw();
          this.sendSocketMessage({
            type: "chat",
            message: JSON.stringify(textShape),
            roomId: Number(this.roomId),
          });
        }
        this.removeActiveTextInput();
      };

      input.addEventListener("mousedown", (evt) => evt.stopPropagation());
      input.addEventListener("click", (evt) => evt.stopPropagation());

      // Finish on Enter key or losing focus
      input.addEventListener("blur", finishTextEntry);
      input.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
          finishTextEntry();
        } else if (evt.key === "Escape") {
          // Cancel on escape
          finished = true;
          this.removeActiveTextInput();
        }
      });
      return;
    } else if (this.selectedTool === "select") {
      this.selectedShape = this.findShapeAt(transformedX, transformedY);
      if (this.selectedShape) {
        this.isDragging = true;
        this.dragStartX = transformedX;
        this.dragStartY = transformedY;
      }
    }
    this.triggerTopRedraw();
  };

  private findShapeAt(x: number, y: number): Shape | null {
    // Search in reverse to find the top-most shape
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      const shape = this.existingShapes[i];
      if (shape && this.isPointInShape(x, y, shape)) {
        return shape;
      }
    }
    return null;
  }

  private isPointInShape(x: number, y: number, shape: Shape): boolean {
    if (shape.type === "rect") {
      const left = Math.min(shape.x, shape.x + shape.width);
      const right = Math.max(shape.x, shape.x + shape.width);
      const top = Math.min(shape.y, shape.y + shape.height);
      const bottom = Math.max(shape.y, shape.y + shape.height);
      return x >= left && x <= right && y >= top && y <= bottom;
    } else if (shape.type === "diamond") {
      const midX = shape.x + shape.width / 2;
      const midY = shape.y + shape.height / 2;
      // Approximate point in rhombus using manhattan distance
      const dx = Math.abs(x - midX) / (shape.width / 2);
      const dy = Math.abs(y - midY) / (shape.height / 2);
      return dx + dy <= 1;
    } else if (shape.type === "circle") {
      const dx = x - shape.centerX;
      const dy = y - shape.centerY;
      return Math.sqrt(dx * dx + dy * dy) <= Math.abs(shape.radius);
    } else if (shape.type === "pencil") {
      return shape.BufferStroke.some(p => {
        const dx = x - p[0];
        const dy = y - p[1];
        return Math.sqrt(dx * dx + dy * dy) < 5 / this.scale;
      });
    } else if (shape.type === "text") {
      const bounds = this.getTextBounds(this.bgCtx, shape);
      return x >= bounds.left && x <= bounds.right && y >= bounds.top && y <= bounds.bottom;
    }
    return false;
  }

  private eraseAt(transformedX: number, transformedY: number) {
    const eraserRadius = 10 / this.scale;
    let anyCollided = false;
    this.existingShapes = this.existingShapes.filter((existing) => {
      let collided = false;
      if (!existing) return true;
      if (existing.type === "pencil" || existing.type === "eraser") {
        collided = existing.BufferStroke.some(p => {
          const dx = p[0] - transformedX;
          const dy = p[1] - transformedY;
          return Math.sqrt(dx * dx + dy * dy) < eraserRadius;
        });
      } else if (existing.type === "rect") {
        const left = Math.min(existing.x, existing.x + (existing.width || 0));
        const right = Math.max(existing.x, existing.x + (existing.width || 0));
        const top = Math.min(existing.y, existing.y + (existing.height || 0));
        const bottom = Math.max(existing.y, existing.y + (existing.height || 0));

        collided = transformedX >= left - eraserRadius &&
          transformedX <= right + eraserRadius &&
          transformedY >= top - eraserRadius &&
          transformedY <= bottom + eraserRadius;
      } else if (existing.type === "diamond") {
        const midX = existing.x + existing.width / 2;
        const midY = existing.y + existing.height / 2;
        const dx = Math.abs(transformedX - midX) / (existing.width / 2);
        const dy = Math.abs(transformedY - midY) / (existing.height / 2);
        // Add eraser radius tolerance to diamond distance check
        const tolerance = eraserRadius / Math.min(existing.width / 2, existing.height / 2);
        collided = dx + dy <= 1 + tolerance;
      } else if (existing.type === "circle") {
        const dx = existing.centerX - transformedX;
        const dy = existing.centerY - transformedY;
        collided = Math.sqrt(dx * dx + dy * dy) < Math.abs(existing.radius) + eraserRadius;
      } else if (existing.type === "text") {
        const bounds = this.getTextBounds(this.bgCtx, existing);
        collided = transformedX >= bounds.left - eraserRadius &&
          transformedX <= bounds.right + eraserRadius &&
          transformedY >= bounds.top - eraserRadius &&
          transformedY <= bounds.bottom + eraserRadius;
      }

      if (collided) {
        if (existing.id) {
          this.sendSocketMessage({
            type: "delete",
            id: existing.id,
            roomId: Number(this.roomId)
          });
        } else {
          // If no ID, we broadcast a delete by properties (best effort for real-time)
          this.sendSocketMessage({
            type: "delete_by_props",
            shape: existing,
            roomId: Number(this.roomId)
          });
        }

        let startX = 0, startY = 0, endX = 0, endY = 0;
        // ... (rest of the coordinate logic remains same)
        if (existing.type === "rect" || existing.type === "diamond") {
          startX = Math.min(existing.x, existing.x + existing.width);
          startY = Math.min(existing.y, existing.y + existing.height);
          endX = Math.max(existing.x, existing.x + existing.width);
          endY = Math.max(existing.y, existing.y + existing.height);
        } else if (existing.type === "circle") {
          const r = Math.abs(existing.radius);
          startX = existing.centerX - r;
          startY = existing.centerY - r;
          endX = existing.centerX + r;
          endY = existing.centerY + r;
        } else if (existing.type === "pencil" || existing.type === "eraser") {
          startX = existing.startX; startY = existing.startY;
          const lastPoint = existing.BufferStroke[existing.BufferStroke.length - 1];
          if (lastPoint) {
            endX = lastPoint[0];
            endY = lastPoint[1];
          } else {
            endX = startX;
            endY = startY;
          }
        } else if (existing.type === "text") {
          const bounds = this.getTextBounds(this.bgCtx, existing);
          startX = bounds.left;
          startY = bounds.top;
          endX = bounds.right;
          endY = bounds.bottom;
        }

        if (existing.id) {
          handleDeletion(
            Number(this.roomId),
            existing.id,
            existing.type,
            Math.floor(startX),
            Math.floor(startY),
            Math.floor(endX),
            Math.floor(endY)
          );
        }
        anyCollided = true;
        return false;
      }
      return true;
    });

    if (anyCollided) {
      this.triggerBgRedraw();
    }
  }

  mouseUpHandler = (e: any) => {
    this.isPanning = false;
    this.clicked = false;

    const mouseX = e.clientX - this.topCanvas.offsetLeft;
    const mouseY = e.clientY - this.topCanvas.offsetTop;
    const transformedX = (mouseX - this.panX) / this.scale;
    const transformedY = (mouseY - this.panY) / this.scale;

    if (!this.activeShape && (this.selectedTool === "rect" || this.selectedTool === "circle" || this.selectedTool === "diamond")) {
      const startX = (this.startX - this.bgCanvas.offsetLeft - this.panX) / this.scale;
      const startY = (this.startY - this.bgCanvas.offsetTop - this.panY) / this.scale;

      if (this.selectedTool === "rect" || this.selectedTool === "diamond") {
        this.activeShape = {
          type: this.selectedTool,
          x: Math.min(startX, transformedX),
          y: Math.min(startY, transformedY),
          width: Math.abs(transformedX - startX),
          height: Math.abs(transformedY - startY),
          strokeColor: this.currentStrokeColor,
        };
      } else if (this.selectedTool === "circle") {
        const width = transformedX - startX;
        const height = transformedY - startY;
        const radius = Math.sqrt(width * width + height * height) / 2;
        this.activeShape = {
          type: "circle",
          radius: radius,
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          strokeColor: this.currentStrokeColor,
        };
      }
    }

    if (this.activeShape) {
      const shape = this.activeShape;
      if (shape.type === "eraser") {
        this.eraseAt(transformedX, transformedY);
      } else {
        this.redoStack = []; // Clear redo stack on new action
        this.undoStack.push([...this.existingShapes]);
        this.existingShapes.push(shape);
        this.triggerBgRedraw();
        this.sendSocketMessage({
          type: "chat",
          message: JSON.stringify(shape),
          roomId: Number(this.roomId),
        });
      }
      this.activeShape = null;
    }

    if (this.isDragging && this.selectedShape) {
      this.isDragging = false;
      // Sync moved shape
      this.sendSocketMessage({
        type: "chat",
        message: JSON.stringify(this.selectedShape),
        roomId: Number(this.roomId),
      });
    }

    this.triggerTopRedraw();
  };

  mouseMoveHandler = (e: any) => {
    const mouseX = e.clientX - this.topCanvas.offsetLeft;
    const mouseY = e.clientY - this.topCanvas.offsetTop;

    if (this.clicked) {
      if (this.isPanning && this.selectedTool === "hand") {
        const deltaX = e.clientX - this.lastMouseX;
        const deltaY = e.clientY - this.lastMouseY;
        this.panX += deltaX;
        this.panY += deltaY;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.triggerBgRedraw();
        this.triggerTopRedraw();
      } else {
        const transformedX = (mouseX - this.panX) / this.scale;
        const transformedY = (mouseY - this.panY) / this.scale;
        const startX = (this.startX - this.bgCanvas.offsetLeft - this.panX) / this.scale;
        const startY = (this.startY - this.bgCanvas.offsetTop - this.panY) / this.scale;

        if (this.selectedTool === "eraser") {
          this.eraseAt(transformedX, transformedY);
        }

        if (this.selectedTool === "rect" || this.selectedTool === "diamond") {
          this.activeShape = {
            type: this.selectedTool,
            x: Math.min(startX, transformedX),
            y: Math.min(startY, transformedY),
            width: Math.abs(transformedX - startX),
            height: Math.abs(transformedY - startY),
            strokeColor: this.currentStrokeColor,
          };
        } else if (this.selectedTool === "circle") {
          const width = transformedX - startX;
          const height = transformedY - startY;
          const radius = Math.sqrt(width * width + height * height) / 2;
          this.activeShape = {
            type: "circle",
            radius: radius,
            centerX: startX + width / 2,
            centerY: startY + height / 2,
            strokeColor: this.currentStrokeColor,
          };
        } else if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
          const lastPoint = this.BufferStroke[this.BufferStroke.length - 1];
          if (lastPoint) {
            const dx = transformedX - lastPoint[0];
            const dy = transformedY - lastPoint[1];
            if (dx * dx + dy * dy > 4) {
              this.BufferStroke.push([transformedX, transformedY]);
              if (this.activeShape && (this.activeShape.type === "pencil" || this.activeShape.type === "eraser")) {
                this.activeShape.BufferStroke = [...this.BufferStroke];
              }
            }
          }
        } else if (this.selectedTool === "select" && this.isDragging && this.selectedShape) {
          const dx = transformedX - this.dragStartX;
          const dy = transformedY - this.dragStartY;
          this.moveShape(this.selectedShape, dx, dy);
          this.dragStartX = transformedX;
          this.dragStartY = transformedY;
          this.triggerBgRedraw();
        }
        this.triggerTopRedraw();
      }
    }
  };

  private moveShape(shape: Shape, dx: number, dy: number) {
    if (shape.type === "rect" || shape.type === "diamond") {
      shape.x += dx;
      shape.y += dy;
    } else if (shape.type === "circle") {
      shape.centerX += dx;
      shape.centerY += dy;
    } else if (shape.type === "pencil" || shape.type === "eraser") {
      shape.startX += dx;
      shape.startY += dy;
      shape.BufferStroke = shape.BufferStroke.map(p => {
        if (p[0] === -1) return p;
        return [p[0] + dx, p[1] + dy];
      });
    } else if (shape.type === "text") {
      shape.x += dx;
      shape.y += dy;
    }
  }

  mouseWheelHandler = (e: any) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.1, this.scale + scaleAmount), 5);

    const mouseX = e.clientX - this.topCanvas.offsetLeft;
    const mouseY = e.clientY - this.topCanvas.offsetTop;

    const fullX = (mouseX - this.panX) / this.scale;
    const fullY = (mouseY - this.panY) / this.scale;

    this.panX = mouseX - fullX * newScale;
    this.panY = mouseY - fullY * newScale;
    this.scale = newScale;

    this.triggerBgRedraw();
    this.triggerTopRedraw();
  };

  touchStartHandler = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0]!;
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      this.mouseDownHandler(mouseEvent);
    }
  };

  touchMoveHandler = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0]!;
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      this.mouseMoveHandler(mouseEvent);
    }
  };

  touchEndHandler = (e: TouchEvent) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    this.mouseUpHandler(mouseEvent);
  };

  handleResize = () => {
    const width = document.body?.clientWidth || 800;
    const height = document.body?.clientHeight || 600;

    this.bgCanvas.width = width;
    this.bgCanvas.height = height;
    this.topCanvas.width = width;
    this.topCanvas.height = height;

    this.triggerBgRedraw();
    this.triggerTopRedraw();
  };

  initMouseHandlers() {
    this.topCanvas.addEventListener("mousedown", this.mouseDownHandler);
    this.topCanvas.addEventListener("mouseup", this.mouseUpHandler);
    this.topCanvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.topCanvas.addEventListener("wheel", this.mouseWheelHandler, { passive: false });
    this.topCanvas.addEventListener("touchstart", this.touchStartHandler, { passive: false });
    this.topCanvas.addEventListener("touchmove", this.touchMoveHandler, { passive: false });
    this.topCanvas.addEventListener("touchend", this.touchEndHandler, { passive: false });
  }
}
