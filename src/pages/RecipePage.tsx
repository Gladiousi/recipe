import { JSX, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipesAPI } from '@/lib/api/recipes';
import { Recipe } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Clock, Users, Trash2 } from 'lucide-react';

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await recipesAPI.getOne(Number(id));
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe || !confirm('Удалить этот рецепт?')) return;

    try {
      await recipesAPI.delete(recipe.id);
      navigate(-1);
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  // Простой парсер markdown
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const result: JSX.Element[] = [];
    let listItems: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (listItems.length > 0) {
        const ListTag = listType === 'ol' ? 'ol' : 'ul';
        result.push(
          <ListTag key={result.length} className={listType === 'ol' ? 'list-decimal list-inside mb-4 space-y-2' : 'list-disc list-inside mb-4 space-y-2'}>
            {listItems.map((item, i) => (
              <li key={i} className="ml-4 text-foreground">{item}</li>
            ))}
          </ListTag>
        );
        listItems = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      // Заголовок H1
      if (line.startsWith('# ')) {
        flushList();
        result.push(<h1 key={index} className="text-3xl font-bold mb-4 mt-6 text-foreground">{line.slice(2)}</h1>);
      }
      // Заголовок H2
      else if (line.startsWith('## ')) {
        flushList();
        result.push(<h2 key={index} className="text-2xl font-bold mb-3 mt-5 text-foreground">{line.slice(3)}</h2>);
      }
      // Заголовок H3
      else if (line.startsWith('### ')) {
        flushList();
        result.push(<h3 key={index} className="text-xl font-semibold mb-2 mt-4 text-foreground">{line.slice(4)}</h3>);
      }
      // Список с маркерами
      else if (line.match(/^[-*]\s/)) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        listItems.push(line.slice(2));
      }
      // Нумерованный список
      else if (line.match(/^\d+\.\s/)) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        listItems.push(line.replace(/^\d+\.\s/, ''));
      }
      // Пустая строка
      else if (line.trim() === '') {
        flushList();
        result.push(<div key={index} className="h-2" />);
      }
      // Обычный текст
      else {
        flushList();
        // Обработка жирного текста **text**
        const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        result.push(
          <p 
            key={index} 
            className="mb-3 text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldText }}
          />
        );
      }
    });

    flushList();
    return result;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center gap-3" data-aos="fade-down">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold flex-1">{recipe.title}</h1>
        
        <Button variant="outline" size="icon" onClick={handleDelete} className="border-destructive/20">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>

      {/* Image */}
      {recipe.image && (
        <div className="rounded-2xl overflow-hidden shadow-lg" data-aos="fade-up">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* Meta Info */}
      <div className="flex gap-4 flex-wrap" data-aos="fade-up">
        {recipe.cooking_time && (
          <Card className="flex-1 min-w-[150px] border-border shadow-md">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Время</p>
                <p className="font-semibold">{recipe.cooking_time} мин</p>
              </div>
            </CardContent>
          </Card>
        )}

        {recipe.servings && (
          <Card className="flex-1 min-w-[150px] border-border shadow-md">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Порций</p>
                <p className="font-semibold">{recipe.servings}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Description */}
      <Card className="border-border shadow-lg" data-aos="fade-up">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-1">
            {renderMarkdown(recipe.description)}
          </div>
        </CardContent>
      </Card>

      {/* Author */}
      <div className="text-center text-sm text-muted-foreground" data-aos="fade-up">
        Добавил {recipe.created_by.username} •{' '}
        {new Date(recipe.created_at).toLocaleDateString('ru-RU')}
      </div>
    </div>
  );
};

export default RecipePage;
