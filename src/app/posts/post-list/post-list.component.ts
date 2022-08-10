import {Component, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {PostService} from "../post.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postSub: Subscription = new Subscription();
  constructor(public postsService: PostService) { }
  loading = false;

  totalPosts = 10;
  pagesize = 2;
  pagesizeoptions =[2, 4];

  ngOnInit() {
    this.loading = true;
    this.postsService.getPost()
    this.postSub = this.postsService.getpostupdtaeleistenr().subscribe((posts: Post[]) => {
      this.posts = posts;
      this.loading = false;
    })
  }

  onDelete(post: Post): void {
    this.postsService.deletePost(post._id as string).subscribe( () => {
      this.postsService.getPost()
    });
  }

  onChangePage(pageData: PageEvent) {
    console.log(pageData)
  }
}
