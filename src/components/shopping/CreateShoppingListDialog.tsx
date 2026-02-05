import { useState } from 'react';
import { shoppingAPI } from '@/lib/api/shopping';
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

interface CreateShoppingListDialogProps {
  groupId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ShoppingListForm {
  name: string;
}

const CreateShoppingListDialog = ({
  groupId,
  open,
  onOpenChange,
  onSuccess,
}: CreateShoppingListDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ShoppingListForm>();

  const onSubmit = async (data: ShoppingListForm) => {
    setIsLoading(true);
    try {
      await shoppingAPI.createList({ group: groupId, name: data.name });
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 bg-card border-border">
        <DialogHeader>
          <DialogTitle>Создать список покупок</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Создайте новый список для группы
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
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShoppingListDialog;