import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

type Auth = { session: Session | null; ready: boolean };
const Ctx = createContext<Auth>({ session: null, ready: false });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Auth>({ session: null, ready: false });
  useEffect(() => {
    let live = true;
    supabase.auth.getSession().then(({ data }) => live && setState({ session: data.session, ready: true })).catch(() => live && setState({ session: null, ready: true }));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setState({ session, ready: true }));
    return () => { live = false; data.subscription.unsubscribe(); };
  }, []);
  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
};
export const useAuth = () => useContext(Ctx);
