import { useRouter } from '../router/useRouter.js'

export function NotFoundPage() {
  const { navigate } = useRouter()

  return (
    <main className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-xl place-items-center px-4 py-10">
      <section className="w-full rounded-3xl border border-slate-200 bg-white/90 p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-600 dark:text-teal-300">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Page not found</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">The route you opened does not exist.</p>
        <button
          className="mt-5 inline-flex rounded-full bg-teal-500 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-400"
          type="button"
          onClick={() => navigate('/dashboard')}
        >
          Go to dashboard
        </button>
      </section>
    </main>
  )
}
