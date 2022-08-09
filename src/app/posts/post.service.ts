import {Injectable} from "@angular/core";
import {Post} from "./post.model";
import {Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class PostService {
  domain = "http://localhost:3000"
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {}

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
      this.postUpdated.next([...this.posts])
    })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {_id: id , title: title, content: content};
    return this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(res => {
        console.log(res)
      })
  }

  getPostItem(id: string) {
    return {...this.posts.find(p => p._id === id)}
  }

  deletePost(id: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + id)
  }
}


