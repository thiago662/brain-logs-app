import { ChangeDetectionStrategy, Component, input } from '@angular/core';

let nextId = 0;

/**
 * Marca: cérebro desenhado com linhas de log (verde → amarelo → azul).
 * `grain` aplica o granulado (só vale a pena no logo grande; em ~40px vira sujeira).
 * O tamanho vem do CSS do host (largura); a altura segue o viewBox.
 */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ':host{display:block}svg{display:block;width:100%;height:auto}',
  template: `
    <svg viewBox="0 8 96 56" aria-hidden="true">
      <defs>
        <linearGradient [attr.id]="id" gradientUnits="userSpaceOnUse" x1="4" y1="0" x2="92" y2="0">
          <stop offset="0" stop-color="#4DF07D" />
          <stop offset=".5" stop-color="#FFD93D" />
          <stop offset="1" stop-color="#3B7BFF" />
        </linearGradient>
        @if (grain()) {
          <filter [attr.id]="id + 'f'" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="2.4" numOctaves="2" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="saturate" values="0" result="g" />
            <feComponentTransfer in="g" result="gc">
              <feFuncR type="linear" slope="2.2" intercept="-.6" />
              <feFuncG type="linear" slope="2.2" intercept="-.6" />
              <feFuncB type="linear" slope="2.2" intercept="-.6" />
            </feComponentTransfer>
            <feBlend in="gc" in2="SourceGraphic" mode="overlay" result="b" />
            <feComposite in="b" in2="SourceGraphic" operator="in" />
          </filter>
        }
      </defs>
      <g fill="none" stroke-width="8" [attr.stroke]="'url(#' + id + ')'" [attr.filter]="grain() ? 'url(#' + id + 'f)' : null">
        <path d="M22 14H33M36 14H46M50 14H61M64 14H74" />
        <path d="M10 25H25M28 25H46M50 25H71M74 25H86" />
        <path d="M4 36H17M20 36H46M50 36H79M82 36H92" />
        <path d="M10 47H31M34 47H46M50 47H65M68 47H86" />
        <path d="M22 58H42M54 58H74" />
      </g>
    </svg>
  `,
})
export class Logo {
  readonly grain = input(false);
  protected readonly id = `logo${nextId++}`;
}
