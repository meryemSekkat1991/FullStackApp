import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Post} from "../post.model";
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
      }).subscribe(() => {
        console.log('posted')
        });
    }
    form.reset();
  }

  ngOnInit(): void {
  }
}
