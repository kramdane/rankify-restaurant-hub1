import { format } from "date-fns";

export const processSpecialCommands = async (message: string, reviews: any[] | undefined) => {
  const lowerMessage = message.toLowerCase();

  // Handle export command
  if (lowerMessage.startsWith("export reviews")) {
    const date = new Date();
    if (!reviews) return "No reviews available to export.";
    const count = await exportReviews(reviews, date);
    return count ? `Exported ${count} reviews for ${format(date, 'dd/MM/yyyy')}` : "No reviews found for the specified date.";
  }

  // Handle yesterday's reviews command
  if (lowerMessage.includes("yesterday's reviews") || lowerMessage.includes("reviews from yesterday")) {
    if (!reviews) return "No reviews available.";
    const yesterdayReviews = getYesterdayReviews(reviews);
    if (yesterdayReviews.length === 0) return "No reviews were received yesterday.";
    return `Yesterday's Reviews:\n${yesterdayReviews.map(review => 
      `- ${review.reviewer_name}: ${review.rating}⭐ - "${review.comment}"`
    ).join('\n')}`;
  }

  // Handle contact info command
  if (lowerMessage.startsWith("get contact for ")) {
    if (!reviews) return "No reviews available.";
    const name = message.slice("get contact for ".length).trim();
    const contact = getReviewerContact(reviews, name);
    return contact 
      ? `Contact info for ${name}:\nPhone: ${contact.phone || 'N/A'}\nEmail: ${contact.email || 'N/A'}`
      : `No reviewer found with the name "${name}"`;
  }

  // If no special command matches, return null to proceed with normal AI processing
  return null;
};

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