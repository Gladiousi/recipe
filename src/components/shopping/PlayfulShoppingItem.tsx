'use client';

import { useState } from 'react';
import { ShoppingItem } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pin, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shoppingAPI } from '@/lib/api/shopping';
import EditShoppingItemDialog from './EditShoppingItemDialog';
import { motion } from 'framer-motion';

interface PlayfulShoppingItemProps {
  item: ShoppingItem;
  onUpdate: (updatedItem: ShoppingItem) => void;
  onDelete: (itemId: number) => void;
}

const PlayfulShoppingItem = ({ item, onUpdate, onDelete }: PlayfulShoppingItemProps) => {
  const [editOpen, setEditOpen] = useState(false);

  const handleToggleCheck = async () => {
    try {
      const updated = await shoppingAPI.toggleCheck(item.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Error toggling item:', error);
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
      <motion.div
        layout
        layoutId={`shopping-item-${item.id}`}
        whileHover={{ scale: 1.01, translateX: 2 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          scale: item.is_pinned ? 0.98 : 1,
          opacity: item.is_pinned ? 0.92 : 1,
          zIndex: item.is_pinned ? 0 : 1,
        }}
        exit={{
          y: 30,
          opacity: 0,
          scale: 0.9,
          filter: 'blur(2px)',
        }}
        transition={{
          layout: { type: 'spring', stiffness: 260, damping: 26 },
          default: { duration: 0.22, ease: 'easeOut' },
        }}
        className={cn(
          'group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer',
          'transition-colors duration-200',
          'hover:bg-accent/60',
          item.is_checked && 'opacity-75',
          item.is_pinned && 'bg-primary/5 border-l-4 border-primary/80 shadow-sm'
        )}
        onClick={handleToggleCheck}
      >
        <div className="relative shrink-0 mt-0.5">
          <motion.div
            initial={false}
            animate={{ scale: item.is_checked ? 1.03 : 1 }}
            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
          >
            <Checkbox
              checked={item.is_checked}
              className={cn(
                'h-5 w-5 transition-all duration-300 rounded-full',
                item.is_checked
                  ? 'border-primary bg-primary shadow-sm'
                  : 'border-muted-foreground/40'
              )}
            />
          </motion.div>

          {item.is_checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-primary/90 animate-ping" />
            </div>
          )}
        </div>

        <div className="flex-1 relative min-w-0">
          <div className="relative inline-block">
            <p
              className={cn(
                'text-base font-medium transition-all duration-300',
                item.is_checked && 'text-muted-foreground'
              )}
            >
              {item.name}
            </p>

            <motion.svg
              className="pointer-events-none absolute left-0 right-0 top-1/2 h-4 -translate-y-1/2"
              viewBox="0 0 100 10"
            >
              <motion.path
                d="M2 5 C 20 0, 40 10, 60 5 S 90 0, 98 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground"
                initial={false}
                animate={{ pathLength: item.is_checked ? 1 : 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </motion.svg>
          </div>

          {(item.quantity || item.unit) && (
            <motion.p
              initial={false}
              animate={{
                opacity: item.is_checked ? 0.7 : 1,
                y: item.is_checked ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground mt-1"
            >
              {item.quantity} {item.unit}
            </motion.p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-transform duration-200 hover:scale-105"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 transition-transform duration-200 hover:scale-105',
              item.is_pinned && 'text-primary'
            )}
            onClick={handleTogglePin}
          >
            <motion.span
              animate={{ rotate: item.is_pinned ? -18 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <Pin className={cn('h-4 w-4', item.is_pinned && 'fill-current')} />
            </motion.span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive transition-transform duration-200 hover:scale-110"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {item.is_pinned && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
        )}
      </motion.div>

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