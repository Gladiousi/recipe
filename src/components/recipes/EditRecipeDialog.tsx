import { useState, useEffect } from 'react';
import { recipesAPI } from '@/lib/api/recipes';
import { Recipe } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';

interface EditRecipeDialogProps {
  recipe: Recipe;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedRecipe: Recipe) => void;
}

interface RecipeForm {
  title: string;
  description: string;
  cooking_time?: string;
  servings?: string;
  image?: FileList;
}

const EditRecipeDialog = ({
  recipe,
  open,
  onOpenChange,
  onSuccess,
}: EditRecipeDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RecipeForm>({
    defaultValues: {
      title: recipe.title,
      description: recipe.description,
      cooking_time: recipe.cooking_time?.toString() || '',
      servings: recipe.servings?.toString() || '',
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        title: recipe.title,
        description: recipe.description,
        cooking_time: recipe.cooking_time?.toString() || '',
        servings: recipe.servings?.toString() || '',
      });
    }
  }, [open, recipe, reset]);

  const onSubmit = async (data: RecipeForm) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      
      if (data.cooking_time) {
        formData.append('cooking_time', data.cooking_time);
      }
      if (data.servings) {
        formData.append('servings', data.servings);
      }
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const updatedRecipe = await recipesAPI.update(recipe.id, formData);
      onOpenChange(false);
      onSuccess(updatedRecipe); // Передаем обновленный рецепт
    } catch (error) {
      console.error('Error updating recipe:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle>Редактировать рецепт</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Измените данные рецепта
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название рецепта *</label>
            <Input
              {...register('title', { required: 'Обязательное поле' })}
              placeholder="Борщ украинский"
              className="h-11 bg-background border-input"
              autoFocus
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Описание и приготовление *</label>
            <Textarea
              {...register('description', { required: 'Обязательное поле' })}
              placeholder="## Ингредиенты..."
              rows={8}
              className="font-mono text-sm bg-background border-input"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Время (мин)</label>
              <Input
                {...register('cooking_time')}
                type="number"
                placeholder="60"
                className="h-11 bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Порций</label>
              <Input
                {...register('servings')}
                type="number"
                placeholder="4"
                className="h-11 bg-background border-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Изменить изображение</label>
            <Input
              {...register('image')}
              type="file"
              accept="image/*"
              className="h-11 cursor-pointer bg-background border-input"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-11">
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipeDialog;
