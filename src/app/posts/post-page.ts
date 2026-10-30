import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogInfo, BlogService, Post } from '../core/blog.service';
import { nivelKey } from '../core/fields';
import { renderMarkdown } from '../core/markdown';
import { Seo } from '../core/seo';

@Component({
  selector: 'app-post-page',
  imports: [RouterLink, DatePipe],
  templateUrl: './post-page.html',
})
export class PostPage implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(Seo);

  readonly slug = input.required<string>();

  protected readonly post = signal<Post | null>(null);
  protected readonly nivelKey = nivelKey;
  protected readonly blog = signal<BlogInfo | null>(null);
  protected readonly notFound = signal(false);
  /** Inserido via [innerHTML]: o Angular sanitiza (remove scripts, eventos, javascript:). */
  protected readonly html = computed(() => renderMarkdown(this.post()?.body ?? ''));

  async ngOnInit() {
    const [post, blog] = await Promise.all([this.blogService.getPost(this.slug()), this.blogService.getBlog()]);
    this.blog.set(blog);
    if (!post) {
      this.notFound.set(true);
      this.seo.set({ title: 'Post não encontrado — Brain Logs', description: '', path: `/${this.slug()}`, noindex: true });
      return;
    }
    this.post.set(post);
    this.seo.set({
      title: `${post.title} — Brain Logs`,
      description: post.summary || post.subtitle,
      path: `/${post.slug}`,
      image: post.coverUrl || undefined,
      type: 'article',
      publishedAt: post.publishedAt,
    });
  }
}
