import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export const exportReviews = async (reviews: any[], date: Date) => {
  const filteredReviews = reviews.filter(review => {
    const reviewDate = new Date(review.created_at);
    return (
      reviewDate.getDate() === date.getDate() &&
      reviewDate.getMonth() === date.getMonth() &&
      reviewDate.getFullYear() === date.getFullYear()
    );
  });

  if (filteredReviews.length === 0) return null;

  const csvContent = [
    ["Date", "Time", "Rating", "Reviewer", "Email", "Phone", "Comment"].join(","),
    ...filteredReviews.map(review => [
      format(new Date(review.created_at), "dd/MM/yyyy"),
      format(new Date(review.created_at), "HH:mm"),
      review.rating,
      review.reviewer_name,
      review.email || "",
      review.phone || "",
      `"${review.comment || ""}"`
    ].join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reviews_${format(date, "dd-MM-yyyy")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return filteredReviews.length;
};

export const getYesterdayReviews = (reviews: any[]) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const yesterdayReviews = reviews.filter(review => {
    const reviewDate = new Date(review.created_at);
    return (
      reviewDate.getDate() === yesterday.getDate() &&
      reviewDate.getMonth() === yesterday.getMonth() &&
      reviewDate.getFullYear() === yesterday.getFullYear()
    );
  });

  return yesterdayReviews;
};

export const getReviewerContact = (reviews: any[], name: string) => {
  const reviewer = reviews.find(
    review => review.reviewer_name.toLowerCase() === name.toLowerCase()
  );
  return reviewer ? {
    phone: reviewer.phone,
    email: reviewer.email
  } : null;
};