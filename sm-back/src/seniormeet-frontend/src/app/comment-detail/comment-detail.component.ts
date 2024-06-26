import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-comment-detail',
  standalone: true,
  imports: [],
  templateUrl: './comment-detail.component.html',
  styleUrl: './comment-detail.component.css'
})
export class CommentDetailComponent implements OnInit{
  comment: Comment | undefined
  comments: any;

  constructor (private http: HttpClient, private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    console.log('CommentDetailComponent');

    this.activatedRoute.params.subscribe(params=> {
      this.http.get<Comment>("https://sm-render.onrender.com/comment/" + params['id']).subscribe(c=>{
        this.comment=c;
        console.log(this.comment);
      })
     })
  }

}
