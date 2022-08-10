import {Injectable} from "@angular/core";
import {Post} from "./post.model";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


@Injectable({providedIn: 'root'})
export class PostService {
  domain = "http://localhost:3000"
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPost() {
    return this.httpClient.get<{meesage: string, posts: Post[]}>
    ('http://localhost:3000/api/posts').subscribe(transformedPosts => {
      this.posts = transformedPosts.posts;
      this.postUpdated.next([...this.posts]);
    });
  }

  getpostupdtaeleistenr() {
    return this.postUpdated.asObservable();
  }

  addPost(post: Post) {
    return this.httpClient.post('http://localhost:3000/api/posts', post).subscribe(data => {
      console.log(data);
      let res = data as { message: string, postId:string}
      post._id = res.postId as string;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {_id: id , title: title, content: content};
    return this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const oldpostindex = updatedPosts.findIndex( p => p._id === post._id)
        updatedPosts[oldpostindex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/'])
      })
  }

  getPostItem(id: string): Observable<Post> {
    return this.httpClient.get<Post>('http://localhost:3000/api/posts/' + id)
  }

  deletePost(id: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + id)
  }
}
