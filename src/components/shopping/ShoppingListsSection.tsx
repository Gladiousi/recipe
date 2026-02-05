import { useState } from 'react';
import { ShoppingList } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ShoppingListCard from './ShoppingListCard';
import CreateShoppingListDialog from './CreateShoppingListDialog';

interface ShoppingListsSectionProps {
  groupId: number;
  shoppingLists: ShoppingList[];
  onUpdate: () => void;
}

const ShoppingListsSection = ({ groupId, shoppingLists, onUpdate }: ShoppingListsSectionProps) => {
  const [createOpen, setCreateOpen] = useState(false);

  const pinnedLists = shoppingLists.filter((list) => list.is_pinned);
  const regularLists = shoppingLists.filter((list) => !list.is_pinned);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold">Списки покупок</h2>
        <Button onClick={() => setCreateOpen(true)} size="sm" className="h-10">
          <Plus className="w-4 h-4 md:mr-2" />
          <span className='hidden md:flex'>
          Создать список
          </span>
        </Button>
      </div>

      {shoppingLists.length === 0 ? (
        <div className="text-center py-5 bg-gray-50 rounded-xl" data-aos="fade-up">
          <p className="text-gray-600 mb-4">Нет списков покупок</p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Создать первый список
          </Button>
        </div>
      ) : (
        <div className='flex flex-col space-y-4'>
          {pinnedLists.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Закрепленные
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {pinnedLists.map((list, index) => (
                  <ShoppingListCard
                    key={list.id}
                    list={list}
                    onUpdate={onUpdate}
                    index={index} onDelete={function (listId: number): void {
                      throw new Error('Function not implemented.');
                    } }                  />
                ))}
              </div>
            </div>
          )}

          {regularLists.length > 0 && (
            <div className="space-y-3">
              {pinnedLists.length > 0 && (
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Все списки
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {regularLists.map((list, index) => (
                  <ShoppingListCard
                    key={list.id}
                    list={list}
                    onUpdate={onUpdate}
                    index={index + pinnedLists.length} onDelete={function (listId: number): void {
                      throw new Error('Function not implemented.');
                    } }                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <CreateShoppingListDialog
        groupId={groupId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={onUpdate}
      />
    </div>
  );
};

export default ShoppingListsSection;