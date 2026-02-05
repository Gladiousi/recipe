import { useEffect, useState } from 'react';
import { groupsAPI } from '@/lib/api/groups';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Users } from 'lucide-react';

interface InvitationFromBackend {
    id: number;
    group: number;
    group_name: string;
    inviter: {
        id: number;
        username: string;
        email: string;
        first_name?: string;
        last_name?: string;
        avatar?: string;
    };
    invitee: {
        id: number;
        username: string;
        email: string;
        first_name?: string;
        last_name?: string;
        avatar?: string;
    };
    status: string;
    created_at: string;
}

const NotificationsPage = () => {
    const [invitations, setInvitations] = useState<InvitationFromBackend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        loadInvitations();
    }, []);

    const loadInvitations = async () => {
        setIsLoading(true);
        try {
            const data = await groupsAPI.getInvitations() as any;
            console.log('Loaded invitations:', data);
            setInvitations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading invitations:', error);
            setInvitations([]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleAccept = async (id: number) => {
        setProcessingId(id);
        try {
            await groupsAPI.acceptInvitation(id);
            setInvitations(prev => prev.filter(inv => inv.id !== id));
        } catch (error) {
            console.error('Error accepting invitation:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDecline = async (id: number) => {
        setProcessingId(id);
        try {
            await groupsAPI.declineInvitation(id);
            setInvitations(prev => prev.filter(inv => inv.id !== id));
        } catch (error) {
            console.error('Error declining invitation:', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6">
            <div data-aos="fade-down">
                <h1 className="text-2xl md:text-3xl font-bold">Уведомления</h1>
                <p className="text-muted-foreground mt-1">
                    {invitations.length > 0
                        ? `У вас ${invitations.length} ${invitations.length === 1 ? 'приглашение' : 'приглашений'}`
                        : 'Нет новых уведомлений'
                    }
                </p>
            </div>

            {invitations.length === 0 ? (
                <Card className="border-2 border-dashed border-border" data-aos="fade-up">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Нет приглашений</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Когда вас пригласят в группу, приглашения появятся здесь
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {invitations.map((invitation, index) => (
                        <Card
                            key={invitation.id}
                            className="border-border shadow-md hover:shadow-lg transition-all duration-300"
                            data-aos="fade-up"
                            data-aos-delay={index * 50}
                        >
                            <CardContent className="p-4 md:p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shrink-0">
                                        <Users className="w-6 h-6 md:w-7 md:h-7 text-primary-foreground" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg mb-1">
                                            Приглашение в группу
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            <span className="font-medium text-foreground">{invitation.inviter.username}</span>
                                            {' '}пригласил вас в группу{' '}
                                            <span className="font-medium text-foreground">{invitation.group_name}</span>
                                        </p>

                                        <div className="flex items-center gap-2 mb-4">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={invitation.inviter.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-xs">
                                                    {invitation.inviter.username.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="text-xs text-muted-foreground">
                                                {invitation.inviter.email}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleAccept(invitation.id)}
                                                disabled={processingId === invitation.id}
                                                className="flex-1 md:flex-none"
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                {processingId === invitation.id ? 'Принятие...' : 'Принять'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleDecline(invitation.id)}
                                                disabled={processingId === invitation.id}
                                                className="flex-1 md:flex-none border-destructive/20 text-destructive hover:bg-destructive/10"
                                            >
                                                <X className="w-4 h-4 mr-2" />
                                                {processingId === invitation.id ? 'Отклонение...' : 'Отклонить'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;
