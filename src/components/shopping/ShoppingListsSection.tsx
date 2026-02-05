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

  // Разделяем на закрепленные и обычные
  const pinnedLists = shoppingLists.filter((list) => list.is_pinned);
  const regularLists = shoppingLists.filter((list) => !list.is_pinned);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold">Списки покупок</h2>
        <Button onClick={() => setCreateOpen(true)} size="sm" className="h-10">
          <Plus className="w-4 h-4 mr-2" />
          Создать список
        </Button>
      </div>

      {shoppingLists.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl" data-aos="fade-up">
          <p className="text-gray-600 mb-4">Нет списков покупок</p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Создать первый список
          </Button>
        </div>
      ) : (
        <>
          {/* Закрепленные списки */}
          {pinnedLists.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                📌 Закрепленные
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {pinnedLists.map((list, index) => (
                  <ShoppingListCard
                    key={list.id}
                    list={list}
                    onUpdate={onUpdate}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Обычные списки */}
          {regularLists.length > 0 && (
            <div className="space-y-3">
              {pinnedLists.length > 0 && (
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Все списки
                </h3>
              )}
              <div className="grid grid-cols-1 gap-3">
                {regularLists.map((list, index) => (
                  <ShoppingListCard
                    key={list.id}
                    list={list}
                    onUpdate={onUpdate}
                    index={index + pinnedLists.length}
                  />
                ))}
              </div>
            </div>
          )}
        </>
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
