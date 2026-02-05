import { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { X, Plus } from 'lucide-react';

interface RecipeForm {
  title: string;
  description: string;
  cooking_time?: string;
  servings?: string;
  image?: FileList;
  ingredients: {
    name: string;
    quantity?: string;
    unit?: string;
  }[];
}

interface CreateRecipeDialogProps {
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (newRecipe: Recipe) => void;
}

const CreateRecipeDialog = ({
  groupId,
  open,
  onOpenChange,
  onSuccess,
}: CreateRecipeDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    getValues,
    control,
  } = useForm<RecipeForm>({
    defaultValues: {
      title: '',
      description: '',
      cooking_time: '',
      servings: '',
      ingredients: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

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

  const onSubmit = async (data: RecipeForm) => {
    setIsLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('group', groupId.toString());
      formData.append('title', data.title);
      formData.append('description', data.description);

      if (data.cooking_time) formData.append('cooking_time', data.cooking_time);
      if (data.servings) formData.append('servings', data.servings);
      if (data.image?.[0]) formData.append('image', data.image[0]);

      // Конвертируем ингредиенты
      const ingredientsForBackend = data.ingredients
        .map((ing) => ({
          name: ing.name,
          quantity: ing.quantity ? parseFloat(ing.quantity) || null : null,
          unit: ing.unit || '',
        }))
        .filter((ing) => ing.name.trim());

      if (ingredientsForBackend.length > 0) {
        formData.append('ingredients', JSON.stringify(ingredientsForBackend));
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
      <DialogContent className="sm:max-w-[500px] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto bg-card border-border">
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

          {/* Название */}
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

          {/* Описание + Markdown toolbar */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Описание *</label>
            
            {/* Markdown кнопки — адаптивные */}
            <div className="flex flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertAtCursor('\n## Заголовок\n')}
              >
                H2
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => insertAtCursor('**текст**')}
              >
                <strong>B</strong>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() =>
                  insertAtCursor('\n## Ингредиенты\n- Продукт 1\n- Продукт 2\n\n')
                }
              >
                Список
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() =>
                  insertAtCursor('\n## Приготовление\n1. Шаг 1\n2. Шаг 2\n\n')
                }
              >
                Шаги
              </Button>
            </div>

            <Textarea
              {...register('description', { required: 'Обязательное поле' })}
              ref={(el) => {
                register('description').ref(el);
                descriptionRef.current = el;
              }}
              placeholder="## Ингредиенты
- Свекла — 2 шт
- Капуста — 300 г

## Приготовление
1. Нарезать свеклу
2. Варить 30 минут"
              rows={6}
              className="font-mono text-xs sm:text-sm bg-background border-input resize-none"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Ингредиенты — мобильная сетка */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ингредиенты (опционально)</label>
            <div className="space-y-2 max-h-50 overflow-y-auto rounded-lg">
              {fields.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Добавьте ингредиенты
                </p>
              )}
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-2 p-2 bg-card rounded border border-border"
                >
                  <Input
                    {...register(`ingredients.${index}.name` as const, {
                      required: 'Обязательно',
                    })}
                    placeholder="Свекла"
                    className="h-9 text-sm flex-1"
                  />

                  <div className="flex gap-2">
                    <Input
                      {...register(`ingredients.${index}.quantity` as const)}
                      type="number"
                      step="0.01"
                      placeholder="200"
                      className="h-9 w-20 text-sm"
                    />
                    <select
                      {...register(`ingredients.${index}.unit` as const)}
                      className="h-9 flex-1 min-w-0 border rounded-md px-2 text-xs sm:text-sm bg-background"
                    >
                      <option value="">По вкусу</option>
                      <option value="g">г</option>
                      <option value="kg">кг</option>
                      <option value="pcs">шт</option>
                      <option value="l">л</option>
                      <option value="ml">мл</option>
                      <option value="tbsp">ст.л.</option>
                      <option value="tsp">ч.л.</option>
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 shrink-0"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', quantity: '', unit: '' })}
              className="w-full h-9 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Добавить ингредиент
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Время (мин)</label>
              <Input
                {...register('cooking_time')}
                type="number"
                placeholder="60"
                className="h-10 bg-background border-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Порций</label>
              <Input
                {...register('servings')}
                type="number"
                placeholder="4"
                className="h-10 bg-background border-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Изображение</label>
            <Input
              {...register('image')}
              type="file"
              accept="image/*"
              className="h-10 cursor-pointer bg-background border-input text-sm file:mr-2 file:text-xs"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="flex-1 h-10"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 h-10">
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeDialog;
