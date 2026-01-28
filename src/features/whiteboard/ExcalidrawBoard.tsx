'use client';

import clsx from "clsx";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/core/ui/Button";

import styles from "./ExcalidrawBoard.module.css";

type ExcalidrawImperativeAPI = {
  updateScene: (opts: { elements?: readonly any[]; appState?: any; files?: any }) => void;
  getSceneElements: () => readonly any[];
  getAppState: () => any;
  getFiles: () => Record<string, any>;
};

type ExcalidrawInitialDataState = {
  elements?: any[];
  appState?: any;
  files?: Record<string, any>;
};

type ExcalidrawProps = {
  initialData?: ExcalidrawInitialDataState;
  readOnly?: boolean;
  className?: string;
  onChange?: (data: ExcalidrawInitialDataState) => void;
};

type ExcalidrawBoardProps = ExcalidrawProps & {
  boardId?: string;
};

const Excalidraw = dynamic(() => import("@excalidraw/excalidraw").then((m) => m.Excalidraw), {
  ssr: false,
  loading: () => <div style={{ height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Excalidraw…</div>,
});

const storageKey = (id: string) => `excalidraw-board-${id}`;

export function ExcalidrawBoard({
  boardId = "default",
  initialData,
  readOnly = true,
  className,
  onChange,
}: ExcalidrawBoardProps) {
  const [isEditing, setIsEditing] = useState(!readOnly);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [loadedData, setLoadedData] = useState<ExcalidrawInitialDataState | undefined>(undefined);

  const persistedData = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    try {
      const raw = window.localStorage.getItem(storageKey(boardId));
      return raw ? (JSON.parse(raw) as ExcalidrawInitialDataState) : undefined;
    } catch {
      return undefined;
    }
  }, [boardId]);

  useEffect(() => {
    setLoadedData(persistedData ?? initialData);
  }, [persistedData, initialData]);

  const handleChange = () => {
    if (!excalidrawAPI) return;
    const data: ExcalidrawInitialDataState = {
      elements: [...excalidrawAPI.getSceneElements()],
      appState: excalidrawAPI.getAppState(),
      files: excalidrawAPI.getFiles(),
    };
    onChange?.(data);
    try {
      window.localStorage.setItem(storageKey(boardId), JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  return (
    <div className={clsx(styles.wrapper, className)}>
      <div className={styles.toolbar}>
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? "Switch to view" : "Edit"}
        </Button>
        <span className={styles.status}>{isEditing ? "Editing" : "View-only"}</span>
      </div>
      <div className={styles.canvas}>
        <Excalidraw
          initialData={loadedData}
          viewModeEnabled={!isEditing}
          onChange={handleChange}
          excalidrawAPI={(api: any) => setExcalidrawAPI(api as ExcalidrawImperativeAPI)}
        />
      </div>
    </div>
  );
}
