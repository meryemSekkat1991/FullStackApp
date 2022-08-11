import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {PostService} from "../post.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub: Subscription = new Subscription();
  constructor(public postsService: PostService, private authService: AuthService) { }
  loading = false;
  private authStatusSubs: Subscription = new Subscription();

  totalPosts = 10;
  pagesize = 2;
  pagesizeoptions =[2, 4];
  currentPage = 1;
  perPage = 3;
  isAuth = false;

  ngOnInit() {
    this.loading = true;
    this.postsService.getPost(this.posts.length as number, 1)
    this.postSub = this.postsService.getpostupdtaeleistenr().subscribe((postData: { posts: Post[]; postCount: number }) => {
      this.posts = postData.posts;
      this.loading = false;
    })
    this.isAuth = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe( isAuth => {
      this.isAuth = isAuth;
    });
  }

  onDelete(post: Post): void {
    this.postsService.deletePost(post._id as string).subscribe( () => {
      this.postsService.getPost(this.posts.length as number, this.currentPage)
    });
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.postsService.getPost(this.perPage , this.currentPage)
  }
  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
