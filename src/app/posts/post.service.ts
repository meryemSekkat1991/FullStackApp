import {Injectable} from "@angular/core";
import {Post} from "./post.model";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class PostService {
  domain = "http://localhost:3000"
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

  getPosts() {
    this.httpClient
      .get<{ message: string; posts: Post[] }>(
        "http://localhost:3000/api/posts"
      )
      .subscribe(postData => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getpostupdtaeleistenr() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post): Observable<any> {
    return this.httpClient.post('http://localhost:3000/api/posts', post)
  }

  deletePost(post: Post) {
    return this.httpClient.delete('http://localhost:3000/api/posts' + post.id)
      .subscribe(() => {
        console.log('deleted')
      })
  }
}


