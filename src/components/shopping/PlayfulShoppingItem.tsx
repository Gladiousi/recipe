import { useState } from 'react';
import { ShoppingItem } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pin, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shoppingAPI } from '@/lib/api/shopping';
import EditShoppingItemDialog from './EditShoppingItemDialog';

interface PlayfulShoppingItemProps {
  item: ShoppingItem;
  onUpdate: (updatedItem: ShoppingItem) => void;
  onDelete: (itemId: number) => void;
}

const PlayfulShoppingItem = ({ item, onUpdate, onDelete }: PlayfulShoppingItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleToggleCheck = async () => {
    setIsAnimating(true);
    try {
      const updated = await shoppingAPI.toggleCheck(item.id);
      setTimeout(() => {
        onUpdate(updated);
        setIsAnimating(false);
      }, 300);
    } catch (error) {
      console.error('Error toggling item:', error);
      setIsAnimating(false);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = await shoppingAPI.toggleItemPin(item.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Удалить товар?')) {
      try {
        await shoppingAPI.deleteItem(item.id);
        onDelete(item.id);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditOpen(true);
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex items-start gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer",
          "hover:bg-accent/50",
          item.is_checked && "opacity-60",
          item.is_pinned && "bg-primary/5 border-l-4 border-primary",
          isAnimating && "scale-95"
        )}
        onClick={handleToggleCheck}
      >
        <div className="relative shrink-0 mt-0.5">
          <Checkbox
            checked={item.is_checked}
            className={cn(
              "h-5 w-5 transition-all duration-300",
              item.is_checked && "border-primary bg-primary"
            )}
          />
          {item.is_checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
            </div>
          )}
        </div>

        <div className="flex-1 relative min-w-0">
          <div className="relative inline-block">
            <p
              className={cn(
                "text-base font-medium transition-all duration-300",
                item.is_checked && "text-muted-foreground"
              )}
            >
              {item.name}
            </p>
            
            {item.is_checked && (
              <div
                className={cn(
                  "absolute left-0 top-1/2 h-0.5 bg-muted-foreground -translate-y-1/2",
                  "animate-strikethrough origin-left"
                )}
                style={{
                  animation: isAnimating ? 'strikethrough 0.3s ease-out forwards' : 'none',
                  width: isAnimating ? '0%' : '100%'
                }}
              />
            )}
          </div>
          
          {(item.quantity || item.unit) && (
            <p className="text-xs text-muted-foreground mt-1">
              {item.quantity} {item.unit}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              item.is_pinned && "text-primary opacity-100"
            )}
            onClick={handleTogglePin}
          >
            <Pin className={cn("h-4 w-4", item.is_pinned && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {item.is_pinned && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
        )}
      </div>

      <EditShoppingItemDialog
        item={item}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
};

export default PlayfulShoppingItem;