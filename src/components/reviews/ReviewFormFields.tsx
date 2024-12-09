import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { Label } from "@/components/ui/label";

interface ReviewFormFieldsProps {
  rating: number;
  setRating: (rating: number) => void;
}

export function ReviewFormFields({ rating, setRating }: ReviewFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reviewer_name" className="text-[#333333] font-medium">
          Your Name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="reviewer_name"
          name="reviewer_name"
          required
          placeholder="Enter your name"
          className="w-full border-[#E3EFFE] focus:border-[#007BFF] focus:ring-[#007BFF]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-[#333333] font-medium">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          placeholder="Enter your email"
          className="w-full border-[#E3EFFE] focus:border-[#007BFF] focus:ring-[#007BFF]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-[#333333] font-medium">
          Phone Number
        </Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          className="w-full border-[#E3EFFE] focus:border-[#007BFF] focus:ring-[#007BFF]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[#333333] font-medium">
          Rating <span className="text-red-500">*</span>
        </Label>
        <div className="pt-2">
          <StarRating value={rating} onChange={setRating} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment" className="text-[#333333] font-medium">
          Your Review <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="comment"
          name="comment"
          required
          placeholder="Write your review here"
          rows={4}
          className="w-full border-[#E3EFFE] focus:border-[#007BFF] focus:ring-[#007BFF]"
        />
      </div>
    </div>
  );
}