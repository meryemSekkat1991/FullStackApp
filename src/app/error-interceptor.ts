import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from "@angular/common/http";
import {catchError} from "rxjs";
import {Observable, throwError} from "rxjs"
import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "./error/error.component";

@Injectable()
export class errorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        // @ts-ignore
        catchError((error: HttpErrorResponse) => {
          let message = "an unknown error occurred!!"
          if(error.error.message) {
              message = error.error.message;
          }
          this.dialog.open(ErrorComponent, {data: {message: message
            }} );
          throwError(error);
        })
      );
  }
}
