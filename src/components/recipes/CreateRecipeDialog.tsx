import { useRef, useState } from 'react';
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

interface CreateRecipeDialogProps {
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newRecipe: Recipe) => void;
}

interface RecipeForm {
  title: string;
  description: string;
  cooking_time?: string;
  servings?: string;
  image?: FileList;
}

const CreateRecipeDialog = ({
  groupId,
  open,
  onOpenChange,
  onSuccess,
}: CreateRecipeDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<RecipeForm>();

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const insertAtCursor = (snippet: string) => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const value = getValues('description') || '';
    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;

    const before = value.slice(0, start);
    const after = value.slice(end);

    const nextValue = before + snippet + after;

    setValue('description', nextValue, { shouldDirty: true });
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = before.length + snippet.length;
      textarea.setSelectionRange(pos, pos);
    });
  };

  const handleInsertHeading = () => {
    insertAtCursor('\n## Заголовок\n');
  };

  const handleInsertIngredients = () => {
    insertAtCursor(
      '\n## Ингредиенты\n- Продукт 1\n- Продукт 2\n\n'
    );
  };

  const handleInsertSteps = () => {
    insertAtCursor(
      '\n## Приготовление\n1. Шаг 1\n2. Шаг 2\n\n'
    );
  };

  const handleInsertBold = () => {
    insertAtCursor('**текст**');
  };

  const onSubmit = async (data: RecipeForm) => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('group', groupId.toString());
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

      const newRecipe = await recipesAPI.create(formData);

      const recipeWithDefaults: Recipe = {
        ...newRecipe,
        is_pinned: newRecipe.is_pinned ?? false,
        ingredients: newRecipe.ingredients ?? [],
      };

      reset();
      onOpenChange(false);
      onSuccess(recipeWithDefaults);
    } catch (error: any) {
      console.error('Error creating recipe:', error);
      setError('Ошибка создания рецепта');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle>Добавить рецепт</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Создайте новый рецепт для группы
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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

            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleInsertHeading}
              >
                H2
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleInsertBold}
              >
                **Жирный**
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleInsertIngredients}
              >
                + Ингредиенты
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleInsertSteps}
              >
                + Шаги
              </Button>
            </div>

            <Textarea
              {...register('description', { required: 'Обязательное поле' })}
              ref={(el) => {
                register('description').ref(el);
                descriptionRef.current = el;
              }}
              placeholder={`Опишите рецепт... Поддерживается Markdown:

## Ингредиенты
- Свекла — 2 шт
- Капуста — 300 г

## Приготовление
1. Нарезать свеклу
2. Варить 30 минут`}
              rows={8}
              className="font-mono text-sm bg-background border-input"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
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
            <label className="text-sm font-medium">Изображение</label>
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
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeDialog;
