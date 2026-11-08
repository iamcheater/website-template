import type { ReactNode } from "react";

interface StatusPageProps {
  code?: string;
  title: string;
  description: string;
  action: ReactNode;
}

export function StatusPage({ code, title, description, action }: StatusPageProps) {
  return (
    <section className="status-page">
      <div className="container status-page__inner">
        {code && <p className="status-page__code">{code}</p>}
        <h1 className="status-page__title">{title}</h1>
        <p className="status-page__description">{description}</p>
        <div className="status-page__action">{action}</div>
      </div>
    </section>
  );
}
