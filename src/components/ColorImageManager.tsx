import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  Star,
  Trash2,
  FileImage,
  Download,
  Palette
} from 'lucide-react';

interface ColorImage {
  color: string;
  images: string[];
  primaryImage?: string;
}

interface ColorImageManagerProps {
  colors: string[];
  colorImages: ColorImage[];
  onColorImagesChange: (colorImages: ColorImage[]) => void;
}

const ColorImageManager = ({ colors, colorImages, onColorImagesChange }: ColorImageManagerProps) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-create color image entries for all colors
  useEffect(() => {
    const newColorImages = colors.map(color => {
      const existing = colorImages.find(ci => ci.color === color);
      return existing || {
        color,
        images: [],
        primaryImage: ''
      };
    });
    
    // Only update if there are new colors
    const hasNewColors = colors.some(color => !colorImages.find(ci => ci.color === color));
    if (hasNewColors) {
      onColorImagesChange(newColorImages);
    }
  }, [colors, colorImages, onColorImagesChange]);

  const handleAddColorImage = (color: string) => {
    const existingColorImage = colorImages.find(ci => ci.color === color);
    if (existingColorImage) {
      return;
    }

    const newColorImage: ColorImage = {
      color,
      images: [],
      primaryImage: ''
    };

    onColorImagesChange([...colorImages, newColorImage]);
  };

  const handleRemoveColorImage = (color: string) => {
    onColorImagesChange(colorImages.filter(ci => ci.color !== color));
  };

  const handleAddImage = (color: string, imageUrl: string) => {
    if (!imageUrl.trim()) return;

    console.log('Adding image:', { color, imageUrl }); // Debug log

    const updatedColorImages = colorImages.map(ci => {
      if (ci.color === color) {
        const newImages = [...ci.images, imageUrl.trim()];
        console.log('Updated images for color:', color, newImages); // Debug log
        return {
          ...ci,
          images: newImages,
          primaryImage: ci.primaryImage || imageUrl.trim()
        };
      }
      return ci;
    });

    console.log('Final colorImages:', updatedColorImages); // Debug log
    onColorImagesChange(updatedColorImages);
  };

  // Convert file to base64 URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null, color: string) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      alert('Please select only image files (jpg, png, gif, webp)');
      return;
    }

    try {
      const base64Urls = await Promise.all(
        imageFiles.map(file => fileToBase64(file))
      );

      const updatedColorImages = colorImages.map(ci => {
        if (ci.color === color) {
          const newImages = [...ci.images, ...base64Urls];
          return {
            ...ci,
            images: newImages,
            primaryImage: ci.primaryImage || base64Urls[0]
          };
        }
        return ci;
      });

      onColorImagesChange(updatedColorImages);
    } catch (error) {
      console.error('Error converting files to base64:', error);
      alert('Error uploading files. Please try again.');
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (selectedColor) {
      handleFileUpload(e.dataTransfer.files, selectedColor);
    }
  };

  const handleRemoveImage = (color: string, imageIndex: number) => {
    const updatedColorImages = colorImages.map(ci => {
      if (ci.color === color) {
        const newImages = ci.images.filter((_, index) => index !== imageIndex);
        const removedImage = ci.images[imageIndex];
        return {
          ...ci,
          images: newImages,
          primaryImage: ci.primaryImage === removedImage ? newImages[0] || '' : ci.primaryImage
        };
      }
      return ci;
    });

    onColorImagesChange(updatedColorImages);
  };

  const handleSetPrimaryImage = (color: string, imageUrl: string) => {
    const updatedColorImages = colorImages.map(ci => {
      if (ci.color === color) {
        return {
          ...ci,
          primaryImage: imageUrl
        };
      }
      return ci;
    });

    onColorImagesChange(updatedColorImages);
  };

  const getColorImages = (color: string): ColorImage | undefined => {
    return colorImages.find(ci => ci.color === color);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Color Images Management</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add images for each color variant of the vehicle. Users will see different images based on their color selection.
        </p>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <Label htmlFor="color-selection">Select Color to Manage Images</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map(color => {
            const colorImage = getColorImages(color);
            const hasImages = colorImage && colorImage.images.length > 0;
            
            return (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedColor(color)}
                className="relative"
              >
                {color}
                {hasImages && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {colorImage?.images.length}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Color Image Management */}
      {selectedColor && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedColor} Images</CardTitle>
                <CardDescription>
                  Add and manage images for the {selectedColor} color variant
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddColorImage(selectedColor)}
                  disabled={getColorImages(selectedColor) !== undefined}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Color
                </Button>
                {getColorImages(selectedColor) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveColorImage(selectedColor)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {getColorImages(selectedColor) ? (
              <>
                {/* Upload Methods */}
                <div className="space-y-6">
                  
                  {/* Method 1: URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`image-url-${selectedColor}`} className="text-base font-semibold">
                      Method 1: Add Image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`image-url-${selectedColor}`}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                              handleAddImage(selectedColor, input.value);
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value.trim()) {
                            handleAddImage(selectedColor, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Add URL
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter a valid image URL and press Enter or click Add URL
                    </p>
                  </div>

                  {/* Method 2: File Upload */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Method 2: Upload Local Files
                    </Label>
                    
                    {/* Drag and Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <FileImage className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">
                        {isDragOver ? 'Drop images here' : 'Drag & drop images here'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        or click to browse files
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, selectedColor)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports JPG, PNG, GIF, WebP formats. Multiple files can be selected.
                    </p>
                  </div>

                  {/* Bulk URL Upload */}
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Method 3: Bulk URL Upload
                    </Label>
                    <div className="p-4 bg-muted rounded-lg">
                      <Label htmlFor={`bulk-images-${selectedColor}`} className="text-sm font-medium">
                        Paste multiple URLs (one per line)
                      </Label>
                      <textarea
                        id={`bulk-images-${selectedColor}`}
                        className="w-full mt-2 p-3 border rounded-md h-24 text-sm resize-none"
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                        onChange={(e) => {
                          const urls = e.target.value
                            .split('\n')
                            .map(url => url.trim())
                            .filter(url => url && url.startsWith('http'));

                          if (urls.length > 0) {
                            urls.forEach(url => handleAddImage(selectedColor, url));
                            e.target.value = '';
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Paste multiple image URLs, one per line, and they will be added automatically
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display Images */}
                <div className="space-y-3">
                  <Label htmlFor="image-gallery">Images ({getColorImages(selectedColor)?.images.length || 0})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {getColorImages(selectedColor)?.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`${selectedColor} variant ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <div className="text-center">
                              <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">Image not found</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Image Actions */}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0"
                            onClick={() => handleSetPrimaryImage(selectedColor, imageUrl)}
                            title="Set as primary image"
                          >
                            <Star className={`h-4 w-4 ${
                              getColorImages(selectedColor)?.primaryImage === imageUrl 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveImage(selectedColor, index)}
                            title="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Primary Image Badge */}
                        {getColorImages(selectedColor)?.primaryImage === imageUrl && (
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                              Primary
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {getColorImages(selectedColor)?.images.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-gray-300 rounded-lg">
                      <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">No images added yet</p>
                      <p className="text-sm">Add image URLs above to get started</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4" />
                <p>No images configured for {selectedColor}</p>
                <p className="text-sm">Click "Add Color" to start adding images</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Color Images Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {colors.map(color => {
              const colorImage = getColorImages(color);
              const imageCount = colorImage?.images.length || 0;
              const hasPrimary = colorImage?.primaryImage ? 'Yes' : 'No';
              
              return (
                <div key={color} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="font-medium">{color}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{imageCount} images</span>
                    <span>Primary: {hasPrimary}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorImageManager;
