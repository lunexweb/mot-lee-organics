import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { Review } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReviewCardProps {
  review: Review;
  onMarkHelpful: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onMarkHelpful }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
            <span className="font-medium">{review.userName}</span>
            {review.verified && (
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <h4 className="font-semibold mb-2">{review.title}</h4>
        <p className="text-muted-foreground mb-3">{review.comment}</p>
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkHelpful(review.id)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful ({review.helpful})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
