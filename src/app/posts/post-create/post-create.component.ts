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
  postItem: Post = {_id: "", content: "", title: ""};
  constructor(public postService: PostService , public route: ActivatedRoute) { };
  loading = false;

  onSavePost(form: NgForm): void {
    this.loading = true;
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
        this.loading = true;
        setTimeout(() => {
          this.postService.getPostItem(this.postId).subscribe( postdata => {
            this.postItem = {_id: postdata._id as string, content: postdata.content, title: postdata.title}
          })
          this.loading = false;
        }, 500)

      } else {
        this.mode = 'create'
      }
    });
  }
}
