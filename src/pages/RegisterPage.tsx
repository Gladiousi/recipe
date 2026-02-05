import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');

    try {
      await registerUser(data);
      navigate('/');
    } catch (err: any) {
      const errorMsg = err.response?.data;
      if (typeof errorMsg === 'object') {
        const firstError = Object.values(errorMsg)[0];
        setError(Array.isArray(firstError) ? firstError[0] : 'Ошибка регистрации');
      } else {
        setError('Ошибка регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md" data-aos="fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <ShoppingCart className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">ShopList</h1>
          <p className="text-muted-foreground mt-2">Создайте аккаунт</p>
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
            <CardDescription>
              Заполните данные для создания аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Имя</label>
                  <Input
                    {...register('first_name')}
                    placeholder="Иван"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Фамилия</label>
                  <Input
                    {...register('last_name')}
                    placeholder="Петров"
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Имя пользователя</label>
                <Input
                  {...register('username', { required: 'Обязательное поле' })}
                  placeholder="ivan_petrov"
                  className="h-12 text-base"
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  {...register('email', {
                    required: 'Обязательное поле',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Неверный email',
                    },
                  })}
                  type="email"
                  placeholder="ivan@example.com"
                  className="h-12 text-base"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Пароль</label>
                <Input
                  {...register('password', {
                    required: 'Обязательное поле',
                    minLength: { value: 6, message: 'Минимум 6 символов' },
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-base"
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Подтвердите пароль</label>
                <Input
                  {...register('password2', {
                    required: 'Обязательное поле',
                    validate: (value) =>
                      value === password || 'Пароли не совпадают',
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 text-base"
                  autoComplete="new-password"
                />
                {errors.password2 && (
                  <p className="text-sm text-destructive">{errors.password2.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Уже есть аккаунт? </span>
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Войти
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
