'use client'

import { useActionState } from 'react'
import { Lock, Mail, Car, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { login } from '@/lib/actions'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, { success: false, message: '' })

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#e5e5e5] selection:bg-black selection:text-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
                <div className="flex justify-center mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center shadow-xl shadow-black/10">
                        <Car className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="text-center text-4xl font-black tracking-tight text-[#1a1a1a]">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Marsana Fleet Management Portal
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in [animation-delay:100ms]">
                <div className="bg-white py-10 px-6 shadow-2xl shadow-black/5 sm:rounded-3xl sm:px-12 border border-white/20">
                    <form className="space-y-6" action={formAction}>
                        {state?.message && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 font-medium">{state.message}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] focus:ring-0 transition-all duration-200 bg-gray-50/50"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1a1a1a] transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a1a1a] focus:ring-0 transition-all duration-200 bg-gray-50/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#1a1a1a] focus:ring-[#1a1a1a] border-gray-300 rounded cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-semibold text-[#1a1a1a] hover:underline transition-all">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent border-b-4 border-b-black/20 rounded-2xl text-white bg-[#1a1a1a] hover:bg-[#2d2d2d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a1a1a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        <span className="font-bold tracking-wide uppercase text-sm">Sign In to Dashboard</span>
                                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                            Secure Enterprise Access
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-[0.2em]">
                © {new Date().getFullYear()} Marsana Rental A Car. All rights reserved.
            </p>
        </div>
    )
}
