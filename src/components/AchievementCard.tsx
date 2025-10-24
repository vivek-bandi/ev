import React, { useState } from 'react';
import { Achievement } from '@/contexts/VehicleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Award, 
  Calendar, 
  MapPin, 
  Building, 
  Star, 
  ExternalLink,
  X
} from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getCategoryIcon = (category: Achievement['category']) => {
    const icons = {
      award: '🏆',
      certification: '📜',
      milestone: '🎯',
      recognition: '👏',
      partnership: '🤝'
    };
    return icons[category] || '🏆';
  };

  const getCategoryLabel = (category: Achievement['category']) => {
    const labels = {
      award: 'Award',
      certification: 'Certification',
      milestone: 'Milestone',
      recognition: 'Recognition',
      partnership: 'Partnership'
    };
    return labels[category] || 'Award';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card 
        className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-l-4 border-l-primary/20 hover:border-l-primary"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryIcon(achievement.category)}</span>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {achievement.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {getCategoryLabel(achievement.category)}
                  </CardDescription>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {achievement.featured && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {achievement.shortDescription}
          </p>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(achievement.date)}</span>
          </div>
          
          {achievement.issuer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{achievement.issuer}</span>
            </div>
          )}
          
          {achievement.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{achievement.location}</span>
            </div>
          )}

          {achievement.tags && achievement.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {achievement.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {achievement.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{achievement.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="pt-2">
            <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">{getCategoryIcon(achievement.category)}</span>
              <div>
                <DialogTitle className="text-2xl">{achievement.title}</DialogTitle>
                <DialogDescription className="text-lg">
                  {getCategoryLabel(achievement.category)}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Achievement Image */}
            {achievement.image && (
              <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Detailed Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About This Achievement</h3>
              <p className="text-muted-foreground leading-relaxed">
                {achievement.detailedDescription}
              </p>
            </div>

            {/* Achievement Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(achievement.date)}</p>
                  </div>
                </div>
                
                {achievement.issuer && (
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Issued By</p>
                      <p className="text-sm text-muted-foreground">{achievement.issuer}</p>
                    </div>
                  </div>
                )}
                
                {achievement.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{achievement.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {achievement.tags && achievement.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {achievement.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Featured Badge */}
            {achievement.featured && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Featured Achievement</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AchievementCard;
