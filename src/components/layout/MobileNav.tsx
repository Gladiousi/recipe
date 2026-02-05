import { Link, useLocation, useParams } from 'react-router-dom';
import { Users, ShoppingCart, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTabStore } from '@/lib/store/useTabStore';

const MobileNav = () => {
  const location = useLocation();
  const params = useParams<{ id: string }>();
  const { getGroupTab, setGroupTab } = useTabStore();

  const isGroupPage = location.pathname.startsWith('/group/') && params.id;
  const currentGroupTab = params.id ? getGroupTab(params.id) : 'shopping';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 h-16">
      <div className="flex items-center justify-around h-full px-2">
        <Link
          to="/"
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
            location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <Users className="w-6 h-6" />
          <span className="text-xs font-medium">Группы</span>
        </Link>

        <button
          onClick={() => {
            if (params.id) {
              setGroupTab(params.id, 'shopping');
            }
          }}
          disabled={!isGroupPage}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
            !isGroupPage && 'opacity-30 cursor-not-allowed',
            isGroupPage && currentGroupTab === 'shopping' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs font-medium">Покупки</span>
        </button>

        <button
          onClick={() => {
            if (params.id) {
              setGroupTab(params.id, 'recipes');
            }
          }}
          disabled={!isGroupPage}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
            !isGroupPage && 'opacity-30 cursor-not-allowed',
            isGroupPage && currentGroupTab === 'recipes' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <ChefHat className="w-6 h-6" />
          <span className="text-xs font-medium">Рецепты</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;