import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { Post } from '../models/post.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Interaction } from '../models/interaction.model';
import { Comment } from '../models/comment.model';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { AuthenticationService } from '../user-authentication/authentication.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {  YouTubePlayerModule } from '@angular/youtube-player';


@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule,YouTubePlayerModule ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit{

  post: Post | undefined
  posts: any
  comments: Comment[]=[]
  likes: Interaction[] = []
  saves: Interaction[] = []
  currentUser: User | undefined
  mostrarComments: Boolean = false
  userPosts : Post[] = []
  isAdmin: Boolean = false;
 

  commentForm = this.fb.group({
    id: [0],
    content: ['', Validators.required],
    user: new FormControl(),
    date: new Date()
  });

  constructor (private authService: AuthenticationService, 
    private fb:FormBuilder, 
    private http: HttpClient, 
    private activatedRoute: ActivatedRoute, 
    private router:Router,
    private location:Location,
    private sanitizer:DomSanitizer){
    this.authService.isAdmin.subscribe(isAdmin=>this.isAdmin=isAdmin);
  }

  ngOnInit(): void {
    console.log('PostDetailComponent');

       
    this.loadPost();

  }

  isPostfromUser():boolean {
    
    return this.post !== undefined && this.userPosts.includes(this.post);
  }

  loadPost() {
    
    this.activatedRoute.params.subscribe(params => {
      this.http.get<Post>("https://sm-render.onrender.com/post/" +
      params['id']).subscribe(p => {this.post=p;
        console.log(this.post);
    });

    this.http.get<Comment[]>("https://sm-render.onrender.com/post/"+params['id']+"/comments").subscribe(c=>this.comments=c);
    this.http.get<Interaction[]>("https://sm-render.onrender.com/post/"+params['id']+"/interactions/likes").subscribe(i=>this.likes=i);
    this.http.get<Interaction[]>("https://sm-render.onrender.com/post/"+params['id']+"/interactions/saves").subscribe(i=>this.saves=i);
    this.http.get<User>('https://sm-render.onrender.com/user/account').subscribe( u => {this.currentUser = u;
    this.http.get<Post[]>("https://sm-render.onrender.com/post/user/"+this.currentUser.id).subscribe(ps => {
      this.userPosts=ps;
    });
       
    })

  });
  }

  deletePost(postId: number){
    const url = "https://sm-render.onrender.com/post/"+postId;
    this.http.delete<Boolean>(url).subscribe(b => {
      console.log(b);
      this.router.navigate(['/posts']);
    });
  }

  saveComments(){
    const id = this.commentForm.get('id')?.value?? 0;
    const content = this.commentForm.get('content')?.value?? 'Contenido comentario';
    const user = this.commentForm.get('user')?.value?? this.currentUser;
    const date = this.commentForm.get('date')?.value?? new Date();

   
    const commentToSave: Comment = {
      id: id,
      content: content,
      user: user,
      date: date
    }

   const url1 = 'https://sm-render.onrender.com/comment';
     
    this.http.post<Comment>(url1, commentToSave).subscribe(comment => {
      const url2 = 'https://sm-render.onrender.com/post/'+this.post?.id+"/add-comment/"+comment?.id;
      this.http.post<Post>(url2,this.post ).subscribe(p=> {
        console.log(p);
        this.commentForm.reset();
        this.loadPost();
    });
    });

    
  }

  toggleComments(){
    this.mostrarComments= !this.mostrarComments;
  }

  addlike(){
    if (!this.currentUser||!this.post) return;
    const id:number = 0;
    const type: string ='LIKE';
    const user: User  = this.currentUser;
    const post: Post = this.post;
    const date: Date = new Date();

    let interactionToSave: Interaction = {
      id: id,
      user: user,
      post: post,
      type: type,
      date: date
    }

    const urlLike = 'https://sm-render.onrender.com/post/'+this.post?.id+'/add-like/'+this.currentUser?.id;
    this.http.post<Boolean>(urlLike,interactionToSave).subscribe(b => this.loadPost());
  }

  addsave(){
    if(!this.currentUser!||!this.post) return;
    const id:number = 0;
    const type: string ='SAVE';
    const user: User = this.currentUser;
    const post: Post = this.post;
    const date: Date = new Date();

    let interactionToSave: Interaction = {
      id: id,
      user: user,
      post: post,
      type: type,
      date: date
    }

    const urlLike = 'https://sm-render.onrender.com/post/'+this.post?.id +'/add-save/'+this.currentUser?.id;
    this.http.post<Boolean>(urlLike,interactionToSave).subscribe(b => this.loadPost());
  }

  goBack(): void {
    this.location.back();
  }

  formatDateTime (date: string): string {
    const formattedDate = new Date(date);
  // Sumar dos horas a la hora registrada
    formattedDate.setHours(formattedDate.getHours() + 2);
    // Obtener los componentes de la fecha
    
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    const hours = formattedDate.getHours().toString().padStart(2, '0');
    const minutes = formattedDate.getMinutes().toString().padStart(2, '0');
  
    // Combinar los componentes en el formato deseado
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }


  ExistsLikeFromUser(): boolean{
    for (const item of this.likes) {
      if (item.user.id === this.currentUser?.id && item.type === 'LIKE' )
        return true;
    }
    return false;
    // return this.likes.some(item => item.user.id === this.currentUser.id && item.type === 'LIKE');
  }

  getSafeUrl(videoUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + videoUrl);
  }


  
}
