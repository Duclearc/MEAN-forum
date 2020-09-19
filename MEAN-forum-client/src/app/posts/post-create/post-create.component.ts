import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})

export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post = { _id: null, title: null, content: null, imgPath: null, creator: null };
  private postSubscription: Subscription;
  mode: string = 'Create';

  constructor(public postsService: PostsService, public route: ActivatedRoute) {
  }

  ngOnInit() {
    //checks if component should be on edit or create mode based on the route that activated it
    this.route.paramMap
    .pipe(
      filter((paramMap: ParamMap) => paramMap.has('id'))
      )
      .subscribe((paramMap: ParamMap) => {
        this.mode = 'Edit';
        this.postsService.getPosts(paramMap.get('id'));
        this.postSubscription = this.postsService.getSinglePostListener()
        .subscribe((data: Post) => {
          this.post = data;
          this.imgPreview = data.imgPath;
        })
      })
    }

  isLoading$ = this.postsService.getLoadingStatusListener();

  ngOnDestroy() {
    this.postSubscription?.unsubscribe();
  }

  imgPreview: string = '';
  imgFile: File = null;
  onImgPick(event: Event) {
    this.imgFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => this.imgPreview = reader.result as string;
    reader.readAsDataURL(this.imgFile);
  }

  //if form is valid, activates service to...
  onSavePost(form: NgForm) {
    if (form.invalid) { return }
    if (this.mode === 'Edit') {
      //...on edit-mode, edit an existing post
      this.postsService.editPost(this.post, form.value, this.imgFile);
    } else {
      //...on create-mode, create a brand new post...
      this.postsService.createPost(form.value, this.imgFile);
      //...then clean form for new input
      form.resetForm();
    }
    this.postsService.loadMainPage();
  }
}
