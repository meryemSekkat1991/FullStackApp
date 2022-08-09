import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {PostService} from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  enteredContent = "";
  entredTitle = "";
  constructor(public postService: PostService) { }

  onAddPost(form: NgForm): void {
    if(form.invalid) {
      return
    } else {
      this.postService.addPost({
        title: form.value.title,
        content: form.value.content
      })
    }
    form.reset();
  }

  ngOnInit(): void {
  }
}
