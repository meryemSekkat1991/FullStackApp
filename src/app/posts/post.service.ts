import {Injectable} from "@angular/core";
import {Post} from "./post.model";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPost(): Observable<{meesage: string, posts: Post[]}> {
    return this.httpClient.get<{meesage: string, posts: Post[]}>('http://localhost:3000/api/posts')
  }

  getpostupdtaeleistenr() {
    return this.postUpdated.asObservable();
  }

    addPost(post: Post): Observable<any> {
    return this.httpClient.post('http://localhost:3000/api/posts', post)
  }
}
