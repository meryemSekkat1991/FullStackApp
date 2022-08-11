import {Injectable} from "@angular/core";
import {Post} from "./post.model";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {response} from "express";


@Injectable({providedIn: 'root'})
export class PostService {
  domain = "http://localhost:3000"
  private posts: any[] = [];
  private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPost(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map((post: { title: any; content: any; _id: any; imagePath: any; }) => {
              return {
                title: post.title,
                content: post.content,
                _id: post._id,
                imagePath: post.imagePath
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
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
        this.router.navigate(['/']);
    })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        _id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.httpClient
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p._id === id);
        const post: Post = {
          _id: id,
          title: title,
          content: content,
          imagePath: ""
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.router.navigate(["/"]);
      });
  }

  getPostItem(id: string): Observable<Post> {
    return this.httpClient.get<Post>('http://localhost:3000/api/posts/' + id)
  }

  deletePost(id: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + id)
  }
}
