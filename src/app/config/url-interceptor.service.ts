import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

const FIREBASE_URL = 'add firebase url';

export class URLInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const clonedReq = req.clone({
            url: FIREBASE_URL + req.url + '.json'
        });
        return next.handle(clonedReq);
    }
}