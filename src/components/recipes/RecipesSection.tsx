import { useState } from 'react';
import { Recipe } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RecipeCard from './RecipeCard';
import CreateRecipeDialog from './CreateRecipeDialog';

interface RecipesSectionProps {
  groupId: number;
  recipes: Recipe[];
  onUpdate: () => void;
}

const RecipesSection = ({ groupId, recipes: initialRecipes, onUpdate }: RecipesSectionProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [createOpen, setCreateOpen] = useState(false);

  useState(() => {
    setRecipes(initialRecipes);
  });

  const handleRecipeCreated = (newRecipe: Recipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
    onUpdate();
  };

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setRecipes(prev => 
      prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r)
    );
  };

  const handleRecipeDeleted = (recipeId: number) => {
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Рецепты</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {recipes.length} {recipes.length === 1 ? 'рецепт' : 'рецептов'}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить рецепт
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
          <span className="text-6xl mb-4 block">👨‍🍳</span>
          <h3 className="text-lg font-semibold mb-2">Нет рецептов</h3>
          <p className="text-muted-foreground mb-4">
            Добавьте первый рецепт для группы
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить рецепт
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUpdate={handleRecipeUpdated}
              onDelete={handleRecipeDeleted}
              index={index}
            />
          ))}
        </div>
      )}

      <CreateRecipeDialog
        groupId={groupId}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleRecipeCreated}
      />
    </>
  );
};

export default RecipesSection;
