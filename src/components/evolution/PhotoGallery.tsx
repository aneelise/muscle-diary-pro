import React, { useState } from 'react';
import { Plus, Camera, Trash2, Calendar } from 'lucide-react';
import { useEvolution } from '@/contexts/EvolutionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const PhotoGallery: React.FC = () => {
  const { photos, addPhoto, deletePhoto } = useEvolution();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;

    await addPhoto(selectedFile, description.trim() || undefined);
    
    // Reset form
    setSelectedFile(null);
    setDescription('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsAddDialogOpen(false);
  };

  const handleDialogClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setDescription('');
    setIsAddDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="workout-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Camera className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Fotos de Evolução</h3>
            <p className="text-sm text-muted-foreground">
              {photos.length} foto{photos.length !== 1 ? 's' : ''} cadastrada{photos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-accent" />
                Adicionar Foto de Evolução
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Selecionar Foto</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required
                />
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Progresso após 3 meses de treino..."
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={!selectedFile}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-xl bg-background/50">
          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma foto cadastrada
          </h4>
          <p className="text-muted-foreground mb-4">
            Adicione fotos para acompanhar sua evolução corporal
          </p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Foto
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-background rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.description || 'Foto de evolução'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(photo.date)}</span>
                </div>
                
                {photo.description && (
                  <p className="text-sm text-foreground line-clamp-2">
                    {photo.description}
                  </p>
                )}
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 bg-destructive/80 hover:bg-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Foto</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePhoto(photo.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};