import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

export const StarRating = ({ value, onChange }: StarRatingProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="focus:outline-none group"
        >
          <Star
            className={`w-8 h-8 ${
              rating <= value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 group-hover:fill-yellow-400 group-hover:text-yellow-400"
            } transition-colors peer`}
          />
          {[...Array(rating - 1)].map((_, index) => (
            <Star
              key={index}
              className={`w-8 h-8 peer-hover:fill-yellow-400 peer-hover:text-yellow-400 ${
                index + 1 < value
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              } transition-colors absolute left-0`}
            />
          ))}
        </button>
      ))}
    </div>
  );
};