import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGroupStore } from '@/lib/store/groupStore';
import { Button } from '@/components/ui/button';
import { Home, Users, Plus } from 'lucide-react';
import CreateGroupDialog from '@/components/groups/CreateGroupDialog';

const Sidebar = () => {
  const location = useLocation();
  const { groups, fetchGroups } = useGroupStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            <Link to="/">
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                className="w-full justify-start h-11"
              >
                <Home className="mr-3 h-5 w-5" />
                Главная
              </Button>
            </Link>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                Группы
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              {groups.map((group) => (
                <Link key={group.id} to={`/group/${group.id}`}>
                  <Button
                    variant={
                      location.pathname === `/group/${group.id}`
                        ? 'default'
                        : 'ghost'
                    }
                    className="w-full justify-start h-11"
                  >
                    <Users className="mr-3 h-5 w-5" />
                    <span className="truncate">{group.name}</span>
                  </Button>
                </Link>
              ))}

              {groups.length === 0 && (
                <div className="px-3 py-6 text-center">
                  <p className="text-sm text-gray-500 mb-3">
                    Нет групп
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setIsCreateOpen(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Создать
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <CreateGroupDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
};

export default Sidebar;