import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

  private postsSubscription: Subscription;
  private userSubscription: Subscription;
  private authSubscription: Subscription;

  isLoading$: Observable<boolean>;
  hostURL: string = null;
  isAuth: boolean = false;
  userId: string = null;
  postsArray: Post[] = null;
  totalPosts: number = null;
  itemsPerPage: number = null;
  currentPage: number = 1;

  constructor(public postsService: PostsService, private authService: AuthService) {
    this.isLoading$ = postsService.getLoadingStatusListener();
  };

  //gets initial and updated posts array
  ngOnInit() {
    this.hostURL = this.postsService.getHostURL();
    //checks if user is logged in in order to display the appropriate header buttons
    this.authSubscription = this.authService.getAuthStatusListener()
      .subscribe(userIsAuthenticated => {
        this.isAuth = userIsAuthenticated;
      });
    this.userSubscription = this.authService.getUserListener()
      .subscribe(user => this.userId = user?.id)
    this.postsService.getPosts(null, this.itemsPerPage, this.currentPage);
    this.postsSubscription = this.postsService.getUpdatedPostsListener()
      .subscribe((posts: Post[]) => {
        if (!this.totalPosts) {
          this.totalPosts = posts.length;
          this.itemsPerPage = this.totalPosts;
          this.pageSizeOptions();
        }
        this.postsArray = posts;
      });
  }

  //unsubscribes to avoid memory leaks
  ngOnDestroy() {
    this.postsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  //gets the total, quarter, third and half of the amount of posts as options for the pagination.
  eliminateDuplicates = (item: number, index: number, thisArray: []) => thisArray[index] !== thisArray[index + 1];
  pageSizeOptions = (totalPosts: number = this.totalPosts) => [
    totalPosts,
    Math.round(totalPosts / 2),
    Math.round(totalPosts / 3),
    Math.round(totalPosts / 4)
  ].sort().filter(this.eliminateDuplicates);

  //changes amount of posts shown per page
  onChangePage(pageData: PageEvent) {
    this.itemsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postsService.getPosts(null, this.itemsPerPage, this.currentPage);
  }

  //delete button
  onDelete(id: string) {
    this.totalPosts = null;
    this.itemsPerPage = null;
    this.postsService.deletePost(id);
    this.postsService.loadMainPage();
  }
}
