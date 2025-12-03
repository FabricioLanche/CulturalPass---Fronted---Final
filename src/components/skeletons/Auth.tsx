"use client"

/**
 * Skeletons para las páginas de Login y Register.
 * Usar estos componentes mientras carga el formulario real.
 */
export function LoginSkeleton() {
	return (
		<div className="w-full flex flex-col items-center justify-center min-h-screen" aria-busy="true">
			<div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-background-secondary">
				<div className="h-8 w-1/3 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />

				<div className="space-y-3 mt-4">
					<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
					<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
				</div>

				<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse mt-6" />

				<div className="flex items-center justify-between mt-4">
					<div className="h-4 w-1/4 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
					<div className="h-4 w-1/3 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
				</div>
			</div>
		</div>
	)
}

export function RegisterSkeleton() {
	return (
		<div className="w-full flex flex-col items-center justify-center min-h-screen" aria-busy="true">
			<div className="w-full max-w-4xl p-8 space-y-6 rounded-xl bg-background-secondary">
				<div className="h-8 w-1/3 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
					<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
					<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
					<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
				</div>

				<div className="h-10 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse mt-2" />

				<div className="flex items-center justify-end gap-3">
					<div className="h-10 w-24 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
					<div className="h-10 w-32 rounded bg-gray-300/60 dark:bg-gray-700 animate-pulse" />
				</div>
			</div>
		</div>
	)
}

export default LoginSkeleton