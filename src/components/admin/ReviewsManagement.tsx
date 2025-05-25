
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Review {
  id: string;
  name: string;
  image: string | null;
  review: string;
  rating: number;
  gender: string | null;
  source: string | null;
  entered_on: string;
}

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    review: "",
    rating: 5,
    gender: "",
    source: "",
  });

  // Fetch reviews from database
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("entered_on", { ascending: false });

      if (error) {
        console.error("Error fetching reviews:", error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingReview) {
        // Update existing review
        const { error } = await supabase
          .from("reviews")
          .update({
            name: formData.name,
            image: formData.image || null,
            review: formData.review,
            rating: formData.rating,
            gender: formData.gender || null,
            source: formData.source || null,
          })
          .eq("id", editingReview.id);

        if (error) {
          console.error("Error updating review:", error);
          return;
        }
      } else {
        // Create new review
        const { error } = await supabase.from("reviews").insert({
          name: formData.name,
          image: formData.image || null,
          review: formData.review,
          rating: formData.rating,
          gender: formData.gender || null,
          source: formData.source || null,
        });

        if (error) {
          console.error("Error creating review:", error);
          return;
        }
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        image: "",
        review: "",
        rating: 5,
        gender: "",
        source: "",
      });
      setEditingReview(null);
      setIsDialogOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (review: Review) => {
    setFormData({
      name: review.name,
      image: review.image || "",
      review: review.review,
      rating: review.rating,
      gender: review.gender || "",
      source: review.source || "",
    });
    setEditingReview(review);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) {
        console.error("Error deleting review:", error);
        return;
      }

      fetchReviews();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reviews Management</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingReview(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingReview ? "Edit Review" : "Add New Review"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter reviewer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image URL (optional)
                  </label>
                  <Input
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Review
                  </label>
                  <Textarea
                    required
                    value={formData.review}
                    onChange={(e) =>
                      setFormData({ ...formData, review: e.target.value })
                    }
                    placeholder="Enter review text"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Rating
                  </label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, rating: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating !== 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender (optional)
                  </label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Source (optional)
                  </label>
                  <Input
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    placeholder="e.g., Google, Booking.com, TripAdvisor"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingReview ? "Update" : "Create"} Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingReview(null);
                      setFormData({
                        name: "",
                        image: "",
                        review: "",
                        rating: 5,
                        gender: "",
                        source: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {review.review}
                  </TableCell>
                  <TableCell>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </TableCell>
                  <TableCell className="capitalize">
                    {review.gender || "Not specified"}
                  </TableCell>
                  <TableCell>
                    {review.source || "Not specified"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(review.entered_on), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(review)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No reviews found. Add your first review!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewsManagement;
