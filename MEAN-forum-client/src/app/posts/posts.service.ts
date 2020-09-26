
import { Post, PostData } from './post.model';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })

export class PostsService {

  private hostURL: string = 'http://localhost:3000';
  private apiURL: string = this.hostURL + '/api/posts';
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private post = new Subject<Post>();
  private loadingStatusListener = new BehaviorSubject<boolean>(false);

  //insert constructor to connect with API
  constructor(private http: HttpClient, private router: Router) { }

  //sends hostURL;
  getHostURL() {
    return this.hostURL;
  }

  //sends the status of the spinner wheel
  getLoadingStatusListener() {
    return this.loadingStatusListener.asObservable();
  }

  //redirects to main page
  loadMainPage() {
    this.getPosts();
    this.router.navigate(['/']);
  }

  //gets original posts from server (via http request) for the list
  getPosts(id: string = undefined, pageSize: number = undefined, currentPage: number = undefined) {
    this.loadingStatusListener.next(true);
    const query = (pageSize && currentPage) ? `?pagesize=${pageSize}&page=${currentPage}` : '';
    const urlQuery = id || query;

    this.http.get<{posts: Post[]}>(`${this.apiURL}/${urlQuery}`)
      .subscribe(
        payload => {
          if (id) {
            //get a single post
            this.post.next(payload.posts[0]); //returns single post for the listener
          } else {
            //get all posts (that satisfy a query)
            this.posts = payload.posts;
            this.postsUpdated.next([...this.posts]); //updates posts for the listener
          }
        },
        err => console.log('an error occured', err),
        () => this.loadingStatusListener.next(false)
      );
  }

  //returns single post for editing
  getSinglePostListener() {
    return this.post.asObservable();
  }

  //updates posts for the list
  getUpdatedPostsListener() {
    return this.postsUpdated.asObservable();
  }

  //creates a new post with the user's input
  createPost(post: PostData, imgFile: File) {
    this.loadingStatusListener.next(true);
    const postData = new FormData();
    postData.append("title", post.title);
    postData.append("content", post.content);
    if (imgFile) {
      postData.append("imgFile", imgFile, Math.random().toString());
    }

    this.http.post<{ message: string, post: Post }>(this.apiURL, postData)
      .subscribe(
        responseData => {
          const { post } = responseData
          this.posts.push(post); //update array
          this.postsUpdated.next([...this.posts]); //'share' update
        },
        err => console.log('an error occured', err),
        () => this.loadingStatusListener.next(false)
      );
  }

  //edits an existing post
  editPost(original: Post, responseData: PostData, imgFile: File = null) {
    this.loadingStatusListener.next(true);
    const editedPost = new FormData();
    editedPost.append("_id", original._id);
    editedPost.append("title", responseData.title);
    editedPost.append("content", responseData.content);

    if (imgFile) {
      editedPost.append("imgFile", imgFile, Math.random().toString());
    }
    if (original.imgPath) {
      editedPost.append("imgPath", original.imgPath);
    }
    this.http.patch(`${this.apiURL}/${original._id}`, editedPost)
      .subscribe(
        (result: { message: string }) => {
          //confirmation message (on browser console)
          console.log(result.message);
        },
        err => console.log('an error occured', err),
        () => this.loadingStatusListener.next(false)
      )
  }

  //deletes an existing post
  deletePost(id: string) {
    this.loadingStatusListener.next(true);
    const postURL = `${this.apiURL}/${id}`;
    const delURL = postURL;
    this.http.delete(delURL)
      .subscribe(
        (result: { message: string }) => {
          //update posts
          this.postsUpdated.next([...this.posts.filter(post => post._id !== id)])
          //confirmation message (on browser console)
          console.log(result.message);

        },
        err => console.log('an error occured', err),
        () => this.loadingStatusListener.next(false)
      )
  }
}
