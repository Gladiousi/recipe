import { useState, useEffect } from 'react';
import { ShoppingList, ShoppingItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pin, Trash2, Plus, Edit } from 'lucide-react';
import { shoppingAPI } from '@/lib/api/shopping';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ShoppingItemDialog from './ShoppingItemDialog';
import EditShoppingListDialog from './EditShoppingListDialog';
import PlayfulShoppingItem from './PlayfulShoppingItem';

interface ShoppingListCardProps {
  list: ShoppingList;
  onUpdate: (updatedList: ShoppingList) => void;
  onDelete: (listId: number) => void;
  index: number;
}

const ShoppingListCard = ({ list: initialList, onUpdate, onDelete, index }: ShoppingListCardProps) => {
  const [list, setList] = useState(initialList);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState(false);

  useEffect(() => {
    setList(initialList);
  }, [initialList]);

  const handleTogglePin = async () => {
    try {
      const updated = await shoppingAPI.togglePin(list.id);
      setList(updated);
      onUpdate(updated);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Удалить этот список?')) {
      try {
        await shoppingAPI.deleteList(list.id);
        onDelete(list.id);
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  const handleItemCreated = (newItem: ShoppingItem) => {
    setList(prev => {
      const newItems = [newItem, ...prev.items];
      return {
        ...prev,
        items: newItems,
        items_count: newItems.length,
        checked_count: newItems.filter(item => item.is_checked).length,
      };
    });
  };

  const handleItemUpdated = (updatedItem: ShoppingItem) => {
    setList(prev => {
      const newItems = prev.items.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
      return {
        ...prev,
        items: newItems,
        checked_count: newItems.filter(item => item.is_checked).length,
      };
    });
  };

  const handleItemDeleted = (itemId: number) => {
    setList(prev => {
      const newItems = prev.items.filter(item => item.id !== itemId);
      return {
        ...prev,
        items: newItems,
        items_count: newItems.length,
        checked_count: newItems.filter(item => item.is_checked).length,
      };
    });
  };

  const handleListUpdated = (updatedList: ShoppingList) => {
    setList(prev => ({ ...prev, ...updatedList }));
    onUpdate(updatedList);
  };

  const pinnedItems = (list.items || []).filter((item) => item?.is_pinned === true);
  const regularItems = (list.items || []).filter((item) => item?.is_pinned !== true);
  const allItems = [...pinnedItems, ...regularItems];

  const visibleItems = expandedItems ? allItems : allItems.slice(0, 5);
  const hasMoreItems = allItems.length > 5;

  return (
    <>
      <Card
        className="border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
        data-aos="fade-up"
        data-aos-delay={index * 50}
      >
        <CardContent className="p-4 md:p-5 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {list.is_pinned && <Pin className="w-4 h-4 text-primary fill-current" />}
                  {list.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {list.checked_count || 0} / {list.items_count || 0} выполнено
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleTogglePin}>
                    <Pin className="w-4 h-4 mr-2" />
                    {list.is_pinned ? 'Открепить' : 'Закрепить'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setItemDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить товар
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить список
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="bg-linear-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(list.items_count || 0) > 0 ? ((list.checked_count || 0) / (list.items_count || 1)) * 100 : 0}%`,
                }}
              />
            </div>

            {allItems.length > 0 ? (
              <div className="space-y-1">
                {visibleItems.map((item) => (
                  <PlayfulShoppingItem
                    key={item.id}
                    item={item}
                    onUpdate={handleItemUpdated}
                    onDelete={handleItemDeleted}
                  />
                ))}

                {hasMoreItems && !expandedItems && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedItems(true)}
                    className="w-full mt-2"
                  >
                    Показать еще ({allItems.length - 5})
                  </Button>
                )}

                {expandedItems && hasMoreItems && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedItems(false)}
                    className="w-full mt-2"
                  >
                    Свернуть
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">Список пуст</p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 h-11 border-dashed hover:bg-primary/5 hover:border-primary transition-all"
            onClick={() => setItemDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </Button>
        </CardContent>
      </Card>

      <ShoppingItemDialog
        listId={list.id}
        open={itemDialogOpen}
        onOpenChange={setItemDialogOpen}
        onSuccess={handleItemCreated}
      />

      <EditShoppingListDialog
        list={list}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={handleListUpdated}
      />
    </>
  );
};

export default ShoppingListCard;