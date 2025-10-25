import React, { useState } from 'react';
import { useVehicles, Achievement } from '@/contexts/VehicleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from '@/components/ImageUpload';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Award, 
  Calendar, 
  MapPin, 
  Building, 
  Star,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';

const AchievementManagement = () => {
  const { achievements, addAchievement, updateAchievement, deleteAchievement, loading } = useVehicles();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    category: 'award' as Achievement['category'],
    icon: '',
    image: '',
    date: '',
    issuer: '',
    location: '',
    isActive: true,
    featured: false,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { value: 'award', label: 'Award', icon: '🏆' },
    { value: 'certification', label: 'Certification', icon: '📜' },
    { value: 'milestone', label: 'Milestone', icon: '🎯' },
    { value: 'recognition', label: 'Recognition', icon: '👏' },
    { value: 'partnership', label: 'Partnership', icon: '🤝' },
  ];

  const resetForm = () => {
    setFormData({
      title: '',
      shortDescription: '',
      detailedDescription: '',
      category: 'award',
      icon: '',
      image: '',
      date: '',
      issuer: '',
      location: '',
      isActive: true,
      featured: false,
      tags: [],
    });
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.shortDescription || !formData.detailedDescription || !formData.date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingAchievement) {
        await updateAchievement(editingAchievement._id, formData);
        toast({
          title: 'Success',
          description: 'Achievement updated successfully!'
        });
        setIsEditModalOpen(false);
      } else {
        await addAchievement(formData);
        toast({
          title: 'Success',
          description: 'Achievement added successfully!'
        });
        setIsAddModalOpen(false);
      }
      resetForm();
      setEditingAchievement(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save achievement',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      shortDescription: achievement.shortDescription,
      detailedDescription: achievement.detailedDescription,
      category: achievement.category,
      icon: achievement.icon || '',
      image: achievement.image || '',
      date: achievement.date,
      issuer: achievement.issuer || '',
      location: achievement.location || '',
      isActive: achievement.isActive,
      featured: achievement.featured || false,
      tags: achievement.tags || [],
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await deleteAchievement(id);
        toast({
          title: 'Success',
          description: 'Achievement deleted successfully!'
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete achievement',
          variant: 'destructive'
        });
      }
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    return categories.find(c => c.value === category)?.icon || '🏆';
  };

  const getCategoryLabel = (category: Achievement['category']) => {
    return categories.find(c => c.value === category)?.label || 'Award';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Achievement Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage company achievements and recognitions</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Achievement</DialogTitle>
              <DialogDescription>
                Add a new achievement, award, or recognition to showcase company success.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Best EV Manufacturer 2024"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="font-medium">
                  Category *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: Achievement['category']) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for cards..."
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailedDescription">Detailed Description *</Label>
                <Textarea
                  id="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
                  placeholder="Detailed description for popup..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuer</Label>
                  <Input
                    id="issuer"
                    value={formData.issuer}
                    onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="e.g., EV Industry Association"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Mumbai, India"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ImageUpload
                  label="Icon"
                  value={formData.icon}
                  onChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                  placeholder="Enter icon URL or upload from device"
                />
                <ImageUpload
                  label="Achievement Image"
                  value={formData.image}
                  onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
                  placeholder="Enter image URL or upload from device"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {achievements.map((achievement) => (
          <Card 
            key={achievement._id} 
            className="hover:shadow-lg transition-all duration-300 overflow-hidden group"
          >
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0 flex-1 space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg leading-none">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{getCategoryIcon(achievement.category)}</span>
                    <span className="truncate">{achievement.title}</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {getCategoryLabel(achievement.category)} • {new Date(achievement.date).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-1.5">
                  {achievement.featured && (
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge 
                    variant={achievement.isActive ? "default" : "secondary"} 
                    className="text-xs whitespace-nowrap"
                  >
                    {achievement.isActive ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {achievement.shortDescription}
              </p>
              
              {achievement.issuer && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{achievement.issuer}</span>
                </div>
              )}
              
              {achievement.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{achievement.location}</span>
                </div>
              )}

              {achievement.tags && achievement.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {achievement.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs whitespace-nowrap"
                    >
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

              <div className="flex items-center gap-2 pt-3 opacity-80 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(achievement)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(achievement._id)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete achievement</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {achievements.length === 0 && (
        <Card className="col-span-full bg-muted/10 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 sm:py-16">
            <Award className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold tracking-tight mb-1">No Achievements Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Start building your company's success story by adding achievements and recognitions.
            </p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add First Achievement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>Edit Achievement</DialogTitle>
            <DialogDescription>
              Update the achievement details and settings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6 overflow-y-auto max-h-[calc(95vh-8rem)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="font-medium">
                  Title *
                </Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Best EV Manufacturer 2024"
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category" className="font-medium">
                  Category *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: Achievement['category']) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="edit-category" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="edit-shortDescription" className="font-medium">
                Short Description *
              </Label>
              <Textarea
                id="edit-shortDescription"
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Brief description for cards..."
                rows={2}
                required
                className="w-full min-h-[80px] resize-y"
              />
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="edit-detailedDescription" className="font-medium">
                Detailed Description *
              </Label>
              <Textarea
                id="edit-detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, detailedDescription: e.target.value }))}
                placeholder="Detailed description for popup..."
                rows={4}
                required
                className="w-full min-h-[120px] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="edit-date" className="font-medium">
                  Date *
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-issuer" className="font-medium">
                  Issuer
                </Label>
                <Input
                  id="edit-issuer"
                  value={formData.issuer}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                  placeholder="e.g., EV Industry Association"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <Label htmlFor="edit-location" className="font-medium">
                Location
              </Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Mumbai, India"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 mt-8">
              <div className="space-y-4">
                <ImageUpload
                  label="Icon"
                  value={formData.icon}
                  onChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                  placeholder="Enter icon URL or upload from device"
                />
              </div>
              <div className="space-y-4">
                <ImageUpload
                  label="Achievement Image"
                  value={formData.image}
                  onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
                  placeholder="Enter image URL or upload from device"
                />
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <Label className="font-medium">Tags</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="w-full"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddTag} 
                  variant="outline"
                  className="w-full sm:w-24"
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1.5 px-2 py-1"
                    >
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-isActive" className="font-medium cursor-pointer">
                  Active
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-featured" className="font-medium cursor-pointer">
                  Featured
                </Label>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                Update Achievement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementManagement;
