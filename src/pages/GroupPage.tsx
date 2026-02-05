// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { groupsAPI } from '@/lib/api/groups';
// import { shoppingAPI } from '@/lib/api/shopping';
// import { recipesAPI } from '@/lib/api/recipes';
// import { Group, ShoppingList, Recipe } from '@/types';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Settings, UserPlus, ArrowLeft } from 'lucide-react';
// import ShoppingListsSection from '@/components/shopping/ShoppingListsSection';
// import RecipesSection from '@/components/recipes/RecipesSection';
// import GroupSettingsDialog from '@/components/groups/GroupSettingsDialog';
// import InviteMemberDialog from '@/components/groups/InviteMemberDialog';

// const GroupPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [group, setGroup] = useState<Group | null>(null);
//   const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [settingsOpen, setSettingsOpen] = useState(false);
//   const [inviteOpen, setInviteOpen] = useState(false);

//   const loadData = async () => {
//     if (!id) return;

//     setIsLoading(true);
//     try {
//       const [groupData, listsData, recipesData] = await Promise.all([
//         groupsAPI.getOne(Number(id)),
//         shoppingAPI.getLists(Number(id)),
//         recipesAPI.getAll(Number(id)),
//       ]);

//       setGroup(groupData);
//       setShoppingLists(listsData);
//       setRecipes(recipesData);
//     } catch (error) {
//       console.error('Error loading group:', error);
//       navigate('/');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [id]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!group) return null;

//   return (
//     <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-6">
//       <div className="flex flex-row items-center justify-between gap-4" data-aos="fade-down">
//         <div className="flex items-center gap-3">
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => navigate('/')}
//             className="md:hidden"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">{group.name}</h1>
//             <p className="text-sm text-muted-foreground mt-1">
//               {group.members_count} участников
//             </p>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => setInviteOpen(true)}
//             className="flex-1 md:flex-none"
//           >
//             <UserPlus className="w-4 h-4 md:mr-2" />
//             <span className='hidden md:flex'>
//             Пригласить
//             </span>
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setSettingsOpen(true)}
//           >
//             <Settings className="w-4 h-4" />
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="shopping" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 h-12 md:h-10 mb-6">
//           <TabsTrigger value="shopping" className="text-base md:text-sm">
//             Покупки
//           </TabsTrigger>
//           <TabsTrigger value="recipes" className="text-base md:text-sm">
//             Рецепты
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="shopping">
//           <ShoppingListsSection
//             groupId={group.id}
//             shoppingLists={shoppingLists}
//             onUpdate={loadData}
//           />
//         </TabsContent>

//         <TabsContent value="recipes">
//           <RecipesSection
//             groupId={group.id}
//             recipes={recipes}
//             onUpdate={loadData}
//           />
//         </TabsContent>
//       </Tabs>

//       <GroupSettingsDialog
//         group={group}
//         open={settingsOpen}
//         onOpenChange={setSettingsOpen}
//         onUpdate={loadData}
//       />

//       <InviteMemberDialog
//         group={group}
//         open={inviteOpen}
//         onOpenChange={setInviteOpen}
//       />
//     </div>
//   );
// };

// export default GroupPage;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupsAPI } from '@/lib/api/groups';
import { shoppingAPI } from '@/lib/api/shopping';
import { recipesAPI } from '@/lib/api/recipes';
import { Group, ShoppingList, Recipe } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings, UserPlus, ArrowLeft } from 'lucide-react';
import ShoppingListsSection from '@/components/shopping/ShoppingListsSection';
import RecipesSection from '@/components/recipes/RecipesSection';
import GroupSettingsDialog from '@/components/groups/GroupSettingsDialog';
import InviteMemberDialog from '@/components/groups/InviteMemberDialog';
import { useTabStore } from '@/lib/store/useTabStore';

const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { getGroupTab, setGroupTab } = useTabStore();
  const currentTab = id ? getGroupTab(id) : 'shopping';

  const loadData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const [groupData, listsData, recipesData] = await Promise.all([
        groupsAPI.getOne(Number(id)),
        shoppingAPI.getLists(Number(id)),
        recipesAPI.getAll(Number(id)),
      ]);

      setGroup(groupData);
      setShoppingLists(listsData);
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error loading group:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pb-20 md:pb-6">
      <div className="flex flex-row items-center justify-between gap-4" data-aos="fade-down">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{group.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {group.members_count} участников
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setInviteOpen(true)}
            className="flex-1 md:flex-none"
          >
            <UserPlus className="w-4 h-4 md:mr-2" />
            <span className="hidden md:flex">Пригласить</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={(value) => {
          if (id) setGroupTab(id, value as 'shopping' | 'recipes');
        }}
        className="w-full"
      >
        <TabsList className="hidden md:grid w-full grid-cols-2 h-12 md:h-10 mb-6 ">
          <TabsTrigger value="shopping" className="text-base md:text-sm">
            Покупки
          </TabsTrigger>
          <TabsTrigger value="recipes" className="text-base md:text-sm">
            Рецепты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shopping">
          <ShoppingListsSection
            groupId={group.id}
            shoppingLists={shoppingLists}
            onUpdate={loadData}
          />
        </TabsContent>

        <TabsContent value="recipes">
          <RecipesSection
            groupId={group.id}
            recipes={recipes}
            onUpdate={loadData}
          />
        </TabsContent>
      </Tabs>

      <GroupSettingsDialog
        group={group}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onUpdate={loadData}
      />

      <InviteMemberDialog
        group={group}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
};

export default GroupPage;
