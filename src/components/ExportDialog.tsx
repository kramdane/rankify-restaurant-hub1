import { format } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";

interface ExportDialogProps {
  onExport: (startDate: Date, endDate: Date) => void;
}

export function ExportDialog({ onExport }: ExportDialogProps) {
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  const handleExport = () => {
    if (!startDate || !endDate) return;
    onExport(startDate, endDate);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exporter les avis</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label>Date de début</label>
            <DatePicker date={startDate} setDate={setStartDate} />
          </div>
          <div className="flex flex-col gap-2">
            <label>Date de fin</label>
            <DatePicker date={endDate} setDate={setEndDate} />
          </div>
          <Button 
            onClick={handleExport}
            disabled={!startDate || !endDate}
            className="w-full"
          >
            Exporter en CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}