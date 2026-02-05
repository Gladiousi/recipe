import { useState } from 'react';
import { Recipe } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreVertical, Pin, Trash2, Clock, Users, Edit } from 'lucide-react';
import { recipesAPI } from '@/lib/api/recipes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EditRecipeDialog from './EditRecipeDialog';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
  onUpdate: (updatedRecipe: Recipe) => void;
  onDelete: (recipeId: number) => void;
  index: number;
}

const RecipeCard = ({ recipe, onUpdate, onDelete, index }: RecipeCardProps) => {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  const handleTogglePin = async () => {
    try {
      const updated = await recipesAPI.togglePin(recipe.id);
      onUpdate(updated);
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Удалить этот рецепт?')) {
      try {
        await recipesAPI.delete(recipe.id);
        onDelete(recipe.id);
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  return (
    <>
      <Card
        className="border-border shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
        data-aos="fade-up"
        data-aos-delay={index * 50}
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
        {/* Image */}
        {recipe.image ? (
          <div className="relative h-48 overflow-hidden bg-muted">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {recipe.is_pinned && (
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1">
                <Pin className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">Закреплено</span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative h-48 bg-linear-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center">
            <span className="text-6xl">👨‍🍳</span>
            {recipe.is_pinned && (
              <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1">
                <Pin className="w-3 h-3 fill-current" />
                <span className="text-xs font-medium">Закреплено</span>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1">
              {recipe.title}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTogglePin(); }}>
                  <Pin className="w-4 h-4 mr-2" />
                  {recipe.is_pinned ? 'Открепить' : 'Закрепить'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {recipe.description.replace(/[#*_`]/g, '').slice(0, 100)}...
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {recipe.cooking_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.cooking_time} мин</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} порций</span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {recipe.ingredients?.length || 0} ингредиентов
            </p>
          </div>
        </CardContent>
      </Card>

      <EditRecipeDialog
        recipe={recipe}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onUpdate}
      />
    </>
  );
};

export default RecipeCard;