import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, NgForm , Validators} from "@angular/forms";
import {PostService} from "../post.service";
import {ActivatedRoute} from "@angular/router";
import {Post} from "../post.model";
import { mimeType } from "./mine-type.validator";

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
  form: FormGroup = new FormGroup({});
  myImagePreview: string = "";

  /* onSavePost(form: NgForm): void {
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
 } */

ngOnInit(): void {
  this.form = new FormGroup({
    title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
    content: new FormControl(null, {validators: Validators.required} ),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType]
    })
  })
  this.route.paramMap.subscribe((paramsMap) => {
    if(paramsMap.has('postId')) {
      this.mode = 'edit'
      this.postId = paramsMap.get('id') as string;
      this.loading = true;
      setTimeout(() => {
        this.postService.getPostItem(this.postId).subscribe( postdata => {
          this.postItem = {
            _id: postdata._id as string,
            content: postdata.content,
            title: postdata.title,
            imagePath: ""
          }
          this.form.setValue({
            'title': this.postItem.title,
            'content': this.postItem.content})
        })
        this.loading = false;
      }, 500)
    } else {
      this.mode = 'create'
    }
  });
}
  onSavePost(): void {
    this.loading = true;
    if(this.form.invalid) {
      return
    } else {
      if(this.mode === 'create') {
        this.postService.addPost( this.form.value.title, this.form.value.content, this.form.value.image)
      } else  {
        this.postService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content)
      }
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    // @ts-ignore
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file})
    this.form.get('image')?.updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.myImagePreview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }
}
