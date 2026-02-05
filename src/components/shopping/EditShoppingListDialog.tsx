import { useState, useEffect } from 'react';
import { shoppingAPI } from '@/lib/api/shopping';
import { ShoppingList } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

interface EditShoppingListDialogProps {
  list: ShoppingList;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedList: ShoppingList) => void;
}

interface ShoppingListForm {
  name: string;
}

const EditShoppingListDialog = ({
  list,
  open,
  onOpenChange,
  onSuccess,
}: EditShoppingListDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShoppingListForm>({
    defaultValues: {
      name: list.name,
    }
  });

  useEffect(() => {
    if (open) {
      reset({ name: list.name });
    }
  }, [open, list, reset]);

  const onSubmit = async (data: ShoppingListForm) => {
    setIsLoading(true);
    try {
      const updatedList = await shoppingAPI.updateList(list.id, data);
      onOpenChange(false);
      onSuccess(updatedList);
    } catch (error) {
      console.error('Error updating list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Редактировать список</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Измените название списка покупок
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название списка *</label>
            <Input
              {...register('name', { required: 'Обязательное поле' })}
              placeholder="Продукты на неделю"
              className="h-11 bg-background border-input"
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShoppingListDialog;
