import React from 'react';

export const SectionHead: React.FC<{ eyebrow?: string; title: string; lead?: string; center?: boolean; as?: 'h1' | 'h2' }> = ({ eyebrow, title, lead, center, as = 'h2' }) => {
  const H = as;
  return (
    <div className={center ? 'mx-auto max-w-[720px] text-center' : 'max-w-[720px]'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H className={`${as === 'h1' ? 'text-display' : 'text-title'} mt-3 text-ink`}>{title}</H>
      {lead && <p className="mt-5 text-lead text-muted">{lead}</p>}
    </div>
  );
};

/** Standard page top for text pages: clears the floating nav. */
export const PageTop: React.FC<{ children: React.ReactNode }> = ({ children }) => <section className="page-x pb-14 pt-[132px] md:pb-20 md:pt-[168px]">{children}</section>;
