import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogInfo, BlogService, PostSummary } from '../core/blog.service';
import { nivelKey } from '../core/fields';
import { Logo } from '../core/logo';
import { Seo } from '../core/seo';

@Component({
  selector: 'app-post-list',
  imports: [RouterLink, DatePipe, Logo],
  templateUrl: './post-list.html',
})
export class PostList implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(Seo);

  protected readonly nivelKey = nivelKey;
  protected readonly blog = signal<BlogInfo | null>(null);
  protected readonly posts = signal<PostSummary[] | null>(null);

  async ngOnInit() {
    const [blog, posts] = await Promise.all([this.blogService.getBlog(), this.blogService.listPosts()]);
    this.blog.set(blog);
    this.posts.set(posts);
    this.seo.set({
      title: blog?.name || 'Brain Logs',
      description: blog?.description || 'Tecnologia, estudos e carreira em desenvolvimento de software.',
      path: '/',
    });
  }
}
