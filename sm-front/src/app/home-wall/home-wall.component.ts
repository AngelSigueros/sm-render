import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbCarouselConfig, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { Group } from '../models/group.model';
import { RouterLink } from '@angular/router';
import { Hobby } from '../models/hobby.model';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-home-wall',
  standalone: true,
  imports: [NgbCarouselModule, RouterLink],
  templateUrl: './home-wall.component.html',
  styleUrl: './home-wall.component.css'
})
export class HomeWallComponent {
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);
  groups: Group[] = [];
  hobbies: Hobby[]=[];
  posts: Post[]=[];
  comments: Comment[]=[];
  users: User[]=[];

  

	constructor(config: NgbCarouselConfig, private http: HttpClient) {
		// customize default values of carousels used by this component tree
/* 		config.interval = 10000;
		config.wrap = false;
		config.keyboard = false;
		config.pauseOnHover = false; */
	}

  ngOnInit(): void {
    console.log('GroupListComponent');
  
    this.http.get<Group[]>("https://sm-render.onrender.com/groups").subscribe(g=>this.groups=g);
    this.http.get<Hobby[]>("https://sm-render.onrender.com/hobbies").subscribe(hobbies=>this.hobbies=hobbies);
    this.http.get<Post[]>("https://sm-render.onrender.com/post").subscribe(posts=>this.posts=posts);
  }
}