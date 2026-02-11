import { SignUpForm } from '@/components/auth/SignUpForm';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 glass-card flex items-center justify-center shadow-xl animate-float">
              <svg
                className="w-12 h-12 text-white"
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
          </div>
          <h2 className="text-center text-4xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-3 text-center text-base text-white/70">
            Start managing your tasks today
          </p>
        </div>

        <div className="mt-8 glass-card py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10">
          <SignUpForm />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 glass-card text-white/80 py-1">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/signin"
                className="font-semibold text-white hover:text-white/80 transition-all duration-300 hover:scale-105 inline-block"
              >
                Sign in instead →
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
