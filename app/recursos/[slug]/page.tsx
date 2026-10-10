import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, type ArticleSlug } from "@/content/articles";
import { buildWhatsAppUrl } from "@/config/site";

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(articles).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug as ArticleSlug];
  return article ? { title: article.title, description: article.intro } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug as ArticleSlug];
  if (!article) notFound();

  return (
    <main className="article-page">
      <article className="shell article-shell">
        <Link className="article-back" href="/recursos">← Volver a recursos</Link>
        <span className="eyebrow">{article.category}</span>
        <h1>{article.title}</h1>
        <p className="article-intro">{article.intro}</p>
        <div className="article-body">
          {article.sections.map((section) => (
            <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>
          ))}
        </div>
        <div className="article-cta">
          <h2>¿Quieres conversar sobre tu situación?</h2>
          <p>Agenda una orientación inicial gratuita para identificar el siguiente paso más adecuado.</p>
          <a className="btn btn-primary" href={buildWhatsAppUrl("Hola Guadalupe, leí uno de tus recursos y quiero agendar una orientación inicial.")} rel="noopener" target="_blank">Agendar orientación gratuita</a>
        </div>
      </article>
    </main>
  );
}
