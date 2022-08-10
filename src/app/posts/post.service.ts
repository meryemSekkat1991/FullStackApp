import {Injectable} from "@angular/core";
import {Post} from "./post.model";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {response} from "express";


@Injectable({providedIn: 'root'})
export class PostService {
  domain = "http://localhost:3000"
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPost() {
    return this.httpClient.get<{meesage: string, posts: Post[]}>
    ('http://localhost:3000/api/posts')
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        this.postUpdated.next([...this.posts]);
    });
  }

  getpostupdtaeleistenr() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postdata = new FormData();
    postdata.append("title", title);
    postdata.append("content", content);
    // @ts-ignore
    postdata.append('image', image, title )
    return this.httpClient.post<{message: string, post: Post}>
    ('http://localhost:3000/api/posts',
      postdata
    )
      .subscribe(responseData => {
        const post: Post = {
          // @ts-ignore
          _id: responseData.post._id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        }
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
    })
  }

  updatePost(id: string, title: string, content: string, image: File | string ) {
    let postData: Post | FormData;
    if(typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id)
      postData.append("title", title);
      postData.append('content', content);
      postData.append("image", image, title)
    } else {
     postData = { _id: id, title: title, content: content, imagePath: image}
    }
    const post: Post = {_id: id , title: title, content: content, imagePath: ""};
    return this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(res => {
        const updatedPosts = [...this.posts];
        const oldpostindex = updatedPosts.findIndex( p => p._id === post._id);
        // @ts-ignore
        const post: Post = {
          _id: id,
          content: content,
          title: title
        }
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
