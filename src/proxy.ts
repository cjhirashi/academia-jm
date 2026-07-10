import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // La página de login nunca se redirige desde aquí
  if (pathname === '/admin/login') {
    return NextResponse.next({ request })
  }

  // Si no hay variables de Supabase, paso libre
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return NextResponse.next({ request })

  try {
    let supabaseResponse = NextResponse.next({ request })
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    if (pathname.startsWith('/admin') && !user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return supabaseResponse
  } catch {
    // Cualquier error = paso libre sin redirect
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
