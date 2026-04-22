import React, { createContext, useContext, useMemo } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

export const SUPPORTED_LANGS = ['ro', 'en', 'ru'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const LangContext = createContext<SupportedLang>('ro');

export function LangProvider({
  lang,
  children,
}: {
  lang: SupportedLang;
  children: React.ReactNode;
}) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): SupportedLang {
  return useContext(LangContext);
}

function isSupportedLang(lang: string): lang is SupportedLang {
  return (SUPPORTED_LANGS as readonly string[]).includes(lang);
}

export function normalizeLang(input: string | undefined): SupportedLang {
  const base = (input || 'ro').split('-')[0].toLowerCase();
  return isSupportedLang(base) ? base : 'ro';
}

export function stripLangPrefix(pathname: string): string {
  const m = pathname.match(/^\/(ro|en|ru)(\/|$)/i);
  if (!m) return pathname || '/';
  const rest = pathname.slice(m[0].length - 1); // keep leading "/" of the rest
  return rest === '' ? '/' : rest;
}

export function withLangPrefix(lang: SupportedLang, to: string): string {
  if (!to.startsWith('/')) return to;
  if (to === '/') return `/${lang}`;
  return `/${lang}${to}`;
}

/**
 * Drop-in replacement for `react-router-dom` Link.
 * Prefixes absolute app paths with `/{lang}`.
 */
export function LangLink({
  to,
  ...rest
}: Omit<LinkProps, 'to'> & { to: LinkProps['to'] }) {
  const lang = useLang();
  const resolvedTo = useMemo(() => {
    if (typeof to === 'string') return withLangPrefix(lang, to);
    // ToObject: only prefix pathnames that are absolute.
    if (to && typeof to === 'object' && typeof to.pathname === 'string') {
      const pathname = to.pathname;
      if (pathname.startsWith('/')) {
        return { ...to, pathname: withLangPrefix(lang, pathname) };
      }
    }
    return to;
  }, [lang, to]);

  return <Link to={resolvedTo} {...rest} />;
}

