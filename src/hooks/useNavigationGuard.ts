import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useNavigationGuard(hasUnsavedChanges: boolean) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const unblock = () => {
      window.onbeforeunload = null;
    };

    window.onbeforeunload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    return unblock;
  }, [hasUnsavedChanges]);

  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(path);
      setShowSaveDialog(true);
      return false;
    }
    navigate(path);
    return true;
  };

  return {
    showSaveDialog,
    setShowSaveDialog,
    pendingNavigation,
    setPendingNavigation,
    handleNavigation
  };
}