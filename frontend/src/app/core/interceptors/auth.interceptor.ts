import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sesionGuardada = localStorage.getItem('medicore_session');
  let token: string | null = null;

  if (sesionGuardada) {
    try {
      const usuario = JSON.parse(sesionGuardada);
      token = usuario.token || null;
    } catch (e) {
      // Silencioso en producción
    }
  }

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};