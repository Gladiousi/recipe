import { Group } from '@/types';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, LogOut, Crown } from 'lucide-react';
import { groupsAPI } from '@/lib/api/groups';
import { useNavigate } from 'react-router-dom';

interface GroupSettingsDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const GroupSettingsDialog = ({
  group,
  open,
  onOpenChange,
  onUpdate,
}: GroupSettingsDialogProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = group.owner.id === user?.id;

  const handleLeave = async () => {
    if (confirm('Покинуть группу?')) {
      try {
        await groupsAPI.leave(group.id);
        navigate('/');
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Удалить группу? Это действие необратимо!')) {
      try {
        await groupsAPI.delete(group.id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (confirm('Удалить участника из группы?')) {
      try {
        await groupsAPI.removeMember(group.id, userId);
        onUpdate();
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle>Настройки группы</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Group Info */}
          <div>
            <h3 className="font-semibold mb-2">{group.name}</h3>
            <p className="text-sm text-muted-foreground">{group.description || 'Без описания'}</p>
          </div>

          <Separator className="bg-border" />

          {/* Members */}
          <div>
            <h3 className="font-semibold mb-3">
              Участники ({group.members_count})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {group.members_detail.map((membership) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={membership.user.avatar} />
                      <AvatarFallback className="bg-primary/10">
                        {membership.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {membership.user.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {membership.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {group.owner.id === membership.user.id ? (
                      <Badge variant="default" className="gap-1">
                        <Crown className="w-3 h-3" />
                        Владелец
                      </Badge>
                    ) : (
                      isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(membership.user.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Actions */}
          <div className="space-y-2">
            {!isOwner && (
              <Button
                variant="outline"
                className="w-full justify-start text-orange-600 hover:text-orange-700 border-orange-200 dark:border-orange-900"
                onClick={handleLeave}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Покинуть группу
              </Button>
            )}

            {isOwner && (
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:bg-destructive/10 border-destructive/20"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Удалить группу
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupSettingsDialog;
