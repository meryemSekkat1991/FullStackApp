import {Injectable} from "@angular/core";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";


import { environment } from "../../environments/environment";
import {Post} from "./post.model";

const BACKEND_URL = environment.apiUrl + '/posts'

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: any[] = [];
  private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getPost(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.httpClient
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map((post: { title: any; content: any; _id: any; imagePath: any; creator: any}) => {
              return {
                title: post.title,
                content: post.content,
                _id: post._id,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        console.log(transformedPostData)
        this.posts = transformedPostData.posts;
        console.log('service', transformedPostData.maxPosts)
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
    ( BACKEND_URL,
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
      .put(BACKEND_URL + "/" + id, postData)
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
    return this.httpClient.get<Post>(BACKEND_URL + '/' + id)
  }

  deletePost(id: string) {
    return this.httpClient.delete(BACKEND_URL +'/' + id)
  }
}
