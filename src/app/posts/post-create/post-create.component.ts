import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {PostService} from "../post.service";
import {ActivatedRoute} from "@angular/router";
import {Post} from "../post.model";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  enteredContent = "";
  entredTitle = "";
  mode = "create";
  private postId: string= '';
  postItem : Post = {content: "", title: ""};
  constructor(public postService: PostService , public route: ActivatedRoute) { }

  onSavePost(form: NgForm): void {
    if(form.invalid) {
      return
    } else {
      if(this.mode === 'create') {
        this.postService.addPost({
          title: form.value.title,
          content: form.value.content
        })
      } else  {
        this.postService.updatePost(this.postId, form.value.title, form.value.content)
      }
    }
    form.reset();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramsMap) => {
      if(paramsMap.has('id')) {
        this.mode = 'edit'
        this.postId = paramsMap.get('id') as string;
        // @ts-ignore
        this.postItem = this.postService.getPostItem(this.postId)
      } else {
        this.mode = 'create'
      }
    });
  }
}
