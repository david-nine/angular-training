import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const EXTERNAL_URL = "external";

export class URLInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let clonedReq;
        if (req.headers.get(EXTERNAL_URL)) {
            clonedReq = req.clone({
                headers: req.headers.delete(EXTERNAL_URL)
            })
        } else {
            clonedReq = req.clone({
                url: environment.apiUrl + req.url + '.json'
            });
        }
        return next.handle(clonedReq);
    }
}
