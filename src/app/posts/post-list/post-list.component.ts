import {Component, Input, OnInit} from '@angular/core';
import {Post} from "../post.model";
import {PostService} from "../post.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postSub: Subscription = new Subscription();
  constructor(public postsService: PostService) { }

  ngOnInit() {
    this.postsService.getPost()
      .subscribe( data => {
      this.posts = data.posts
    })
    this.postSub = this.postsService.getpostupdtaeleistenr().subscribe((posts: Post[]) => {
      this.posts = posts;
    })
  }

  onDelete(post: Post): void {
    this.postsService.deletePost(post);
  }
}
