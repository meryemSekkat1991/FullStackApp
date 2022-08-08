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

  addPost(title: string, content: string) {
    const post: Post = {
      id: "02030404",
      title: title,
      content: content
    }
    this.posts.push(post);
    this.postUpdated.next([...this.posts])
  }
}
