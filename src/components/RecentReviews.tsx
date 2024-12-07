import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Star } from "lucide-react";

// Mock data - replace with actual data from your backend
const recentReviews = [
  {
    id: 1,
    rating: 5,
    comment: "Amazing food and service!",
    author: "John D.",
    date: "2024-03-07",
  },
  {
    id: 2,
    rating: 4,
    comment: "Great experience overall",
    author: "Sarah M.",
    date: "2024-03-06",
  },
  {
    id: 3,
    rating: 5,
    comment: "Best restaurant in town",
    author: "Mike R.",
    date: "2024-03-05",
  },
  {
    id: 4,
    rating: 3,
    comment: "Good food but slow service",
    author: "Emily L.",
    date: "2024-03-04",
  },
  {
    id: 5,
    rating: 5,
    comment: "Will definitely come back!",
    author: "David S.",
    date: "2024-03-03",
  },
];

export const RecentReviews = () => {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentReviews.map((review) => (
          <div
            key={review.id}
            className="flex items-start space-x-4 border-b border-gray-100 pb-4 last:border-0"
          >
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">{review.comment}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>{review.author}</span>
                <span>{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};