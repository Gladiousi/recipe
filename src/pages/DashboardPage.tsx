import { useEffect } from 'react';
import { useGroupStore } from '@/lib/store/groupStore';
import { useAuthStore } from '@/lib/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { groups, fetchGroups } = useGroupStore();

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 md:pb-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-aos="fade-up">
        <Card className="border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Групп</p>
                <p className="text-3xl font-bold text-primary">{groups.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Списков покупок</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Рецептов</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">0</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Ваши группы</h2>
        </div>

        {groups.length === 0 ? (
          <Card className="border-2 border-dashed border-border">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет групп</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Создайте первую группу для совместных покупок с семьей или друзьями
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group, index) => (
              <Link key={group.id} to={`/group/${group.id}`}>
                <Card
                  className="border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-3">
                        <Users className="w-6 h-6 text-primary-foreground" />
                      </div>
                      {group.owner.id === user?.id && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          Владелец
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {group.description || 'Без описания'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {group.members_count} {group.members_count === 1 ? 'участник' : 'участников'}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
