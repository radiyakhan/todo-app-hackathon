export function EmptyState() {
  return (
    <div className="text-center py-20 px-4 animate-fade-in">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md mb-8 shadow-lg border border-white/20 animate-float">
        <svg
          className="h-12 w-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>
      <h3 className="text-3xl font-bold text-white mb-4">No tasks yet</h3>
      <p className="text-base text-white/70 max-w-md mx-auto leading-relaxed">
        Start organizing your work by creating your first task above.
        <br />
        <span className="inline-block mt-3 font-semibold text-white">Stay productive and achieve your goals!</span>
      </p>
      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-white/60 glass-card px-6 py-3 inline-flex rounded-full">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>Tip: Use clear, actionable titles for better task management</span>
      </div>
    </div>
  );
}
