'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasNavigated = useRef(false);

  // Prevent navigation loops
  useEffect(() => {
    hasNavigated.current = false;
  }, []);

  const handleGetStarted = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  };

  const handleSignIn = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    router.push('/signin');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 glass-card flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Todo App</span>
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <Button onClick={() => router.push('/dashboard')} size="sm" variant="glass">
                      Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSignIn} variant="secondary" size="sm" className="hidden sm:inline-flex">
                        Sign In
                      </Button>
                      <Button onClick={handleGetStarted} size="sm" variant="glass">
                        Get Started
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Organize Your Life with{' '}
            <span className="text-white drop-shadow-lg">
              Smart Todo Management
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            A beautiful, intuitive task management application that helps you stay productive and organized.
            Create, manage, and complete your tasks with ease.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Button onClick={() => router.push('/dashboard')} size="lg" variant="glass" className="w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleGetStarted} size="lg" variant="glass" className="w-full sm:w-auto">
                      Get Started Free
                    </Button>
                    <Button onClick={handleSignIn} variant="secondary" size="lg" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Feature Preview */}
          <div className="relative max-w-3xl mx-auto animate-slide-up">
            <div className="glass-card p-6 sm:p-8 shadow-2xl">
              <div className="space-y-4">
                {[
                  { title: 'Complete project proposal', completed: true },
                  { title: 'Review team feedback', completed: true },
                  { title: 'Prepare presentation slides', completed: false },
                  { title: 'Schedule client meeting', completed: false },
                ].map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 glass-hover rounded-xl transition-all duration-300"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        task.completed
                          ? 'bg-success border-success'
                          : 'border-white/40'
                      }`}
                    >
                      {task.completed && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-left font-medium ${
                        task.completed ? 'line-through text-white/60' : 'text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Stay Productive
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Powerful features designed to help you manage tasks efficiently and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                ),
                title: 'Quick Task Creation',
                description: 'Add new tasks instantly with our intuitive interface. Stay focused on what matters.',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                ),
                title: 'Track Progress',
                description: 'Mark tasks as complete and visualize your productivity with clear status indicators.',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                ),
                title: 'Easy Editing',
                description: 'Update task details anytime. Keep your todo list current and relevant.',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                ),
                title: 'Secure & Private',
                description: 'Your data is protected with JWT authentication. Only you can access your tasks.',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ),
                title: 'Beautiful Design',
                description: 'Modern glassmorphism UI with smooth animations for a delightful user experience.',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                ),
                title: 'Mobile Responsive',
                description: 'Access your tasks from any device. Fully optimized for mobile, tablet, and desktop.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card glass-hover p-6 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 glass-card flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Get Organized?
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their tasks more effectively.
          </p>
          {!isLoading && !isAuthenticated && (
            <Button onClick={handleGetStarted} size="lg" variant="glass">
              Start Managing Tasks Now
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
