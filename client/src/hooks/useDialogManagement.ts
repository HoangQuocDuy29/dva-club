// src/hooks/useDialogManagement.ts
import { useState } from "react";

export type DialogType = "view" | "edit" | "create" | null;

export interface DialogState<T = any> {
  type: DialogType;
  data: T | null;
}

export function useDialogManagement<T = any>() {
  const [dialogState, setDialogState] = useState<DialogState<T>>({
    type: null,
    data: null,
  });

  const openDialog = (type: DialogType, data: T | null = null) => {
    console.log(`🔄 Opening ${type} dialog with data:`, data);
    setDialogState({ type, data });
  };

  const closeDialog = () => {
    console.log("🔒 Closing dialog");
    setDialogState({ type: null, data: null });
  };

  const isDialogOpen = (type: DialogType) => dialogState.type === type;

  return {
    dialogState,
    openDialog,
    closeDialog,
    isDialogOpen,
  };
}
