import { useState, useEffect } from 'react';
import { shoppingAPI } from '@/lib/api/shopping';
import { ShoppingItem } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';

interface EditShoppingItemDialogProps {
  item: ShoppingItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedItem: ShoppingItem) => void;
}

interface ItemForm {
  name: string;
  quantity?: string;
  unit?: string;
}

const UNITS = [
  { value: 'none', label: 'Без единиц' },
  { value: 'pcs', label: 'Штук' },
  { value: 'kg', label: 'Килограмм' },
  { value: 'g', label: 'Грамм' },
  { value: 'l', label: 'Литров' },
  { value: 'ml', label: 'Миллилитров' },
];

const EditShoppingItemDialog = ({
  item,
  open,
  onOpenChange,
  onSuccess,
}: EditShoppingItemDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ItemForm>({
    defaultValues: {
      name: item.name,
      quantity: item.quantity?.toString() || '',
      unit: item.unit || 'none',
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        name: item.name,
        quantity: item.quantity?.toString() || '',
        unit: item.unit || 'none',
      });
    }
  }, [open, item, reset]);

  const onSubmit = async (data: ItemForm) => {
    setIsLoading(true);
    try {
      const updatedItem = await shoppingAPI.updateItem(item.id, {
        name: data.name,
        quantity: data.quantity ? parseFloat(data.quantity) : undefined,
        unit: data.unit === 'none' ? '' : data.unit,
      });
      onOpenChange(false);
      onSuccess(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 bg-card border-border">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Измените данные товара
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название товара *</label>
            <Input
              {...register('name', { required: 'Обязательное поле' })}
              placeholder="Молоко"
              className="h-11 text-base bg-background border-input"
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Количество</label>
              <Input
                {...register('quantity')}
                type="number"
                step="0.01"
                placeholder="1"
                className="h-11 text-base bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Единицы</label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 bg-background border-input">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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

export default EditShoppingItemDialog;