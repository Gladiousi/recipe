import { useState, useEffect } from 'react';
import { Group, User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authAPI } from '@/lib/api/auth';
import { groupsAPI } from '@/lib/api/groups';
import { Search, UserPlus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface InviteMemberDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InviteMemberDialog = ({
  group,
  open,
  onOpenChange,
}: InviteMemberDialogProps) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviting, setInviting] = useState<number | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const results = await authAPI.searchUsers(debouncedQuery);
      const memberIds = group.members_detail.map((m) => m.user.id);
      setUsers(results.filter((u) => !memberIds.includes(u.id)));
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (username: string, userId: number) => {
    setInviting(userId);
    try {
      await groupsAPI.sendInvitation(group.id, username);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error: any) {
      alert(error.response?.data?.invitee_username?.[0] || 'Ошибка отправки приглашения');
    } finally {
      setInviting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 bg-card border-border">
        <DialogHeader>
          <DialogTitle>Пригласить участника</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Найдите пользователя по имени или email
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск пользователей..."
              className="pl-10 h-11 bg-background border-input"
              autoFocus
            />
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          )}

          {!isLoading && query.length >= 2 && users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Пользователи не найдены</p>
            </div>
          )}

          {users.length > 0 && (
            <div className="space-y-2 max-h-80 h-full">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary/10">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleInvite(user.username, user.id)}
                    disabled={inviting === user.id}
                  >
                    {inviting === user.id ? (
                      'Отправка...'
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Пригласить
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;