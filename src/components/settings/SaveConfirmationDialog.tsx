import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SaveConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  isPending: boolean;
  showDiscardOption: boolean;
}

export function SaveConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  onDiscard,
  onCancel,
  isPending,
  showDiscardOption,
}: SaveConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Changes</DialogTitle>
          <DialogDescription>
            {showDiscardOption
              ? "You have unsaved changes. Would you like to save them before leaving?"
              : "Are you sure you want to save these changes to your settings?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          {showDiscardOption ? (
            <>
              <Button variant="destructive" onClick={onDiscard}>
                Discard Changes
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onConfirm} disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={onConfirm} disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}