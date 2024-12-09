import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
}

export const ChatInput = ({
  input,
  setInput,
  handleSubmit,
  isProcessing,
}: ChatInputProps) => {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your reviews..."
        disabled={isProcessing}
        className="flex-1"
      />
      <Button type="submit" disabled={isProcessing} size="icon">
        ✈️
      </Button>
    </form>
  );
};