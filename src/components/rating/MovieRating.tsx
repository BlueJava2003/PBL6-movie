"use client";

import { useState, useEffect } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { jwtDecode } from "jwt-decode";
import { parseCookies } from "nookies";
import { sendRequest } from "@/utils/api";

interface MovieRatingProps {
  movieId: number;
}

interface JwtPayload {
  id: string;
}

interface Review {
  userId: string;
  rating: number;
  comment: string;
}

function ReviewList({ reviews }: { reviews: Review[]; currentUserId: string | null }) {
  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold text-primary">Đánh giá từ người xem khác</h3>
      {reviews.length === 0 ? (
        <p className="text-muted-foreground">Chưa có đánh giá nào từ người xem khác cho phim này.</p>
      ) : (
        reviews.map((review, index) => (
          <Card key={index} className="bg-card hover:bg-accent transition-colors duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    {typeof review.userId === "string" ? review.userId.slice(0, 8) : String(review.userId).slice(0, 8)}
                    ...
                  </span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted stroke-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-card-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default function MovieRating({ movieId }: MovieRatingProps) {
  const [canRate, setCanRate] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  useEffect(() => {
    const checkBookingAndLoadReview = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies.accessToken;
        if (!token) {
          setMessage("Vui lòng đăng nhập để đánh giá");
          return;
        }

        const decodedToken = jwtDecode<JwtPayload>(token);
        const accountId = decodedToken.id;

        if (!accountId) {
          setMessage("Không thể xác thực người dùng");
          return;
        }

        setUserId(accountId);

        const res = await sendRequest<IBackendRes<IBooking[]>>({
          url: `${process.env.customURL}/booking/admin/account/${accountId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data) {
          setCanRate(true);
          const reviews = JSON.parse(localStorage.getItem("movieReviews") || "{}");
          const movieReviews = Array.isArray(reviews[movieId]) ? reviews[movieId] : [];
          setAllReviews(movieReviews);
          const userReview = movieReviews.find((review: Review) => review.userId === accountId);
          if (userReview) {
            setExistingReview(userReview);
            setRating(userReview.rating);
            setComment(userReview.comment);
          }
        } else {
          setMessage("Bạn cần đặt vé trước khi đánh giá");
        }
      } catch (error) {
        console.error("Error checking booking:", error);
        setMessage("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    };

    checkBookingAndLoadReview();
  }, [movieId]);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setMessage("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!userId) {
      setMessage("Không thể xác định người dùng");
      return;
    }

    const allStoredReviews = JSON.parse(localStorage.getItem("movieReviews") || "{}");
    const movieReviews = Array.isArray(allStoredReviews[movieId]) ? allStoredReviews[movieId] : [];

    const newReview = { userId, rating, comment };

    const existingIndex = movieReviews.findIndex((review: Review) => review.userId === userId);
    if (existingIndex !== -1) {
      movieReviews[existingIndex] = newReview;
    } else {
      movieReviews.push(newReview);
    }

    allStoredReviews[movieId] = movieReviews;
    localStorage.setItem("movieReviews", JSON.stringify(allStoredReviews));

    setMessage("Cảm ơn bạn đã đánh giá!");
    setExistingReview(newReview);
    setAllReviews(movieReviews);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Đánh giá phim</CardTitle>
        <CardDescription>Chia sẻ ý kiến của bạn về bộ phim</CardDescription>
      </CardHeader>
      <CardContent>
        {canRate ? (
          <div className="space-y-6">
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                    star <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted stroke-muted-foreground"
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment" className="text-lg font-medium">
                Bình luận
              </Label>
              <Textarea
                id="comment"
                placeholder="Nhập bình luận của bạn"
                value={comment}
                onChange={(e: any) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 font-medium">{message}</p>
        )}
        {existingReview && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-lg mb-2 text-primary">Đánh giá của bạn:</h4>
            <div className="flex items-center mb-2">
              <span className="mr-2 font-medium">Số sao:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= existingReview.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted stroke-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p>
              <span className="font-medium">Bình luận:</span> {existingReview.comment}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {canRate && (
          <Button className="px-6 py-2 text-white bg-primary hover:bg-primary/90" onClick={handleSubmit}>
            {existingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
          </Button>
        )}
      </CardFooter>
      <ReviewList reviews={allReviews} currentUserId={userId} />
    </Card>
  );
}
